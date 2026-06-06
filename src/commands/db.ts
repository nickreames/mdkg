import fs from "fs";
import path from "path";
import { loadConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import { configPath } from "../core/paths";
import {
  resolveConfiguredProjectDbLayout,
} from "../core/project_db";
import {
  projectDbStats,
  runProjectDbMigrations,
  verifyProjectDb,
} from "../core/project_db_migrations";
import {
  diffProjectDbSnapshots,
  dumpProjectDbSnapshot,
  ProjectDbSnapshotQueuePolicy,
  projectDbSnapshotStatus,
  sealProjectDbSnapshot,
  verifyProjectDbSnapshot,
} from "../core/project_db_snapshot";
import {
  ackProjectQueueMessage,
  claimProjectQueueMessage,
  createProjectQueue,
  deadLetterProjectQueueMessage,
  enqueueProjectQueueMessage,
  failProjectQueueMessage,
  listProjectQueueMessages,
  listProjectQueues,
  pauseProjectQueue,
  readProjectQueue,
  readProjectQueueMessage,
  readProjectQueueSnapshotSummary,
  readProjectQueueStats,
  releaseExpiredProjectQueueLeases,
  resumeProjectQueue,
} from "../core/project_db_queue";
import { readPackageVersion } from "../core/version";
import { rebuildDerivedIndexCaches } from "./index";
import { resolveCapabilitiesIndexPath } from "../graph/capabilities_indexer";
import { buildCapabilitiesIndex } from "../graph/capabilities_indexer";
import { isCapabilitiesIndexStale } from "../graph/capabilities_index_cache";
import { buildIndex } from "../graph/indexer";
import { isIndexStale } from "../graph/staleness";
import { buildSkillsIndex, resolveSkillsIndexPath } from "../graph/skills_indexer";
import { isSkillsIndexStale } from "../graph/skills_index_cache";
import {
  buildSubgraphsIndex,
  isSubgraphsIndexStale,
  resolveSubgraphsIndexPath,
} from "../graph/subgraphs";
import {
  isSqliteBackend,
  readSqliteIndexMeta,
  resolveSqlitePath,
  sqliteHealth,
  sqliteSourceFingerprint,
} from "../graph/sqlite_index";
import { atomicWriteFile } from "../util/atomic";
import { withMutationLock } from "../util/lock";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";

type DbIndexCheck = {
  name: string;
  ok: boolean;
  level: "ok" | "warn" | "fail";
  path?: string;
  exists?: boolean;
  stale?: boolean;
  size?: number;
  detail: string;
  errors: string[];
  warnings: string[];
};

export type DbIndexCommandOptions = {
  root: string;
  tolerant?: boolean;
  json?: boolean;
};

export type DbInitCommandOptions = {
  root: string;
  json?: boolean;
};

export type DbMigrateCommandOptions = {
  root: string;
  json?: boolean;
};

export type DbVerifyCommandOptions = {
  root: string;
  json?: boolean;
};

export type DbStatsCommandOptions = {
  root: string;
  json?: boolean;
};

export type DbSnapshotCommandOptions = {
  root: string;
  queuePolicy?: ProjectDbSnapshotQueuePolicy;
  json?: boolean;
};

export type DbSnapshotDumpCommandOptions = {
  root: string;
  snapshot?: string;
  output?: string;
  json?: boolean;
};

export type DbSnapshotDiffCommandOptions = {
  root: string;
  left: string;
  right: string;
  json?: boolean;
};

export type DbQueueCommandOptions = {
  root: string;
  json?: boolean;
  queueName?: string;
  messageId?: string;
  leaseOwner?: string;
  leaseMs?: number;
  payloadJson?: string;
  payloadFile?: string;
  dedupeKey?: string;
  availableAtMs?: number;
  maxAttempts?: number;
  retryAfterMs?: number;
  error?: string;
  paused?: boolean;
  reason?: string;
  status?: string;
  limit?: number;
};

function rel(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function fileSize(filePath: string): number | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.statSync(filePath).size;
}

function readRawConfig(root: string): { configPath: string; raw: Record<string, unknown> } {
  const filePath = configPath(root);
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError(`config not found at ${filePath}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    throw new UsageError(`failed to read config: ${err instanceof Error ? err.message : String(err)}`);
  }
  const migrated = migrateConfig(parsed).config;
  validateConfigSchema(migrated);
  if (typeof migrated !== "object" || migrated === null || Array.isArray(migrated)) {
    throw new UsageError("config must be a JSON object");
  }
  return { configPath: filePath, raw: migrated as Record<string, unknown> };
}

function writeRawConfig(filePath: string, raw: Record<string, unknown>): void {
  atomicWriteFile(filePath, `${JSON.stringify(raw, null, 2)}\n`);
}

function ensureDirectory(root: string, dirPath: string, created: string[], unchanged: string[]): void {
  const relative = rel(root, dirPath);
  if (fs.existsSync(dirPath)) {
    if (!fs.statSync(dirPath).isDirectory()) {
      throw new ValidationError(`${relative} exists and is not a directory`);
    }
    unchanged.push(relative);
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
  created.push(relative);
}

function writeJsonIfChanged(
  root: string,
  filePath: string,
  payload: unknown,
  created: string[],
  unchanged: string[],
  updated: string[]
): void {
  const relative = rel(root, filePath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    throw new ValidationError(`${relative} exists and is not a file`);
  }
  const content = `${JSON.stringify(payload, null, 2)}\n`;
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, "utf8");
    if (current === content) {
      unchanged.push(relative);
      return;
    }
    atomicWriteFile(filePath, content);
    updated.push(relative);
    return;
  }
  atomicWriteFile(filePath, content);
  created.push(relative);
}

function readJsonCache(filePath: string): string | undefined {
  try {
    JSON.parse(fs.readFileSync(filePath, "utf8"));
    return undefined;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

function jsonCacheCheck(options: {
  root: string;
  name: string;
  filePath: string;
  stale: boolean;
}): DbIndexCheck {
  const exists = fs.existsSync(options.filePath);
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!exists) {
    errors.push("cache file missing");
  } else {
    const readError = readJsonCache(options.filePath);
    if (readError) {
      errors.push(`cache is unreadable: ${readError}`);
    }
  }
  if (exists && options.stale) {
    warnings.push("cache is stale");
  }
  const ok = errors.length === 0 && warnings.length === 0;
  return {
    name: options.name,
    ok,
    level: errors.length > 0 ? "fail" : warnings.length > 0 ? "warn" : "ok",
    path: rel(options.root, options.filePath),
    exists,
    stale: exists ? options.stale : true,
    size: fileSize(options.filePath),
    detail: !exists
      ? "cache file missing"
      : options.stale
        ? "cache is stale"
        : "cache is present and fresh",
    errors,
    warnings,
  };
}

function buildCurrentSqliteFingerprint(root: string, tolerant: boolean): string {
  const config = loadConfig(root);
  const nodeIndex = buildIndex(root, config, { tolerant });
  const skillsIndex = buildSkillsIndex(root, config);
  const capabilitiesIndex = buildCapabilitiesIndex(root, config, nodeIndex);
  const subgraphsIndex = buildSubgraphsIndex(root, config).index;
  return sqliteSourceFingerprint({
    root,
    nodeIndex,
    skillsIndex,
    capabilitiesIndex,
    subgraphsIndex,
  });
}

function sqliteCacheCheck(root: string, tolerant: boolean): DbIndexCheck {
  const config = loadConfig(root);
  if (!isSqliteBackend(config)) {
    return {
      name: "sqlite",
      ok: true,
      level: "ok",
      path: rel(root, resolveSqlitePath(root, config)),
      exists: false,
      stale: false,
      size: undefined,
      detail: "SQLite backend disabled; JSON cache backend active",
      errors: [],
      warnings: [],
    };
  }

  const health = sqliteHealth(root, config);
  const fatalWarnings = health.warnings.filter((warning) =>
    /missing|stale/i.test(warning)
  );
  const errors = [...health.errors, ...fatalWarnings];
  const warnings = health.warnings.filter((warning) => !fatalWarnings.includes(warning));

  if (health.exists && errors.length === 0) {
    try {
      const meta = readSqliteIndexMeta(root, config);
      const expectedFingerprint = buildCurrentSqliteFingerprint(root, tolerant);
      const actualFingerprint = meta.source_fingerprint;
      if (!actualFingerprint) {
        errors.push("SQLite cache missing source fingerprint; run mdkg index");
      } else if (actualFingerprint !== expectedFingerprint) {
        errors.push("SQLite source fingerprint mismatch; run mdkg index");
      }
    } catch (err) {
      errors.push(`failed to verify SQLite source fingerprint: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const ok = health.exists && errors.length === 0;
  return {
    name: "sqlite",
    ok,
    level: errors.length > 0 ? "fail" : warnings.length > 0 ? "warn" : "ok",
    path: rel(root, health.path),
    exists: health.exists,
    stale: fatalWarnings.some((warning) => /stale/i.test(warning)),
    size: health.size,
    detail:
      errors.length > 0
        ? errors.join("; ")
        : warnings.length > 0
          ? warnings.join("; ")
          : "SQLite cache is present and fresh",
    errors,
    warnings,
  };
}

function collectDbIndexChecks(root: string, tolerant: boolean): DbIndexCheck[] {
  const config = loadConfig(root);
  return [
    jsonCacheCheck({
      root,
      name: "global",
      filePath: path.resolve(root, config.index.global_index_path),
      stale: isIndexStale(root, config),
    }),
    jsonCacheCheck({
      root,
      name: "skills",
      filePath: resolveSkillsIndexPath(root),
      stale: isSkillsIndexStale(root, config),
    }),
    jsonCacheCheck({
      root,
      name: "capabilities",
      filePath: resolveCapabilitiesIndexPath(root, config),
      stale: isCapabilitiesIndexStale(root, config),
    }),
    jsonCacheCheck({
      root,
      name: "subgraphs",
      filePath: resolveSubgraphsIndexPath(root),
      stale: isSubgraphsIndexStale(root, config),
    }),
    sqliteCacheCheck(root, tolerant),
  ];
}

function dbIndexPayload(action: string, root: string, checks: DbIndexCheck[]) {
  const failures = checks.filter((check) => !check.ok);
  return {
    action,
    ok: failures.length === 0,
    backend: loadConfig(root).index.backend,
    root,
    checks,
    failure_count: failures.length,
    warnings: checks.flatMap((check) => check.warnings.map((warning) => `${check.name}: ${warning}`)),
    errors: checks.flatMap((check) => check.errors.map((error) => `${check.name}: ${error}`)),
  };
}

function printChecks(payload: ReturnType<typeof dbIndexPayload>): void {
  for (const check of payload.checks) {
    const location = check.path ? ` (${check.path})` : "";
    console.log(`${check.level}: ${check.name}${location} - ${check.detail}`);
  }
}

export function runDbIndexRebuildCommand(options: DbIndexCommandOptions): void {
  const result = rebuildDerivedIndexCaches({ root: options.root, tolerant: options.tolerant });
  if (options.json) {
    const config = loadConfig(options.root);
    const paths: Record<string, string> = {
      global: rel(options.root, result.paths.nodes),
      skills: rel(options.root, result.paths.skills),
      capabilities: rel(options.root, result.paths.capabilities),
      subgraphs: rel(options.root, result.paths.subgraphs),
    };
    if (result.paths.sqlite) {
      paths.sqlite = rel(options.root, result.paths.sqlite);
    }
    console.log(JSON.stringify({
      action: "db-index-rebuild",
      ok: true,
      backend: config.index.backend,
      paths,
      node_count: Object.keys(result.nodeIndex.nodes).length,
    }, null, 2));
    return;
  }
  console.log("db index rebuilt");
  console.log(`index written: ${rel(options.root, result.paths.nodes)}`);
  console.log(`skills index written: ${rel(options.root, result.paths.skills)}`);
  console.log(`capabilities index written: ${rel(options.root, result.paths.capabilities)}`);
  console.log(`subgraphs index written: ${rel(options.root, result.paths.subgraphs)}`);
  if (result.paths.sqlite) {
    console.log(`sqlite index written: ${rel(options.root, result.paths.sqlite)}`);
  }
}

function runDbInitCommandLocked(options: DbInitCommandOptions): void {
  const config = loadConfig(options.root);
  const layout = resolveConfiguredProjectDbLayout(options.root, config.db);
  const created: string[] = [];
  const unchanged: string[] = [];
  const updated: string[] = [];

  for (const dirPath of [
    layout.db,
    layout.schema,
    layout.migrations,
    layout.runtimeDir,
    layout.stateDir,
    layout.receipts,
  ]) {
    ensureDirectory(options.root, dirPath, created, unchanged);
  }

  const manifest = {
    tool: "mdkg",
    kind: "project_db",
    mdkg_version: readPackageVersion(),
    schema_version: config.db.schema_version,
    enabled: true,
    layout: {
      root_path: config.db.root_path,
      schema_path: config.db.schema_path,
      migrations_path: config.db.migrations_path,
      runtime_path: config.db.runtime_path,
      state_path: config.db.state_path,
      receipts_path: config.db.receipts_path,
    },
    migration_table: config.db.migration_table,
    runtime_database_created: false,
  };
  writeJsonIfChanged(options.root, layout.manifest, manifest, created, unchanged, updated);

  const rawConfig = readRawConfig(options.root);
  const nextConfig = { ...rawConfig.raw };
  const nextDb = { ...config.db, enabled: true };
  const currentDb = JSON.stringify(nextConfig.db ?? null);
  const normalizedDb = JSON.stringify(nextDb);
  const enabledBefore = config.db.enabled;
  let config_updated = false;
  if (currentDb !== normalizedDb) {
    nextConfig.db = nextDb;
    validateConfigSchema(nextConfig);
    writeRawConfig(rawConfig.configPath, nextConfig);
    updated.push(".mdkg/config.json");
    config_updated = true;
  } else {
    unchanged.push(".mdkg/config.json");
  }

  const receipt = {
    action: "db-init",
    ok: true,
    enabled_before: enabledBefore,
    enabled_after: true,
    config_updated,
    runtime_database_created: false,
    paths: {
      root: rel(options.root, layout.db),
      schema: rel(options.root, layout.schema),
      migrations: rel(options.root, layout.migrations),
      runtime_dir: rel(options.root, layout.runtimeDir),
      runtime_path: config.db.runtime_path,
      state_dir: rel(options.root, layout.stateDir),
      state_path: config.db.state_path,
      receipts: rel(options.root, layout.receipts),
      manifest: rel(options.root, layout.manifest),
    },
    created: created.sort(),
    updated: updated.sort(),
    unchanged: unchanged.sort(),
  };

  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  console.log("project db initialized");
  for (const item of receipt.created) {
    console.log(`created: ${item}`);
  }
  for (const item of receipt.updated) {
    console.log(`updated: ${item}`);
  }
  if (receipt.created.length === 0 && receipt.updated.length === 0) {
    console.log("project db already initialized");
  }
  console.log("runtime database created: false");
}

export function runDbInitCommand(options: DbInitCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    runDbInitCommandLocked(options)
  );
}

function runDbMigrateCommandLocked(options: DbMigrateCommandOptions): void {
  const config = loadConfig(options.root);
  const receipt = runProjectDbMigrations(options.root, config);
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  console.log("project db migrated");
  console.log(`database: ${receipt.database}`);
  console.log(`migration table: ${receipt.migration_table}`);
  console.log(`applied: ${receipt.applied_count}`);
  console.log(`already applied: ${receipt.skipped_count}`);
  for (const migration of receipt.migrations) {
    console.log(`${migration.status}: ${migration.ordinal} ${migration.key}`);
  }
}

export function runDbMigrateCommand(options: DbMigrateCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    runDbMigrateCommandLocked(options)
  );
}

