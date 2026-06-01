import fs from "fs";
import path from "path";
import { loadConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import { normalizeContainedWorkspacePath } from "../core/workspace_path";
import { buildSubgraphsIndex, SubgraphHealth } from "../graph/subgraphs";
import { writeDerivedIndexes } from "../graph/reindex";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { atomicWriteFile } from "../util/atomic";
import { withMutationLock } from "../util/lock";

export type SubgraphAddOptions = {
  root: string;
  alias: string;
  bundlePath: string;
  visibility?: string;
  profile?: string;
  sourcePath?: string;
  sourceRepo?: string;
  maxStaleSeconds?: number;
  json?: boolean;
};

export type SubgraphAliasOptions = {
  root: string;
  alias: string;
  json?: boolean;
};

export type SubgraphListOptions = {
  root: string;
  json?: boolean;
};

export type SubgraphVerifyOptions = {
  root: string;
  alias?: string;
  all?: boolean;
  json?: boolean;
};

export type SubgraphRefreshOptions = {
  root: string;
  alias?: string;
  all?: boolean;
  json?: boolean;
};

const ALIAS_RE = /^[a-z][a-z0-9_]*$/;

function writeJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function normalizeAlias(alias: string): string {
  if (alias === "all") {
    throw new UsageError("subgraph alias cannot be 'all'");
  }
  if (alias !== alias.toLowerCase() || !ALIAS_RE.test(alias)) {
    throw new UsageError("subgraph alias must be lowercase and use [a-z0-9_]");
  }
  return alias;
}

function normalizeVisibility(value?: string): "private" | "internal" | "public" {
  const normalized = (value ?? "private").toLowerCase();
  if (normalized === "private" || normalized === "internal" || normalized === "public") {
    return normalized;
  }
  throw new UsageError("--visibility must be private, internal, or public");
}

function normalizeProfile(value?: string): "private" | "public" {
  const normalized = (value ?? "private").toLowerCase();
  if (normalized === "private" || normalized === "public") {
    return normalized;
  }
  throw new UsageError("--profile must be private or public");
}

function normalizeContained(value: string, label: string): string {
  try {
    return normalizeContainedWorkspacePath(value, label);
  } catch (err) {
    throw new UsageError(err instanceof Error ? err.message : String(err));
  }
}

function readRawConfig(root: string): { configPath: string; raw: Record<string, unknown> } {
  const configPath = path.join(root, ".mdkg", "config.json");
  if (!fs.existsSync(configPath)) {
    throw new NotFoundError(`config not found at ${configPath}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (err) {
    throw new UsageError(`failed to read config: ${err instanceof Error ? err.message : String(err)}`);
  }
  const migrated = migrateConfig(parsed).config;
  validateConfigSchema(migrated);
  if (typeof migrated !== "object" || migrated === null || Array.isArray(migrated)) {
    throw new UsageError("config must be a JSON object");
  }
  return { configPath, raw: migrated as Record<string, unknown> };
}

function writeRawConfig(configPath: string, raw: Record<string, unknown>): void {
  atomicWriteFile(configPath, `${JSON.stringify(raw, null, 2)}\n`);
}

function getSubgraphs(raw: Record<string, unknown>): Record<string, unknown> {
  if (raw.bundle_imports !== undefined) {
    throw new UsageError("config uses legacy bundle_imports; run `mdkg upgrade --apply` before editing subgraphs");
  }
  const subgraphs = raw.subgraphs;
  if (subgraphs === undefined) {
    raw.subgraphs = {};
    return raw.subgraphs as Record<string, unknown>;
  }
  if (typeof subgraphs !== "object" || subgraphs === null || Array.isArray(subgraphs)) {
    throw new UsageError("config.subgraphs must be an object");
  }
  return subgraphs as Record<string, unknown>;
}

function receiptForHealth(action: string, health: SubgraphHealth) {
  return {
    action,
    subgraph: health,
  };
}

function healthByAlias(root: string, alias: string): SubgraphHealth {
  const config = loadConfig(root);
  const health = buildSubgraphsIndex(root, config).index.subgraphs.find((item) => item.alias === alias);
  if (!health) {
    throw new NotFoundError(`subgraph not found: ${alias}`);
  }
  return health;
}

function withSubgraphLock<T>(root: string, fn: () => T): T {
  const config = loadConfig(root);
  return withMutationLock(root, config.index.lock_timeout_ms, fn);
}

function runSubgraphAddCommandLocked(options: SubgraphAddOptions): void {
  const alias = normalizeAlias(options.alias);
  const bundlePath = normalizeContained(options.bundlePath, "subgraph bundle path");
  const visibility = normalizeVisibility(options.visibility);
  const expected_profile = normalizeProfile(options.profile);
  if (visibility !== "private" && expected_profile !== "public") {
    throw new UsageError("--profile public is required when --visibility is public or internal");
  }
  const source_path = options.sourcePath
    ? normalizeContained(options.sourcePath, "subgraph source path")
    : undefined;
  if (options.maxStaleSeconds !== undefined && (!Number.isInteger(options.maxStaleSeconds) || options.maxStaleSeconds <= 0)) {
    throw new UsageError("--max-stale-seconds must be a positive integer");
  }

  const { configPath, raw } = readRawConfig(options.root);
  const subgraphs = getSubgraphs(raw);
  if (subgraphs[alias]) {
    throw new UsageError(`subgraph already exists: ${alias}`);
  }
  const workspaces = raw.workspaces as Record<string, unknown>;
  if (workspaces && workspaces[alias]) {
    throw new UsageError(`subgraph alias collides with workspace: ${alias}`);
  }
  subgraphs[alias] = {
    enabled: true,
    visibility,
    permissions: ["read"],
    max_stale_seconds: options.maxStaleSeconds ?? 3600,
    ...(source_path ? { source_path } : {}),
    ...(options.sourceRepo ? { source_repo: options.sourceRepo } : {}),
    sources: [
      {
        path: bundlePath,
        enabled: true,
        expected_profile,
      },
    ],
  };
  raw.subgraphs = subgraphs;
  const validated = validateConfigSchema(raw);
  const health = buildSubgraphsIndex(options.root, validated).index.subgraphs.find((item) => item.alias === alias);
  if (!health) {
    throw new NotFoundError(`subgraph not found after validation: ${alias}`);
  }
  if (health.error_count > 0) {
    throw new ValidationError(`subgraph ${alias} is invalid:\n${health.errors.join("\n")}`);
  }
  writeRawConfig(configPath, raw);
  const receipt = receiptForHealth("added", health);
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`subgraph added: ${alias} (${bundlePath})`);
  if (health.warning_count > 0) {
    console.log(`warnings: ${health.warning_count}`);
  }
}

export function runSubgraphAddCommand(options: SubgraphAddOptions): void {
  return withSubgraphLock(options.root, () => runSubgraphAddCommandLocked(options));
}

export function runSubgraphListCommand(options: SubgraphListOptions): void {
  const config = loadConfig(options.root);
  const subgraphs = buildSubgraphsIndex(options.root, config).index.subgraphs;
  if (options.json) {
    writeJson({ action: "list", count: subgraphs.length, subgraphs });
    return;
  }
  if (subgraphs.length === 0) {
    console.log("no subgraphs configured");
    return;
  }
  for (const item of subgraphs) {
    const status = item.enabled ? item.error_count > 0 ? "invalid" : item.stale ? "stale" : "ok" : "disabled";
    const sourcePaths = item.sources.map((source) => source.path).join(",");
    console.log(`${item.alias} | ${status} | ${item.visibility} | ${sourcePaths}`);
  }
}

export function runSubgraphShowCommand(options: SubgraphAliasOptions): void {
  const alias = normalizeAlias(options.alias);
  const health = healthByAlias(options.root, alias);
  if (options.json) {
    writeJson(receiptForHealth("show", health));
    return;
  }
  console.log(`${health.alias} | ${health.enabled ? "enabled" : "disabled"} | ${health.visibility}`);
  console.log(`permissions: ${health.permissions.join(",")}`);
  console.log(`max source count: ${health.sources.length}`);
  for (const source of health.sources) {
    const status = source.enabled ? source.error_count > 0 ? "invalid" : source.stale ? "stale" : "ok" : "disabled";
    console.log(`source: ${source.path} | ${status} | ${source.expected_profile}`);
  }
}

function runSubgraphRemoveCommandLocked(options: SubgraphAliasOptions): void {
  const alias = normalizeAlias(options.alias);
  const { configPath, raw } = readRawConfig(options.root);
  const subgraphs = getSubgraphs(raw);
  const existing = subgraphs[alias];
  if (!existing) {
    throw new NotFoundError(`subgraph not found: ${alias}`);
  }
  delete subgraphs[alias];
  raw.subgraphs = subgraphs;
  validateConfigSchema(raw);
  writeRawConfig(configPath, raw);
  const receipt = { action: "removed", subgraph: { alias } };
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`subgraph removed: ${alias}`);
}

export function runSubgraphRemoveCommand(options: SubgraphAliasOptions): void {
  return withSubgraphLock(options.root, () => runSubgraphRemoveCommandLocked(options));
}

function setSubgraphEnabledLocked(options: SubgraphAliasOptions, enabled: boolean): void {
  const alias = normalizeAlias(options.alias);
  const { configPath, raw } = readRawConfig(options.root);
  const subgraphs = getSubgraphs(raw);
  const existing = subgraphs[alias];
  if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
    throw new NotFoundError(`subgraph not found: ${alias}`);
  }
  subgraphs[alias] = { ...(existing as Record<string, unknown>), enabled };
  raw.subgraphs = subgraphs;
  validateConfigSchema(raw);
  writeRawConfig(configPath, raw);
  const health = healthByAlias(options.root, alias);
  const receipt = receiptForHealth(enabled ? "enabled" : "disabled", health);
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`subgraph ${enabled ? "enabled" : "disabled"}: ${alias}`);
}

export function runSubgraphEnableCommand(options: SubgraphAliasOptions): void {
  withSubgraphLock(options.root, () => setSubgraphEnabledLocked(options, true));
}

export function runSubgraphDisableCommand(options: SubgraphAliasOptions): void {
  withSubgraphLock(options.root, () => setSubgraphEnabledLocked(options, false));
}

function selectHealth(items: SubgraphHealth[], alias?: string, all?: boolean): SubgraphHealth[] {
  const includeAll = all || !alias;
  const selected = items.filter((item) => includeAll ? true : item.alias === alias);
  if (!includeAll && selected.length === 0) {
    throw new NotFoundError(`subgraph not found: ${alias}`);
  }
  return selected;
}

export function runSubgraphVerifyCommand(options: SubgraphVerifyOptions): void {
  const config = loadConfig(options.root);
  const subgraphs = selectHealth(buildSubgraphsIndex(options.root, config).index.subgraphs, options.alias, options.all);
  const ok = subgraphs.every((item) => item.error_count === 0 && !item.stale);
  const receipt = { action: "verified", ok, count: subgraphs.length, subgraphs };
  if (options.json) {
    writeJson(receipt);
  } else if (ok) {
    console.log(`subgraphs verified: ${subgraphs.length}`);
  } else {
    console.log(`subgraph verify failed: ${subgraphs.length}`);
    for (const item of subgraphs) {
      for (const warning of item.warnings) {
        console.log(`warning: ${item.alias}: ${warning}`);
      }
      for (const error of item.errors) {
        console.log(`error: ${item.alias}: ${error}`);
      }
    }
  }
  if (!ok) {
    throw new ValidationError("subgraph verify failed");
  }
}

export function runSubgraphRefreshCommand(options: SubgraphRefreshOptions): void {
  withSubgraphLock(options.root, () => {
    const config = loadConfig(options.root);
    const result = writeDerivedIndexes(options.root, config);
    const subgraphs = selectHealth(buildSubgraphsIndex(options.root, config).index.subgraphs, options.alias, options.all);
    const ok = subgraphs.every((item) => item.error_count === 0);
    const receipt = {
      action: "refreshed",
      ok,
      count: subgraphs.length,
      paths: result.paths,
      subgraphs,
    };
    if (options.json) {
      writeJson(receipt);
    } else {
      console.log(`subgraphs refreshed: ${subgraphs.length}`);
      console.log(`index: ${path.relative(options.root, result.paths.subgraphs)}`);
    }
    if (!ok) {
      throw new ValidationError("subgraph refresh failed");
    }
  });
}
