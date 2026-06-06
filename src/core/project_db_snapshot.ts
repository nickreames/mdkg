import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Config } from "./config";
import { resolveConfiguredProjectDbLayout } from "./project_db";
import { readPackageVersion } from "./version";
import { atomicWriteFile } from "../util/atomic";
import { UsageError, ValidationError } from "../util/errors";
import { verifyProjectDb } from "./project_db_migrations";
import {
  ProjectQueueSnapshotSummary,
  readProjectQueueSnapshotSummary,
} from "./project_db_queue";

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

export type ProjectDbSnapshotMigration = {
  migration_key: string;
  ordinal: number;
  checksum: string;
  applied_at_ms: number;
};

export type ProjectDbSnapshotManifest = {
  manifest_version: 1;
  tool: "mdkg";
  kind: "project_db_snapshot";
  mdkg_version: string;
  generated_at: string;
  schema_version: number;
  migration_table: string;
  runtime_path: string;
  snapshot_path: string;
  source_runtime_sha256: string | null;
  snapshot_sha256: string;
  byte_size: number;
  table_counts: Array<{ name: string; row_count: number }>;
  migrations: ProjectDbSnapshotMigration[];
  queue_policy?: ProjectDbSnapshotQueuePolicy;
  queue_summary?: ProjectQueueSnapshotSummary;
};

export type ProjectDbSnapshotQueuePolicy = "drain" | "paused";

export type ProjectDbSnapshotCheck = {
  name: string;
  ok: boolean;
  level: "ok" | "warn" | "fail";
  path?: string;
  detail: string;
  errors: string[];
  warnings: string[];
};

export type ProjectDbSnapshotSealReceipt = {
  action: "db-snapshot-seal";
  ok: true;
  snapshot: string;
  manifest: string;
  old_snapshot_sha256: string | null;
  new_snapshot_sha256: string;
  source_runtime_sha256: string;
  byte_size: number;
  table_counts: Array<{ name: string; row_count: number }>;
  migrations: ProjectDbSnapshotMigration[];
  queue_policy: ProjectDbSnapshotQueuePolicy;
  queue_summary: ProjectQueueSnapshotSummary;
  warnings: string[];
};

export type ProjectDbSnapshotVerifyReceipt = {
  action: "db-snapshot-verify";
  ok: boolean;
  status: "valid" | "invalid" | "missing" | "stale";
  snapshot: string;
  manifest: string;
  checks: ProjectDbSnapshotCheck[];
  warning_count: number;
  failure_count: number;
  warnings: string[];
  errors: string[];
};

export type ProjectDbSnapshotStatusReceipt = Omit<ProjectDbSnapshotVerifyReceipt, "action"> & {
  action: "db-snapshot-status";
};

export type ProjectDbSnapshotDumpReceipt = {
  action: "db-snapshot-dump";
  ok: true;
  snapshot: string;
  output: string | null;
  line_count: number;
  sha256: string;
};

export type ProjectDbSnapshotDiffReceipt = {
  action: "db-snapshot-diff";
  ok: true;
  left: string;
  right: string;
  left_sha256: string;
  right_sha256: string;
  added_count: number;
  removed_count: number;
  changed_count: number;
  added: string[];
  removed: string[];
};

function loadDatabaseCtor(): DatabaseCtor {
  try {
    const loaded = require("node:sqlite") as { DatabaseSync?: DatabaseCtor };
    if (!loaded.DatabaseSync) {
      throw new Error("node:sqlite DatabaseSync is unavailable");
    }
    return loaded.DatabaseSync;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`node:sqlite is required for mdkg project DB snapshots: ${message}`);
  }
}