function printProjectDbChecks(payload: ReturnType<typeof verifyProjectDb>): void {
  for (const check of payload.checks) {
    const location = check.path ? ` (${check.path})` : "";
    console.log(`${check.level}: ${check.name}${location} - ${check.detail}`);
  }
}

export function runDbVerifyCommand(options: DbVerifyCommandOptions): void {
  const config = loadConfig(options.root);
  const payload = verifyProjectDb(options.root, config);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    printProjectDbChecks(payload);
  }
  if (!payload.ok) {
    throw new ValidationError(`db verify failed with ${payload.failure_count} issue(s)`);
  }
  if (!options.json) {
    console.log("db verify ok");
  }
}

export function runDbStatsCommand(options: DbStatsCommandOptions): void {
  const config = loadConfig(options.root);
  const payload = projectDbStats(options.root, config);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log("project db stats");
  console.log(`database: ${payload.database}`);
  console.log(`db size: ${payload.db_size}`);
  console.log(`migrations: ${payload.migration_count}`);
  console.log(`latest migration: ${payload.latest_migration?.key ?? "(none)"}`);
  console.log(`receipt files: ${payload.receipt_files.count}`);
  console.log("tables:");
  for (const table of payload.tables) {
    console.log(`  ${table.name}: ${table.row_count}`);
  }
  if (payload.transient_files.length > 0) {
    console.log("transient files:");
    for (const item of payload.transient_files) {
      console.log(`  ${item.path}: ${item.size}`);
    }
  }
}

