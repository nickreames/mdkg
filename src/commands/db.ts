import fs from "fs";
import path from "path";
import { loadConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import { configPath } from "../core/paths";
import {
  resolveConfiguredProjectDbLayout,
} from "../core/project_db";
import { runProjectDbMigrations } from "../core/project_db_migrations";
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
