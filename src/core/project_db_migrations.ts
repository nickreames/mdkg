import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Config } from "./config";
import {
  PROJECT_DB_CONFIG_SCHEMA_VERSION,
  resolveConfiguredProjectDbLayout,
} from "./project_db";
import { readPackageVersion } from "./version";
import { atomicWriteFile } from "../util/atomic";
import { ValidationError } from "../util/errors";

type DatabaseSyncType = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: unknown[]): unknown;
    get(...values: unknown[]): Record<string, unknown> | undefined;
    all(...values: unknown[]): Array<Record<string, unknown>>;
  };
  close(): void;
};

type DatabaseCtor = new (filename: string) => DatabaseSyncType;

type BuiltinMigration = {
  ordinal: number;
  key: string;
  filename: string;
  sql: string;
};

type AppliedMigration = {
  migration_key: string;
  ordinal: number;
  checksum: string;
  applied_at_ms: number;
};

export type ProjectDbMigrationStatus = {
  key: string;
  ordinal: number;
  checksum: string;
  status: "applied" | "already_applied";
  applied_at_ms: number;
};

export type ProjectDbMigrationReceipt = {
  action: "db-migrate";
  ok: true;
  database: string;
  schema_version: number;
  migration_table: string;
  applied_count: number;
  skipped_count: number;
  migrations: ProjectDbMigrationStatus[];
  migration_files: {
    created: string[];
    unchanged: string[];
  };
};

const FOUNDATION_MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS project_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
) STRICT;
`;

const BUILTIN_MIGRATIONS: BuiltinMigration[] = [
  {
    ordinal: 1,
    key: "mdkg.project_db.foundation.v1",
    filename: "001_mdkg_project_db_foundation.sql",
    sql: FOUNDATION_MIGRATION_SQL.trim(),
  },
];

function loadDatabaseCtor(): DatabaseCtor {
  try {
    const loaded = require("node:sqlite") as { DatabaseSync?: DatabaseCtor };
    if (!loaded.DatabaseSync) {
      throw new Error("node:sqlite DatabaseSync is unavailable");
    }
    return loaded.DatabaseSync;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`node:sqlite is required for mdkg project DB migrations: ${message}`);
  }
}

function toPosix(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

function rel(root: string, filePath: string): string {
  return toPosix(path.relative(root, filePath));
}

function checksumMigration(migration: BuiltinMigration): string {
  const payload = [
    `ordinal:${migration.ordinal}`,
    `key:${migration.key}`,
    migration.sql.trim(),
  ].join("\n");
  return `sha256:${crypto.createHash("sha256").update(payload).digest("hex")}`;
}

function checksumContent(content: string): string {
  return `sha256:${crypto.createHash("sha256").update(content.trim()).digest("hex")}`;
}

function assertDirectory(root: string, dirPath: string, label: string): void {
  const relative = rel(root, dirPath);
  if (!fs.existsSync(dirPath)) {
    throw new ValidationError(`${label} missing at ${relative}; run mdkg db init`);
  }
  if (!fs.statSync(dirPath).isDirectory()) {
    throw new ValidationError(`${relative} exists and is not a directory`);
  }
}

function assertProjectDbReady(root: string, config: Config): void {
  if (!config.db.enabled) {
    throw new ValidationError("project db is disabled; run mdkg db init first");
  }
  if (config.db.schema_version !== PROJECT_DB_CONFIG_SCHEMA_VERSION) {
    throw new ValidationError(
      `unsupported project db schema_version ${config.db.schema_version}; supported ${PROJECT_DB_CONFIG_SCHEMA_VERSION}`
    );
  }
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  assertDirectory(root, layout.db, "project db root");
  assertDirectory(root, layout.schema, "project db schema directory");
  assertDirectory(root, layout.migrations, "project db migrations directory");
  assertDirectory(root, layout.runtimeDir, "project db runtime directory");
  assertDirectory(root, layout.stateDir, "project db state directory");
  assertDirectory(root, layout.receipts, "project db receipts directory");
  if (fs.existsSync(layout.runtimeFile) && fs.statSync(layout.runtimeFile).isDirectory()) {
    throw new ValidationError(`${rel(root, layout.runtimeFile)} exists and is not a file`);
  }
}

function ensureMigrationFiles(root: string, config: Config): { created: string[]; unchanged: string[] } {
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const created: string[] = [];
  const unchanged: string[] = [];
  for (const migration of BUILTIN_MIGRATIONS) {
    const filePath = path.join(layout.migrations, migration.filename);
    const expectedContent = `${migration.sql.trim()}\n`;
    const relative = rel(root, filePath);
    if (fs.existsSync(filePath)) {
      if (fs.statSync(filePath).isDirectory()) {
        throw new ValidationError(`${relative} exists and is not a file`);
      }
      const current = fs.readFileSync(filePath, "utf8");
      if (checksumContent(current) !== checksumContent(expectedContent)) {
        throw new ValidationError(`migration file checksum drift at ${relative}`);
      }
      unchanged.push(relative);
      continue;
    }
    atomicWriteFile(filePath, expectedContent);
    created.push(relative);
  }
  return { created, unchanged };
}

function createMigrationTableSql(tableName: string): string {
  return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      migration_key TEXT PRIMARY KEY,
      ordinal INTEGER NOT NULL UNIQUE,
      checksum TEXT NOT NULL,
      applied_at_ms INTEGER NOT NULL,
      mdkg_version TEXT NOT NULL
    ) STRICT;
  `;
}