function requireQueueName(options: DbQueueCommandOptions): string {
  if (!options.queueName) {
    throw new UsageError("queue name is required");
  }
  return options.queueName;
}

function requireMessageId(options: DbQueueCommandOptions): string {
  if (!options.messageId) {
    throw new UsageError("message id is required");
  }
  return options.messageId;
}

function requireLeaseOwner(options: DbQueueCommandOptions): string {
  if (!options.leaseOwner) {
    throw new UsageError("--lease-owner is required");
  }
  return options.leaseOwner;
}

function requireLeaseMs(options: DbQueueCommandOptions): number {
  if (options.leaseMs === undefined) {
    throw new UsageError("--lease-ms is required");
  }
  return options.leaseMs;
}

function loadQueueDatabasePath(root: string): string {
  const config = loadConfig(root);
  const verification = verifyProjectDb(root, config);
  if (!verification.ok) {
    throw new ValidationError(`db queue requires a valid project DB; run mdkg db verify`);
  }
  return resolveConfiguredProjectDbLayout(root, config.db).runtimeFile;
}

function parseQueuePayload(options: DbQueueCommandOptions): unknown {
  const hasPayloadJson = options.payloadJson !== undefined;
  const hasPayloadFile = options.payloadFile !== undefined;
  if (hasPayloadJson === hasPayloadFile) {
    throw new UsageError("mdkg db queue enqueue requires exactly one of --payload-json or --payload-file");
  }
  const raw = hasPayloadJson
    ? options.payloadJson
    : fs.readFileSync(path.resolve(options.root, String(options.payloadFile)), "utf8");
  try {
    return JSON.parse(String(raw));
  } catch (err) {
    throw new UsageError(`queue payload must be valid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function writeQueueJsonOrText(action: string, payload: Record<string, unknown>, json?: boolean): void {
  if (json) {
    console.log(JSON.stringify({ action, ok: true, ...payload }, null, 2));
    return;
  }
  console.log(action);
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
      console.log(`${key}: ${value}`);
    } else {
      console.log(`${key}: ${JSON.stringify(value)}`);
    }
  }
}

function runQueueMutation(options: DbQueueCommandOptions, fn: (databasePath: string) => Record<string, unknown>, action: string): void {
  const config = loadConfig(options.root);
  withMutationLock(options.root, config.index.lock_timeout_ms, () => {
    const databasePath = loadQueueDatabasePath(options.root);
    writeQueueJsonOrText(action, fn(databasePath), options.json);
  });
}

export function runDbQueueCreateCommand(options: DbQueueCommandOptions): void {
  runQueueMutation(
    options,
    (databasePath) => createProjectQueue(databasePath, {
      queue_name: requireQueueName(options),
      paused: options.paused,
      reason: options.reason,
    }),
    "db-queue-create"
  );
}

export function runDbQueuePauseCommand(options: DbQueueCommandOptions): void {
  runQueueMutation(
    options,
    (databasePath) => ({ queue: pauseProjectQueue(databasePath, { queue_name: requireQueueName(options), reason: options.reason }) }),
    "db-queue-pause"
  );
}

export function runDbQueueResumeCommand(options: DbQueueCommandOptions): void {
  runQueueMutation(
    options,
    (databasePath) => ({ queue: resumeProjectQueue(databasePath, { queue_name: requireQueueName(options) }) }),
    "db-queue-resume"
  );
}

export function runDbQueueEnqueueCommand(options: DbQueueCommandOptions): void {
  runQueueMutation(
    options,
    (databasePath) => enqueueProjectQueueMessage(databasePath, {
      queue_name: requireQueueName(options),
      message_id: requireMessageId(options),
      dedupe_key: options.dedupeKey,
      payload: parseQueuePayload(options),
      available_at_ms: options.availableAtMs,
      max_attempts: options.maxAttempts,
    }),
    "db-queue-enqueue"
  );
}

export function runDbQueueClaimCommand(options: DbQueueCommandOptions): void {
  runQueueMutation(
    options,
    (databasePath) => ({
      message: claimProjectQueueMessage(databasePath, {
        queue_name: requireQueueName(options),
        lease_owner: requireLeaseOwner(options),
        lease_ms: requireLeaseMs(options),
      }),
    }),
    "db-queue-claim"
  );
}

export function runDbQueueAckCommand(options: DbQueueCommandOptions): void {
  runQueueMutation(
    options,
    (databasePath) => ({
      message: ackProjectQueueMessage(databasePath, {
        queue_name: requireQueueName(options),
        message_id: requireMessageId(options),
        lease_owner: requireLeaseOwner(options),
      }),
    }),
    "db-queue-ack"
  );
}

export function runDbQueueFailCommand(options: DbQueueCommandOptions): void {
  if (!options.error) {
    throw new UsageError("--error is required");
  }
  runQueueMutation(
    options,
    (databasePath) => ({
      message: failProjectQueueMessage(databasePath, {
        queue_name: requireQueueName(options),
        message_id: requireMessageId(options),
        lease_owner: requireLeaseOwner(options),
        error: String(options.error),
        retry_after_ms: options.retryAfterMs,
      }),
    }),
    "db-queue-fail"
  );
}

export function runDbQueueDeadLetterCommand(options: DbQueueCommandOptions): void {
  if (!options.error) {
    throw new UsageError("--error is required");
  }
  runQueueMutation(
    options,
    (databasePath) => ({
      message: deadLetterProjectQueueMessage(databasePath, {
        queue_name: requireQueueName(options),
        message_id: requireMessageId(options),
        lease_owner: requireLeaseOwner(options),
        error: String(options.error),
      }),
    }),
    "db-queue-dead-letter"
  );
}

export function runDbQueueReleaseExpiredCommand(options: DbQueueCommandOptions): void {
  runQueueMutation(
    options,
    (databasePath) => releaseExpiredProjectQueueLeases(databasePath, { queue_name: options.queueName }),
    "db-queue-release-expired"
  );
}

export function runDbQueueStatsCommand(options: DbQueueCommandOptions): void {
  const databasePath = loadQueueDatabasePath(options.root);
  const stats = readProjectQueueStats(databasePath, { queue_name: options.queueName });
  const queue = options.queueName ? readProjectQueue(databasePath, options.queueName) : null;
  writeQueueJsonOrText("db-queue-stats", {
    queue,
    stats,
    queues: options.queueName ? undefined : listProjectQueues(databasePath),
    snapshot_summary: readProjectQueueSnapshotSummary(databasePath),
  }, options.json);
}

export function runDbQueueListCommand(options: DbQueueCommandOptions): void {
  const databasePath = loadQueueDatabasePath(options.root);
  const messages = listProjectQueueMessages(databasePath, {
    queue_name: requireQueueName(options),
    status: (options.status ?? "all") as any,
    limit: options.limit,
  });
  writeQueueJsonOrText("db-queue-list", { queue_name: requireQueueName(options), count: messages.length, messages }, options.json);
}

export function runDbQueueShowCommand(options: DbQueueCommandOptions): void {
  const databasePath = loadQueueDatabasePath(options.root);
  const queueName = requireQueueName(options);
  const messageId = requireMessageId(options);
  const message = readProjectQueueMessage(databasePath, queueName, messageId);
  if (!message) {
    throw new NotFoundError(`queue message not found: ${queueName}/${messageId}`);
  }
  writeQueueJsonOrText("db-queue-show", { message }, options.json);
}

function printSnapshotChecks(payload: { checks: ReturnType<typeof verifyProjectDbSnapshot>["checks"] }): void {
  for (const check of payload.checks) {
    const location = check.path ? ` (${path.isAbsolute(check.path) ? rel(process.cwd(), check.path) : check.path})` : "";
    console.log(`${check.level}: ${check.name}${location} - ${check.detail}`);
  }
}

function runDbSnapshotSealCommandLocked(options: DbSnapshotCommandOptions): void {
  const config = loadConfig(options.root);
  const payload = sealProjectDbSnapshot(options.root, config, options.queuePolicy ?? "drain");
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log("db snapshot sealed");
  console.log(`snapshot: ${payload.snapshot}`);
  console.log(`manifest: ${payload.manifest}`);
  console.log(`sha256: ${payload.new_snapshot_sha256}`);
  console.log(`byte size: ${payload.byte_size}`);
  if (payload.warnings.length > 0) {
    console.log("warnings:");
    for (const warning of payload.warnings) {
      console.log(`  ${warning}`);
    }
  }
}

export function runDbSnapshotSealCommand(options: DbSnapshotCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    runDbSnapshotSealCommandLocked(options)
  );
}

export function runDbSnapshotVerifyCommand(options: DbSnapshotCommandOptions): void {
  const config = loadConfig(options.root);
  const payload = verifyProjectDbSnapshot(options.root, config);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    printSnapshotChecks(payload);
  }
  if (!payload.ok) {
    throw new ValidationError(`db snapshot verify failed with ${payload.failure_count} issue(s)`);
  }
  if (!options.json) {
    console.log("db snapshot verify ok");
  }
}

export function runDbSnapshotStatusCommand(options: DbSnapshotCommandOptions): void {
  const config = loadConfig(options.root);
  const payload = projectDbSnapshotStatus(options.root, config);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  printSnapshotChecks(payload);
  console.log(`db snapshot status: ${payload.status}`);
}

export function runDbSnapshotDumpCommand(options: DbSnapshotDumpCommandOptions): void {
  const config = loadConfig(options.root);
  const payload = dumpProjectDbSnapshot(options.root, config, options.snapshot, options.output);
  const { dump, ...receipt } = payload;
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  if (options.output) {
    console.log("db snapshot dump written");
    console.log(`output: ${receipt.output}`);
    console.log(`sha256: ${receipt.sha256}`);
    return;
  }
  process.stdout.write(dump);
}

export function runDbSnapshotDiffCommand(options: DbSnapshotDiffCommandOptions): void {
  const payload = diffProjectDbSnapshots(options.root, options.left, options.right);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log(`db snapshot diff: ${payload.changed_count} change(s)`);
  for (const line of payload.removed) {
    console.log(`- ${line}`);
  }
  for (const line of payload.added) {
    console.log(`+ ${line}`);
  }
}

export function runDbIndexStatusCommand(options: DbIndexCommandOptions): void {
  const payload = dbIndexPayload(
    "db-index-status",
    options.root,
    collectDbIndexChecks(options.root, options.tolerant ?? false)
  );
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  printChecks(payload);
  console.log(payload.ok ? "db index status ok" : "db index status has issues");
}

export function runDbIndexVerifyCommand(options: DbIndexCommandOptions): void {
  const payload = dbIndexPayload(
    "db-index-verify",
    options.root,
    collectDbIndexChecks(options.root, options.tolerant ?? false)
  );
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    printChecks(payload);
  }
  if (!payload.ok) {
    throw new ValidationError(`db index verify failed with ${payload.failure_count} issue(s)`);
  }
  if (!options.json) {
    console.log("db index verify ok");
  }
}
