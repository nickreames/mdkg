import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Config } from "./config";
import {
  atomicReplaceContainedFile,
  ensureContainedDirectory,
  forEachContainedFileChunk,
  readContainedFile,
  withContainedPathSink,
} from "./filesystem_authority";
import { resolveConfiguredProjectDbLayout } from "./project_db";
import { readPackageVersion } from "./version";
import { atomicWriteFile } from "../util/atomic";
import { UsageError, ValidationError } from "../util/errors";
import { assertCompatibleWriter } from "../util/writer_admission";
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

type DatabaseCtor = new (filename: string, options?: { readOnly?: boolean }) => DatabaseSyncType;

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
  queue_policy: ProjectDbSnapshotQueuePolicy;
  queue_summary: ProjectQueueSnapshotSummary;
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

function inputPath(root: string, filePath: string) {
  return { root, relativePath: path.relative(root, filePath), pathSyntax: "native" as const };
}

function admitInput(root: string, filePath: string, allowMissing = false): boolean {
  return withContainedPathSink({ ...inputPath(root, filePath), operation: "read" }, ({ absolutePath }) => {
    let stat: fs.Stats;
    try { stat = fs.lstatSync(absolutePath); }
    catch (error) { if (allowMissing && (error as NodeJS.ErrnoException).code === "ENOENT") return false; throw error; }
    if (!stat.isFile()) throw new ValidationError(`${rel(root, filePath)} must be a regular file`);
    return true;
  });
}

function admitDatabase(root: string, filePath: string, allowMissing = false): boolean {
  const present = admitInput(root, filePath, allowMissing);
  // SQLite consumes sidecars implicitly; visible links/special files must not
  // bypass the selected database's repository-only read authority.
  for (const suffix of ["-wal", "-shm", "-journal"]) admitInput(root, filePath + suffix, true);
  return present;
}

function hashFile(root: string, filePath: string): { hash: string; size: number } {
  const hash = crypto.createHash("sha256");
  // Database size is not a Markdown limit. Stream in fixed-size chunks without
  // retaining prior bytes; the generic reader bounds actual bytes and checks its
  // opened descriptor. Native SQLite pathname races remain the separate Bug47.
  const size = forEachContainedFileChunk({ ...inputPath(root, filePath), maxBytes: Number.MAX_SAFE_INTEGER }, chunk => hash.update(chunk));
  return { hash: `sha256:${hash.digest("hex")}`, size };
}

function openSnapshotDatabase(root: string, filePath: string, readOnly = true): DatabaseSyncType {
  admitDatabase(root, filePath);
  return new (loadDatabaseCtor())(filePath, { readOnly });
}