function readAppliedMigrations(db: DatabaseSyncType, tableName: string): Map<string, AppliedMigration> {
  const rows = db
    .prepare(`SELECT migration_key, ordinal, checksum, applied_at_ms FROM ${tableName} ORDER BY ordinal ASC`)
    .all();
  const applied = new Map<string, AppliedMigration>();
  for (const row of rows) {
    applied.set(String(row.migration_key), {
      migration_key: String(row.migration_key),
      ordinal: Number(row.ordinal),
      checksum: String(row.checksum),
      applied_at_ms: Number(row.applied_at_ms),
    });
  }
  return applied;
}

function assertIntegrity(db: DatabaseSyncType): void {
  const row = db.prepare("PRAGMA integrity_check").get();
  const value = String(Object.values(row ?? {})[0] ?? "");
  if (value !== "ok") {
    throw new ValidationError(`project DB integrity check failed: ${value}`);
  }
}

function syncProjectMeta(db: DatabaseSyncType, config: Config): void {
  const upsert = db.prepare(
    "INSERT INTO project_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value WHERE value <> excluded.value"
  );
  upsert.run("tool", "mdkg");
  upsert.run("schema_version", String(config.db.schema_version));
  upsert.run("mdkg_version", readPackageVersion());
  upsert.run("migration_table", config.db.migration_table);
  upsert.run("last_migration_key", BUILTIN_MIGRATIONS[BUILTIN_MIGRATIONS.length - 1].key);
}

export function runProjectDbMigrations(root: string, config: Config): ProjectDbMigrationReceipt {
  assertProjectDbReady(root, config);
  const migrationFiles = ensureMigrationFiles(root, config);
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  fs.mkdirSync(path.dirname(layout.runtimeFile), { recursive: true });

  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(layout.runtimeFile);
  const statuses: ProjectDbMigrationStatus[] = [];
  let appliedCount = 0;
  try {
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec("PRAGMA synchronous = FULL;");
    assertIntegrity(db);
    db.exec(createMigrationTableSql(config.db.migration_table));
    db.exec("BEGIN IMMEDIATE");
    try {
      const applied = readAppliedMigrations(db, config.db.migration_table);
      const knownKeys = new Set(BUILTIN_MIGRATIONS.map((migration) => migration.key));
      for (const appliedKey of applied.keys()) {
        if (!knownKeys.has(appliedKey)) {
          throw new ValidationError(`project DB contains unsupported migration ${appliedKey}`);
        }
      }
      const now = Date.now();
      for (const migration of BUILTIN_MIGRATIONS) {
        const checksum = checksumMigration(migration);
        const row = applied.get(migration.key);
        if (row) {
          if (row.ordinal !== migration.ordinal) {
            throw new ValidationError(`migration order drift for ${migration.key}`);
          }
          if (row.checksum !== checksum) {
            throw new ValidationError(`migration checksum drift for ${migration.key}`);
          }
          statuses.push({
            key: migration.key,
            ordinal: migration.ordinal,
            checksum,
            status: "already_applied",
            applied_at_ms: row.applied_at_ms,
          });
          continue;
        }
        db.exec(migration.sql);
        const appliedAt = now + appliedCount;
        db
          .prepare(
            `INSERT INTO ${config.db.migration_table} (migration_key, ordinal, checksum, applied_at_ms, mdkg_version) VALUES (?, ?, ?, ?, ?)`
          )
          .run(migration.key, migration.ordinal, checksum, appliedAt, readPackageVersion());
        statuses.push({
          key: migration.key,
          ordinal: migration.ordinal,
          checksum,
          status: "applied",
          applied_at_ms: appliedAt,
        });
        appliedCount += 1;
      }
      syncProjectMeta(db, config);
      db.exec("COMMIT");
    } catch (err) {
      try {
        db.exec("ROLLBACK");
      } catch {
        // ignore rollback failures when no transaction is active
      }
      throw err;
    }
    assertIntegrity(db);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new ValidationError(`project DB migration failed: ${message}`);
  } finally {
    db.close();
  }

  return {
    action: "db-migrate",
    ok: true,
    database: rel(root, layout.runtimeFile),
    schema_version: config.db.schema_version,
    migration_table: config.db.migration_table,
    applied_count: appliedCount,
    skipped_count: statuses.length - appliedCount,
    migrations: statuses,
    migration_files: {
      created: migrationFiles.created.sort(),
      unchanged: migrationFiles.unchanged.sort(),
    },
  };
}
