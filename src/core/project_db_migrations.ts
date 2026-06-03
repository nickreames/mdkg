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

export type ProjectDbCheck = {
  name: string;
  ok: boolean;
  level: "ok" | "warn" | "fail";
  path?: string;
  detail: string;
  errors: string[];
  warnings: string[];
};

export type ProjectDbVerifyReceipt = {
  action: "db-verify";
  ok: boolean;
  enabled: boolean;
  database: string;
  schema_version: number;
  migration_table: string;
  checks: ProjectDbCheck[];
  warning_count: number;
  failure_count: number;
  warnings: string[];
  errors: string[];
};

export type ProjectDbStatsReceipt = {
  action: "db-stats";
  ok: true;
  enabled: boolean;
  database: string;
  schema_version: number;
  migration_table: string;
  db_size: number;
  transient_files: Array<{ path: string; exists: boolean; size: number }>;
  migration_count: number;
  latest_migration: ProjectDbMigrationStatus | null;
  tables: Array<{ name: string; row_count: number }>;
  state_snapshot: { path: string; exists: boolean; size: number };
  receipt_files: { path: string; count: number };
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

function directoryCheck(root: string, dirPath: string, name: string): ProjectDbCheck {
  const relative = rel(root, dirPath);
  if (!fs.existsSync(dirPath)) {
    return {
      name,
      ok: false,
      level: "fail",
      path: relative,
      detail: `${name} missing`,
      errors: [`${relative} missing; run mdkg db init`],
      warnings: [],
    };
  }
  if (!fs.statSync(dirPath).isDirectory()) {
    return {
      name,
      ok: false,
      level: "fail",
      path: relative,
      detail: `${name} is not a directory`,
      errors: [`${relative} exists and is not a directory`],
      warnings: [],
    };
  }
  return {
    name,
    ok: true,
    level: "ok",
    path: relative,
    detail: `${name} exists`,
    errors: [],
    warnings: [],
  };
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

function checkMigrationFiles(root: string, config: Config): ProjectDbCheck {
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const errors: string[] = [];
  for (const migration of BUILTIN_MIGRATIONS) {
    const filePath = path.join(layout.migrations, migration.filename);
    const relative = rel(root, filePath);
    const expectedContent = `${migration.sql.trim()}\n`;
    if (!fs.existsSync(filePath)) {
      errors.push(`${relative} missing; run mdkg db migrate`);
      continue;
    }
    if (fs.statSync(filePath).isDirectory()) {
      errors.push(`${relative} exists and is not a file`);
      continue;
    }
    const current = fs.readFileSync(filePath, "utf8");
    if (checksumContent(current) !== checksumContent(expectedContent)) {
      errors.push(`migration file checksum drift at ${relative}`);
    }
  }
  return {
    name: "migration-files",
    ok: errors.length === 0,
    level: errors.length === 0 ? "ok" : "fail",
    path: rel(root, layout.migrations),
    detail: errors.length === 0 ? "migration files match mdkg-owned foundation migrations" : "migration file issues found",
    errors,
    warnings: [],
  };
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

function integrityCheck(db: DatabaseSyncType): ProjectDbCheck {
  try {
    const row = db.prepare("PRAGMA integrity_check").get();
    const value = String(Object.values(row ?? {})[0] ?? "");
    if (value !== "ok") {
      return {
        name: "sqlite-integrity",
        ok: false,
        level: "fail",
        detail: `integrity check failed: ${value}`,
        errors: [`project DB integrity check failed: ${value}`],
        warnings: [],
      };
    }
    return {
      name: "sqlite-integrity",
      ok: true,
      level: "ok",
      detail: "SQLite integrity check ok",
      errors: [],
      warnings: [],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      name: "sqlite-integrity",
      ok: false,
      level: "fail",
      detail: "failed to read SQLite database",
      errors: [`failed to read project DB: ${message}`],
      warnings: [],
    };
  }
}

function quoteIdentifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function tableExists(db: DatabaseSyncType, tableName: string): boolean {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return row !== undefined;
}

function migrationTableCheck(db: DatabaseSyncType, config: Config): ProjectDbCheck {
  const errors: string[] = [];
  if (!tableExists(db, config.db.migration_table)) {
    errors.push(`migration table ${config.db.migration_table} missing; run mdkg db migrate`);
  } else {
    const applied = readAppliedMigrations(db, config.db.migration_table);
    const knownKeys = new Set(BUILTIN_MIGRATIONS.map((migration) => migration.key));
    for (const appliedKey of applied.keys()) {
      if (!knownKeys.has(appliedKey)) {
        errors.push(`project DB contains unsupported migration ${appliedKey}`);
      }
    }
    for (const migration of BUILTIN_MIGRATIONS) {
      const row = applied.get(migration.key);
      const checksum = checksumMigration(migration);
      if (!row) {
        errors.push(`migration ${migration.key} missing; run mdkg db migrate`);
        continue;
      }
      if (row.ordinal !== migration.ordinal) {
        errors.push(`migration order drift for ${migration.key}`);
      }
      if (row.checksum !== checksum) {
        errors.push(`migration checksum drift for ${migration.key}`);
      }
    }
  }
  return {
    name: "migrations",
    ok: errors.length === 0,
    level: errors.length === 0 ? "ok" : "fail",
    detail: errors.length === 0 ? "migration metadata is current" : "migration metadata issues found",
    errors,
    warnings: [],
  };
}

function transientFiles(root: string, runtimeFile: string): Array<{ path: string; exists: boolean; size: number }> {
  return ["-wal", "-shm", "-journal"]
    .map((suffix) => {
      const filePath = `${runtimeFile}${suffix}`;
      return {
        path: rel(root, filePath),
        exists: fs.existsSync(filePath),
        size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
      };
    })
    .filter((item) => item.exists);
}

function transientStateCheck(root: string, runtimeFile: string): ProjectDbCheck {
  const present = transientFiles(root, runtimeFile);
  const warnings = present.map((item) => `active transient SQLite file present: ${item.path}`);
  return {
    name: "transient-runtime-files",
    ok: true,
    level: warnings.length > 0 ? "warn" : "ok",
    detail: warnings.length > 0 ? "active transient runtime files are present" : "no active transient runtime files found",
    errors: [],
    warnings,
  };
}

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function tableCounts(db: DatabaseSyncType): Array<{ name: string; row_count: number }> {
  const rows = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC")
    .all();
  return rows.map((row) => {
    const name = String(row.name);
    const countRow = db.prepare(`SELECT COUNT(*) AS count FROM ${quoteIdentifier(name)}`).get();
    return { name, row_count: Number(countRow?.count ?? 0) };
  });
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

export function verifyProjectDb(root: string, config: Config): ProjectDbVerifyReceipt {
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const checks: ProjectDbCheck[] = [];
  checks.push({
    name: "config",
    ok: config.db.enabled && config.db.schema_version === PROJECT_DB_CONFIG_SCHEMA_VERSION,
    level: config.db.enabled && config.db.schema_version === PROJECT_DB_CONFIG_SCHEMA_VERSION ? "ok" : "fail",
    detail:
      !config.db.enabled
        ? "project db is disabled"
        : config.db.schema_version === PROJECT_DB_CONFIG_SCHEMA_VERSION
          ? "project db config is enabled and supported"
          : "project db schema version is unsupported",
    errors: [
      ...(!config.db.enabled ? ["project db is disabled; run mdkg db init"] : []),
      ...(config.db.schema_version !== PROJECT_DB_CONFIG_SCHEMA_VERSION
        ? [`unsupported project db schema_version ${config.db.schema_version}; supported ${PROJECT_DB_CONFIG_SCHEMA_VERSION}`]
        : []),
    ],
    warnings: [],
  });
  checks.push(directoryCheck(root, layout.db, "project db root"));
  checks.push(directoryCheck(root, layout.schema, "project db schema directory"));
  checks.push(directoryCheck(root, layout.migrations, "project db migrations directory"));
  checks.push(directoryCheck(root, layout.runtimeDir, "project db runtime directory"));
  checks.push(directoryCheck(root, layout.stateDir, "project db state directory"));
  checks.push(directoryCheck(root, layout.receipts, "project db receipts directory"));

  const databasePath = rel(root, layout.runtimeFile);
  if (!fs.existsSync(layout.runtimeFile)) {
    checks.push({
      name: "runtime-database",
      ok: false,
      level: "fail",
      path: databasePath,
      detail: "runtime database missing",
      errors: [`${databasePath} missing; run mdkg db migrate`],
      warnings: [],
    });
  } else if (fs.statSync(layout.runtimeFile).isDirectory()) {
    checks.push({
      name: "runtime-database",
      ok: false,
      level: "fail",
      path: databasePath,
      detail: "runtime database path is not a file",
      errors: [`${databasePath} exists and is not a file`],
      warnings: [],
    });
  } else {
    checks.push({
      name: "runtime-database",
      ok: true,
      level: "ok",
      path: databasePath,
      detail: "runtime database exists",
      errors: [],
      warnings: [],
    });
  }
  checks.push(transientStateCheck(root, layout.runtimeFile));

  const fatalBeforeOpen = checks.some((check) => !check.ok);
  if (!fatalBeforeOpen && fs.existsSync(layout.runtimeFile)) {
    checks.push(checkMigrationFiles(root, config));
    const DatabaseSync = loadDatabaseCtor();
    try {
      const db = new DatabaseSync(layout.runtimeFile);
      try {
        checks.push(integrityCheck(db));
        checks.push(migrationTableCheck(db, config));
      } finally {
        db.close();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      checks.push({
        name: "sqlite-open",
        ok: false,
        level: "fail",
        path: databasePath,
        detail: "failed to open runtime database",
        errors: [`failed to open project DB: ${message}`],
        warnings: [],
      });
    }
  }

  const errors = checks.flatMap((check) => check.errors.map((error) => `${check.name}: ${error}`));
  const warnings = checks.flatMap((check) => check.warnings.map((warning) => `${check.name}: ${warning}`));
  return {
    action: "db-verify",
    ok: errors.length === 0,
    enabled: config.db.enabled,
    database: databasePath,
    schema_version: config.db.schema_version,
    migration_table: config.db.migration_table,
    checks,
    warning_count: warnings.length,
    failure_count: errors.length,
    warnings,
    errors,
  };
}

export function projectDbStats(root: string, config: Config): ProjectDbStatsReceipt {
  const verification = verifyProjectDb(root, config);
  if (!verification.ok) {
    throw new ValidationError(`db stats requires a valid project DB; run mdkg db verify`);
  }
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(layout.runtimeFile);
  try {
    const applied = readAppliedMigrations(db, config.db.migration_table);
    const migrationStatuses: ProjectDbMigrationStatus[] = BUILTIN_MIGRATIONS
      .map((migration): ProjectDbMigrationStatus | undefined => {
        const row = applied.get(migration.key);
        return row
          ? {
              key: migration.key,
              ordinal: migration.ordinal,
              checksum: row.checksum,
              status: "already_applied" as const,
              applied_at_ms: row.applied_at_ms,
            }
          : undefined;
      })
      .filter((item): item is ProjectDbMigrationStatus => item !== undefined);
    const latestMigration = migrationStatuses[migrationStatuses.length - 1] ?? null;
    const receiptFiles = walkFiles(layout.receipts);
    return {
      action: "db-stats",
      ok: true,
      enabled: config.db.enabled,
      database: rel(root, layout.runtimeFile),
      schema_version: config.db.schema_version,
      migration_table: config.db.migration_table,
      db_size: fs.statSync(layout.runtimeFile).size,
      transient_files: transientFiles(root, layout.runtimeFile),
      migration_count: migrationStatuses.length,
      latest_migration: latestMigration,
      tables: tableCounts(db),
      state_snapshot: {
        path: rel(root, layout.stateFile),
        exists: fs.existsSync(layout.stateFile),
        size: fs.existsSync(layout.stateFile) ? fs.statSync(layout.stateFile).size : 0,
      },
      receipt_files: {
        path: rel(root, layout.receipts),
        count: receiptFiles.length,
      },
    };
  } finally {
    db.close();
  }
}