function queueSummary(root: string, filePath: string): ProjectQueueSnapshotSummary {
  admitDatabase(root, filePath);
  return readProjectQueueSnapshotSummary(filePath, { readOnly: true });
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
  try {
    const db = openSnapshotDatabase(root, filePath);
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

function collectSnapshotMetadata(root: string, filePath: string, migrationTable: string): {
  table_counts: Array<{ name: string; row_count: number }>;
  migrations: ProjectDbSnapshotMigration[];
} {
  const db = openSnapshotDatabase(root, filePath);
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

function readManifest(root: string, filePath: string, maxBytes: number): ProjectDbSnapshotManifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readContainedFile({ ...inputPath(root, filePath), maxBytes }));
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
    !Array.isArray(manifest.migrations) ||
    (manifest.queue_policy !== "drain" && manifest.queue_policy !== "paused") ||
    typeof manifest.queue_summary !== "object" ||
    manifest.queue_summary === null ||
    Array.isArray(manifest.queue_summary)
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
  const metadata = collectSnapshotMetadata(root, snapshotFile, config.db.migration_table);
  const content = hashFile(root, snapshotFile);
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
    snapshot_sha256: content.hash,
    byte_size: content.size,
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

export function sealProjectDbSnapshot(
  root: string,
  config: Config,
  queuePolicy: ProjectDbSnapshotQueuePolicy = "drain"
): ProjectDbSnapshotSealReceipt {
  assertCompatibleWriter(root);
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  // Admit every existing input/output before project verification can open the
  // runtime, or seal can checkpoint it or replace authored snapshot state.
  const runtimePresent = admitDatabase(root, layout.runtimeFile, true);
  const oldPresent = admitDatabase(root, layout.stateFile, true);
  admitInput(root, layout.stateManifest, true);
  if (!runtimePresent) throw new ValidationError("db snapshot seal requires a valid project DB; run mdkg db verify");
  const verification = verifyProjectDb(root, config, { readOnly: true });
  if (!verification.ok) {
    throw new ValidationError(`db snapshot seal requires a valid project DB; run mdkg db verify`);
  }

  const runtimeQueues = queueSummary(root, layout.runtimeFile);
  assertQueueSnapshotPolicy(queuePolicy, runtimeQueues);
  const oldHash = oldPresent ? hashFile(root, layout.stateFile).hash : null;
  ensureContainedDirectory(inputPath(root, layout.stateDir));
  const suffix = `${process.pid}-${crypto.randomUUID()}`;
  const tempSnapshot = path.join(layout.stateDir, `.project.sqlite.${suffix}.tmp`);
  const tempManifest = path.join(layout.stateDir, `.project.manifest.${suffix}.tmp`);

  const db = openSnapshotDatabase(root, layout.runtimeFile, false);
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
    const runtimeHash = hashFile(root, layout.runtimeFile).hash;
    const sealedQueueSummary = queueSummary(root, tempSnapshot);
    assertQueueSnapshotPolicy(queuePolicy, sealedQueueSummary);
    const manifest = buildManifest(root, config, tempSnapshot, runtimeHash, queuePolicy, sealedQueueSummary);
    const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
    if (Buffer.byteLength(manifestText) > config.index.limits.max_file_bytes) throw new ValidationError(`snapshot manifest exceeds byte limit: ${config.index.limits.max_file_bytes}`);
    atomicWriteFile(tempManifest, manifestText);
    admitDatabase(root, layout.stateFile, true);
    admitInput(root, layout.stateManifest, true);
    withContainedPathSink({ ...inputPath(root, layout.stateFile), operation: "replace" }, ({ absolutePath }) => fs.renameSync(tempSnapshot, absolutePath));
    withContainedPathSink({ ...inputPath(root, layout.stateManifest), operation: "replace" }, ({ absolutePath }) => fs.renameSync(tempManifest, absolutePath));
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
      queue_summary: sealedQueueSummary,
      warnings: verification.warnings,
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

function snapshotInputCheck(root: string, filePath: string, name: string, label: string): ProjectDbSnapshotCheck {
  const relativePath = rel(root, filePath);
  try {
    const regular = name === "snapshot-file" ? admitDatabase(root, filePath) : admitInput(root, filePath);
    return {
      name, ok: regular, level: regular ? "ok" : "fail", path: relativePath,
      detail: regular ? `${label} exists` : `${label} is not a regular file`,
      errors: regular ? [] : [`${relativePath} must be a regular file`], warnings: [],
    };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    const missing = code === "ENOENT" || code === "ENOTDIR";
    const message = err instanceof Error ? err.message : String(err);
    return {
      name, ok: false, level: "fail", path: relativePath,
      detail: missing ? `${label} missing` : `failed to inspect ${label}`,
      errors: [missing ? `${relativePath} missing; run mdkg db snapshot seal` : `${relativePath}: ${message}`],
      warnings: [],
    };
  }
}

export function verifyProjectDbSnapshot(root: string, config: Config): ProjectDbSnapshotVerifyReceipt {
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const checks: ProjectDbSnapshotCheck[] = [];
  const snapshotRel = rel(root, layout.stateFile);
  const manifestRel = rel(root, layout.stateManifest);

  checks.push(snapshotInputCheck(root, layout.stateFile, "snapshot-file", "snapshot file"));
  checks.push(snapshotInputCheck(root, layout.stateManifest, "manifest-file", "snapshot manifest"));
  try { admitDatabase(root, layout.runtimeFile, true); }
  catch (error) { checks.push({ name: "runtime-file", ok: false, level: "fail", detail: "runtime input is not safely contained", errors: [error instanceof Error ? error.message : String(error)], warnings: [] }); }

  let manifest: ProjectDbSnapshotManifest | undefined;
  if (checks.every((check) => check.ok)) {
    try {
      manifest = readManifest(root, layout.stateManifest, config.index.limits.max_file_bytes);
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
    const content = hashFile(root, layout.stateFile);
    const actualHash = content.hash;
    const actualSize = content.size;
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
      const metadata = collectSnapshotMetadata(root, layout.stateFile, config.db.migration_table);
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
    let runtimePresent = false;
    try { runtimePresent = admitDatabase(root, layout.runtimeFile, true); }
    catch (error) { checks.push({ name: "runtime-file", ok: false, level: "fail", detail: "runtime input is not safely contained", errors: [error instanceof Error ? error.message : String(error)], warnings: [] }); }
    if (runtimePresent && !manifest.source_runtime_sha256) {
      checks.push({
        name: "runtime-freshness",
        ok: false,
        level: "fail",
        path: rel(root, layout.runtimeFile),
        detail: "snapshot source runtime hash is missing",
        errors: ["snapshot manifest must include source_runtime_sha256 when the runtime database exists"],
        warnings: [],
      });
    } else if (manifest.source_runtime_sha256 && runtimePresent) {
      const runtimeHash = hashFile(root, layout.runtimeFile).hash;
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
    try {
      const sealedQueueSummary = queueSummary(root, layout.stateFile);
      assertQueueSnapshotPolicy(manifest.queue_policy, sealedQueueSummary);
      const matchesManifest = compareJson(sealedQueueSummary, manifest.queue_summary);
      checks.push({
        name: "queue-policy",
        ok: matchesManifest,
        level: matchesManifest ? "ok" : "fail",
        detail: matchesManifest ? "sealed queue state satisfies policy and matches manifest" : "sealed queue summary differs from manifest",
        errors: matchesManifest ? [] : ["sealed queue summary does not match snapshot manifest"],
        warnings: [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      checks.push({
        name: "queue-policy",
        ok: false,
        level: "fail",
        detail: "sealed queue state violates snapshot policy",
        errors: [message],
        warnings: [],
      });
    }
  }

  const mandatory = ["snapshot-file", "manifest-file", "manifest-shape", "sqlite-integrity",
    "snapshot-hash", "snapshot-size", "table-counts", "migrations", "queue-policy"];
  const incomplete = mandatory.filter(name => !checks.some(check => check.name === name && check.ok));
  // Failed prerequisite checks already explain skipped dependent checks. But
  // an accidentally omitted check must never yield a successful receipt.
  if (checks.every(check => check.ok) && incomplete.length > 0) {
    checks.push({ name: "verification-complete", ok: false, level: "fail",
      detail: "mandatory snapshot checks did not complete",
      errors: incomplete.map(name => `required check not completed: ${name}`), warnings: [] });
  }
  for (const check of checks) {
    if (!check.ok && check.errors.length === 0) check.errors.push(check.detail || "check failed");
  }
  const errors = checks.flatMap((check) => check.errors.map((error) => `${check.name}: ${error}`));
  const warnings = checks.flatMap((check) => check.warnings.map((warning) => `${check.name}: ${warning}`));
  const hasMissing = checks.some((check) => !check.ok && /missing/.test(check.detail));
  const stale = warnings.some((warning) => /runtime database hash differs/.test(warning));
  const ok = incomplete.length === 0 && checks.every(check => check.ok) && errors.length === 0;
  return {
    action: "db-snapshot-verify",
    ok,
    status: !ok ? (hasMissing ? "missing" : "invalid") : stale ? "stale" : "valid",
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

function canonicalDumpForSnapshot(root: string, snapshotPath: string): string {
  const db = openSnapshotDatabase(root, snapshotPath);
  try {
    assertSqliteIntegrity(db, "snapshot");
    const lines: string[] = [
      "# mdkg project db canonical dump v1",
      `snapshot: ${rel(root, snapshotPath)}`,
      `snapshot_sha256: ${hashFile(root, snapshotPath).hash}`,
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

function canonicalDumpForContainedSnapshot(
  root: string,
  rawPath: string,
  label: string
): { absolutePath: string; dump: string } {
  const resolved = resolveContainedProjectDbPath(root, rawPath, label);
  const relativePath = rel(root, resolved);
  return withContainedPathSink(
    { root, relativePath, operation: "read" },
    ({ absolutePath }) => ({
      absolutePath,
      dump: canonicalDumpForSnapshot(root, absolutePath),
    })
  );
}

export function dumpProjectDbSnapshot(root: string, config: Config, snapshotPath?: string, outputPath?: string): ProjectDbSnapshotDumpReceipt & { dump: string } {
  if (outputPath) assertCompatibleWriter(root);
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  const snapshot = canonicalDumpForContainedSnapshot(
    root,
    snapshotPath ?? layout.stateFile,
    "--snapshot"
  );
  const resolvedSnapshot = snapshot.absolutePath;
  const dump = snapshot.dump;
  const dumpHash = sha256Buffer(dump);
  let output: string | null = null;
  if (outputPath) {
    const resolvedOutput = resolveContainedProjectDbPath(root, outputPath, "--output");
    atomicReplaceContainedFile({ root, relativePath: rel(root, resolvedOutput) }, dump);
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
  const leftSnapshot = canonicalDumpForContainedSnapshot(root, leftPath, "left snapshot");
  const rightSnapshot = canonicalDumpForContainedSnapshot(root, rightPath, "right snapshot");
  const left = leftSnapshot.absolutePath;
  const right = rightSnapshot.absolutePath;
  const leftDump = leftSnapshot.dump;
  const rightDump = rightSnapshot.dump;
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