function toPosix(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

function rel(root: string, filePath: string): string {
  return toPosix(path.relative(root, filePath));
}

function isInside(root: string, filePath: string): boolean {
  const relative = path.relative(root, filePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function resolveContainedProjectDbPath(root: string, rawPath: string, label: string): string {
  if (rawPath.trim().length === 0) {
    throw new UsageError(`${label} requires a non-empty path`);
  }
  const resolved = path.resolve(root, rawPath);
  if (!isInside(root, resolved)) {
    throw new UsageError(`${label} must be inside the repo`);
  }
  return resolved;
}

function sha256Buffer(data: string | Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(data).digest("hex")}`;
}

function sha256File(filePath: string): string {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

function quoteIdentifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function quoteSqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function tableNames(db: DatabaseSyncType): string[] {
  return db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC")
    .all()
    .map((row) => String(row.name));
}

function tableCounts(db: DatabaseSyncType): Array<{ name: string; row_count: number }> {
  return tableNames(db).map((name) => {
    const row = db.prepare(`SELECT COUNT(*) AS count FROM ${quoteIdentifier(name)}`).get();
    return { name, row_count: Number(row?.count ?? 0) };
  });
}

function readMigrations(db: DatabaseSyncType, tableName: string): ProjectDbSnapshotMigration[] {
  const exists = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  if (!exists) {
    return [];
  }
  return db
    .prepare(`SELECT migration_key, ordinal, checksum, applied_at_ms FROM ${quoteIdentifier(tableName)} ORDER BY ordinal ASC`)
    .all()
    .map((row) => ({
      migration_key: String(row.migration_key),
      ordinal: Number(row.ordinal),
      checksum: String(row.checksum),
      applied_at_ms: Number(row.applied_at_ms),
    }));
}

function assertSqliteIntegrity(db: DatabaseSyncType, label: string): void {
  const row = db.prepare("PRAGMA integrity_check").get();
  const value = String(Object.values(row ?? {})[0] ?? "");
  if (value !== "ok") {
    throw new ValidationError(`${label} integrity check failed: ${value}`);
  }
}

function sqliteIntegrityCheck(root: string, filePath: string): ProjectDbSnapshotCheck {
  const DatabaseSync = loadDatabaseCtor();
  try {
    const db = new DatabaseSync(filePath);
    try {
      assertSqliteIntegrity(db, "snapshot");
      return {
        name: "sqlite-integrity",
        ok: true,
        level: "ok",
        path: rel(root, filePath),
        detail: "snapshot SQLite integrity check ok",
        errors: [],
        warnings: [],
      };
    } finally {
      db.close();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      name: "sqlite-integrity",
      ok: false,
      level: "fail",
      path: rel(root, filePath),
      detail: "failed to verify snapshot SQLite integrity",
      errors: [`snapshot SQLite integrity failed: ${message}`],
      warnings: [],
    };
  }
}

function collectSnapshotMetadata(filePath: string, migrationTable: string): {
  table_counts: Array<{ name: string; row_count: number }>;
  migrations: ProjectDbSnapshotMigration[];
} {
  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(filePath);
  try {
    assertSqliteIntegrity(db, "snapshot");
    return {
      table_counts: tableCounts(db),
      migrations: readMigrations(db, migrationTable),
    };
  } finally {
    db.close();
  }
}

function readManifest(filePath: string): ProjectDbSnapshotManifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ValidationError(`failed to read snapshot manifest: ${message}`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new ValidationError("snapshot manifest must be a JSON object");
  }
  const manifest = parsed as Partial<ProjectDbSnapshotManifest>;
  if (
    manifest.manifest_version !== 1 ||
    manifest.tool !== "mdkg" ||
    manifest.kind !== "project_db_snapshot" ||
    typeof manifest.snapshot_sha256 !== "string" ||
    typeof manifest.byte_size !== "number" ||
    !Array.isArray(manifest.table_counts) ||
    !Array.isArray(manifest.migrations)
  ) {
    throw new ValidationError("snapshot manifest has unsupported shape");
  }
  return manifest as ProjectDbSnapshotManifest;
}

function buildManifest(
  root: string,
  config: Config,
  snapshotFile: string,
  runtimeHash: string | null,
  queuePolicy: ProjectDbSnapshotQueuePolicy,
  queueSummary: ProjectQueueSnapshotSummary
): ProjectDbSnapshotManifest {
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const metadata = collectSnapshotMetadata(snapshotFile, config.db.migration_table);
  return {
    manifest_version: 1,
    tool: "mdkg",
    kind: "project_db_snapshot",
    mdkg_version: readPackageVersion(),
    generated_at: new Date().toISOString(),
    schema_version: config.db.schema_version,
    migration_table: config.db.migration_table,
    runtime_path: rel(root, layout.runtimeFile),
    snapshot_path: rel(root, layout.stateFile),
    source_runtime_sha256: runtimeHash,
    snapshot_sha256: sha256File(snapshotFile),
    byte_size: fs.statSync(snapshotFile).size,
    table_counts: metadata.table_counts,
    migrations: metadata.migrations,
    queue_policy: queuePolicy,
    queue_summary: queueSummary,
  };
}

function assertQueueSnapshotPolicy(policy: ProjectDbSnapshotQueuePolicy, summary: ProjectQueueSnapshotSummary): void {
  if (policy === "drain") {
    if (summary.ready > 0 || summary.leased > 0) {
      throw new ValidationError(
        `db snapshot seal requires drained queues; found ready=${summary.ready}, leased=${summary.leased}`
      );
    }
    return;
  }
  if (policy === "paused") {
    if (summary.leased > 0) {
      throw new ValidationError(`db snapshot seal --queue-policy paused requires no leased messages; found leased=${summary.leased}`);
    }
    if (summary.active_ready > 0) {
      throw new ValidationError(
        `db snapshot seal --queue-policy paused requires ready messages to be in paused queues; found active_ready=${summary.active_ready}`
      );
    }
    return;
  }
  throw new ValidationError(`unsupported queue snapshot policy: ${policy}`);
}

function warningListFromVerify(root: string, config: Config): string[] {
  return verifyProjectDb(root, config).warnings;
}

export function sealProjectDbSnapshot(
  root: string,
  config: Config,
  queuePolicy: ProjectDbSnapshotQueuePolicy = "drain"
): ProjectDbSnapshotSealReceipt {
  const verification = verifyProjectDb(root, config);
  if (!verification.ok) {
    throw new ValidationError(`db snapshot seal requires a valid project DB; run mdkg db verify`);
  }

  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const queueSummary = readProjectQueueSnapshotSummary(layout.runtimeFile);
  assertQueueSnapshotPolicy(queuePolicy, queueSummary);
  const oldHash = fs.existsSync(layout.stateFile) ? sha256File(layout.stateFile) : null;
  fs.mkdirSync(layout.stateDir, { recursive: true });
  const tempSnapshot = path.join(layout.stateDir, `.project.sqlite.${process.pid}-${Date.now()}.tmp`);
  const tempManifest = path.join(layout.stateDir, `.project.manifest.${process.pid}-${Date.now()}.tmp`);
  fs.rmSync(tempSnapshot, { force: true });
  fs.rmSync(tempManifest, { force: true });

  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(layout.runtimeFile);
  try {
    db.exec("PRAGMA foreign_keys = ON;");
    assertSqliteIntegrity(db, "runtime project DB");
    try {
      db.exec("PRAGMA wal_checkpoint(TRUNCATE);");
    } catch {
      // WAL checkpoint can be a no-op or unavailable depending on journal mode.
    }
    db.exec(`VACUUM INTO ${quoteSqlString(tempSnapshot)}`);
  } catch (err) {
    fs.rmSync(tempSnapshot, { force: true });
    const message = err instanceof Error ? err.message : String(err);
    throw err instanceof ValidationError ? err : new ValidationError(`db snapshot seal failed: ${message}`);
  } finally {
    db.close();
  }

  try {
    const runtimeHash = sha256File(layout.runtimeFile);
    const manifest = buildManifest(root, config, tempSnapshot, runtimeHash, queuePolicy, queueSummary);
    atomicWriteFile(tempManifest, `${JSON.stringify(manifest, null, 2)}\n`);
    fs.renameSync(tempSnapshot, layout.stateFile);
    fs.renameSync(tempManifest, layout.stateManifest);
    return {
      action: "db-snapshot-seal",
      ok: true,
      snapshot: rel(root, layout.stateFile),
      manifest: rel(root, layout.stateManifest),
      old_snapshot_sha256: oldHash,
      new_snapshot_sha256: manifest.snapshot_sha256,
      source_runtime_sha256: runtimeHash,
      byte_size: manifest.byte_size,
      table_counts: manifest.table_counts,
      migrations: manifest.migrations,
      queue_policy: queuePolicy,
      queue_summary: queueSummary,
      warnings: warningListFromVerify(root, config),
    };
  } catch (err) {
    fs.rmSync(tempSnapshot, { force: true });
    fs.rmSync(tempManifest, { force: true });
    throw err;
  }
}

function compareJson(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function verifyProjectDbSnapshot(root: string, config: Config): ProjectDbSnapshotVerifyReceipt {
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const checks: ProjectDbSnapshotCheck[] = [];
  const snapshotRel = rel(root, layout.stateFile);
  const manifestRel = rel(root, layout.stateManifest);

  checks.push({
    name: "snapshot-file",
    ok: fs.existsSync(layout.stateFile) && !fs.statSync(layout.stateFile).isDirectory(),
    level: fs.existsSync(layout.stateFile) && !fs.statSync(layout.stateFile).isDirectory() ? "ok" : "fail",
    path: snapshotRel,
    detail: fs.existsSync(layout.stateFile) ? "snapshot file exists" : "snapshot file missing",
    errors: fs.existsSync(layout.stateFile) ? [] : [`${snapshotRel} missing; run mdkg db snapshot seal`],
    warnings: [],
  });
  checks.push({
    name: "manifest-file",
    ok: fs.existsSync(layout.stateManifest) && !fs.statSync(layout.stateManifest).isDirectory(),
    level: fs.existsSync(layout.stateManifest) && !fs.statSync(layout.stateManifest).isDirectory() ? "ok" : "fail",
    path: manifestRel,
    detail: fs.existsSync(layout.stateManifest) ? "snapshot manifest exists" : "snapshot manifest missing",
    errors: fs.existsSync(layout.stateManifest) ? [] : [`${manifestRel} missing; run mdkg db snapshot seal`],
    warnings: [],
  });

  let manifest: ProjectDbSnapshotManifest | undefined;
  if (checks.every((check) => check.ok)) {
    try {
      manifest = readManifest(layout.stateManifest);
      checks.push({
        name: "manifest-shape",
        ok: true,
        level: "ok",
        path: manifestRel,
        detail: "snapshot manifest shape is supported",
        errors: [],
        warnings: [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      checks.push({
        name: "manifest-shape",
        ok: false,
        level: "fail",
        path: manifestRel,
        detail: "snapshot manifest shape is invalid",
        errors: [message],
        warnings: [],
      });
    }
  }

  if (manifest) {
    checks.push(sqliteIntegrityCheck(root, layout.stateFile));
    const actualHash = sha256File(layout.stateFile);
    const actualSize = fs.statSync(layout.stateFile).size;
    checks.push({
      name: "snapshot-hash",
      ok: actualHash === manifest.snapshot_sha256,
      level: actualHash === manifest.snapshot_sha256 ? "ok" : "fail",
      path: snapshotRel,
      detail: actualHash === manifest.snapshot_sha256 ? "snapshot hash matches manifest" : "snapshot hash mismatch",
      errors: actualHash === manifest.snapshot_sha256 ? [] : [`snapshot hash mismatch: manifest ${manifest.snapshot_sha256}, actual ${actualHash}`],
      warnings: [],
    });
    checks.push({
      name: "snapshot-size",
      ok: actualSize === manifest.byte_size,
      level: actualSize === manifest.byte_size ? "ok" : "fail",
      path: snapshotRel,
      detail: actualSize === manifest.byte_size ? "snapshot byte size matches manifest" : "snapshot byte size mismatch",
      errors: actualSize === manifest.byte_size ? [] : [`snapshot byte size mismatch: manifest ${manifest.byte_size}, actual ${actualSize}`],
      warnings: [],
    });
    try {
      const metadata = collectSnapshotMetadata(layout.stateFile, config.db.migration_table);
      const tablesMatch = compareJson(metadata.table_counts, manifest.table_counts);
      checks.push({
        name: "table-counts",
        ok: tablesMatch,
        level: tablesMatch ? "ok" : "fail",
        detail: tablesMatch ? "table counts match manifest" : "table counts mismatch",
        errors: tablesMatch ? [] : ["table counts do not match snapshot manifest"],
        warnings: [],
      });
      const migrationsMatch = compareJson(metadata.migrations, manifest.migrations);
      checks.push({
        name: "migrations",
        ok: migrationsMatch,
        level: migrationsMatch ? "ok" : "fail",
        detail: migrationsMatch ? "migration metadata matches manifest" : "migration metadata mismatch",
        errors: migrationsMatch ? [] : ["migration metadata does not match snapshot manifest"],
        warnings: [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      checks.push({
        name: "snapshot-metadata",
        ok: false,
        level: "fail",
        detail: "failed to read snapshot metadata",
        errors: [`failed to read snapshot metadata: ${message}`],
        warnings: [],
      });
    }
    if (manifest.source_runtime_sha256 && fs.existsSync(layout.runtimeFile)) {
      const runtimeHash = sha256File(layout.runtimeFile);
      checks.push({
        name: "runtime-freshness",
        ok: true,
        level: runtimeHash === manifest.source_runtime_sha256 ? "ok" : "warn",
        path: rel(root, layout.runtimeFile),
        detail: runtimeHash === manifest.source_runtime_sha256 ? "snapshot matches current runtime hash" : "runtime changed since snapshot seal",
        errors: [],
        warnings: runtimeHash === manifest.source_runtime_sha256 ? [] : ["runtime database hash differs from sealed snapshot source hash"],
      });
    }
  }

  const errors = checks.flatMap((check) => check.errors.map((error) => `${check.name}: ${error}`));
  const warnings = checks.flatMap((check) => check.warnings.map((warning) => `${check.name}: ${warning}`));
  const hasMissing = checks.some((check) => !check.ok && /missing/.test(check.detail));
  const stale = warnings.some((warning) => /runtime database hash differs/.test(warning));
  return {
    action: "db-snapshot-verify",
    ok: errors.length === 0,
    status: errors.length > 0 ? (hasMissing ? "missing" : "invalid") : stale ? "stale" : "valid",
    snapshot: snapshotRel,
    manifest: manifestRel,
    checks,
    warning_count: warnings.length,
    failure_count: errors.length,
    warnings,
    errors,
  };
}

export function projectDbSnapshotStatus(root: string, config: Config): ProjectDbSnapshotStatusReceipt {
  const payload = verifyProjectDbSnapshot(root, config);
  return {
    ...payload,
    action: "db-snapshot-status",
  };
}

function schemaLines(db: DatabaseSyncType): string[] {
  return db
    .prepare("SELECT type, name, tbl_name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type ASC, name ASC")
    .all()
    .map((row) => `schema ${String(row.type)} ${String(row.name)}: ${String(row.sql).replace(/\s+/g, " ").trim()}`);
}

function columnNames(db: DatabaseSyncType, tableName: string): string[] {
  return db
    .prepare(`PRAGMA table_info(${quoteIdentifier(tableName)})`)
    .all()
    .map((row) => String(row.name));
}

function canonicalValue(value: unknown): unknown {
  if (value instanceof Uint8Array) {
    const buffer = Buffer.from(value);
    return {
      blob_sha256: sha256Buffer(buffer),
      byte_size: buffer.length,
    };
  }
  return value;
}

export function canonicalDumpForSnapshot(root: string, snapshotPath: string): string {
  if (!fs.existsSync(snapshotPath) || fs.statSync(snapshotPath).isDirectory()) {
    throw new ValidationError(`${rel(root, snapshotPath)} missing or not a file`);
  }
  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(snapshotPath);
  try {
    assertSqliteIntegrity(db, "snapshot");
    const lines: string[] = [
      "# mdkg project db canonical dump v1",
      `snapshot: ${rel(root, snapshotPath)}`,
      `snapshot_sha256: ${sha256File(snapshotPath)}`,
      "",
      "# Schema",
      ...schemaLines(db),
      "",
      "# Tables",
    ];
    for (const table of tableNames(db)) {
      const columns = columnNames(db, table);
      lines.push(`table ${table}`);
      lines.push(`columns ${JSON.stringify(columns)}`);
      const selectColumns = columns.map((column) => quoteIdentifier(column)).join(", ");
      const orderBy = columns.map((column) => `${quoteIdentifier(column)} ASC`).join(", ");
      const rows = db
        .prepare(`SELECT ${selectColumns} FROM ${quoteIdentifier(table)} ORDER BY ${orderBy}`)
        .all();
      for (const row of rows) {
        const canonicalRow: Record<string, unknown> = {};
        for (const column of columns) {
          canonicalRow[column] = canonicalValue(row[column]);
        }
        lines.push(`row ${JSON.stringify(canonicalRow)}`);
      }
      lines.push("");
    }
    return `${lines.join("\n").trimEnd()}\n`;
  } finally {
    db.close();
  }
}

export function dumpProjectDbSnapshot(root: string, config: Config, snapshotPath?: string, outputPath?: string): ProjectDbSnapshotDumpReceipt & { dump: string } {
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const resolvedSnapshot = snapshotPath
    ? resolveContainedProjectDbPath(root, snapshotPath, "--snapshot")
    : layout.stateFile;
  const dump = canonicalDumpForSnapshot(root, resolvedSnapshot);
  const dumpHash = sha256Buffer(dump);
  let output: string | null = null;
  if (outputPath) {
    const resolvedOutput = resolveContainedProjectDbPath(root, outputPath, "--output");
    atomicWriteFile(resolvedOutput, dump);
    output = rel(root, resolvedOutput);
  }
  return {
    action: "db-snapshot-dump",
    ok: true,
    snapshot: rel(root, resolvedSnapshot),
    output,
    line_count: dump.trimEnd().length === 0 ? 0 : dump.trimEnd().split("\n").length,
    sha256: dumpHash,
    dump,
  };
}

export function diffProjectDbSnapshots(root: string, leftPath: string, rightPath: string): ProjectDbSnapshotDiffReceipt {
  const left = resolveContainedProjectDbPath(root, leftPath, "left snapshot");
  const right = resolveContainedProjectDbPath(root, rightPath, "right snapshot");
  const leftDump = canonicalDumpForSnapshot(root, left);
  const rightDump = canonicalDumpForSnapshot(root, right);
  const leftLines = leftDump.trimEnd().split("\n");
  const rightLines = rightDump.trimEnd().split("\n");
  const leftSet = new Set(leftLines);
  const rightSet = new Set(rightLines);
  const added = rightLines.filter((line) => !leftSet.has(line));
  const removed = leftLines.filter((line) => !rightSet.has(line));
  return {
    action: "db-snapshot-diff",
    ok: true,
    left: rel(root, left),
    right: rel(root, right),
    left_sha256: sha256Buffer(leftDump),
    right_sha256: sha256Buffer(rightDump),
    added_count: added.length,
    removed_count: removed.length,
    changed_count: added.length + removed.length,
    added,
    removed,
  };
}
