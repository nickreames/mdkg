import fs from "fs";
import path from "path";
import { loadConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import { normalizeContainedWorkspacePath } from "../core/workspace_path";
import { buildBundleImportsIndex, BundleImportHealth } from "../graph/bundle_imports";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { atomicWriteFile } from "../util/atomic";
import { withMutationLock } from "../util/lock";

export type BundleImportAddOptions = {
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

export type BundleImportAliasOptions = {
  root: string;
  alias: string;
  json?: boolean;
};

export type BundleImportListOptions = {
  root: string;
  json?: boolean;
};

export type BundleImportVerifyOptions = {
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
    throw new UsageError("bundle import alias cannot be 'all'");
  }
  if (alias !== alias.toLowerCase() || !ALIAS_RE.test(alias)) {
    throw new UsageError("bundle import alias must be lowercase and use [a-z0-9_]");
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

function getImports(raw: Record<string, unknown>): Record<string, unknown> {
  const imports = raw.bundle_imports;
  if (imports === undefined) {
    raw.bundle_imports = {};
    return raw.bundle_imports as Record<string, unknown>;
  }
  if (typeof imports !== "object" || imports === null || Array.isArray(imports)) {
    throw new UsageError("config.bundle_imports must be an object");
  }
  return imports as Record<string, unknown>;
}

function receiptForHealth(action: string, health: BundleImportHealth) {
  return {
    action,
    import: health,
  };
}

function healthByAlias(root: string, alias: string): BundleImportHealth {
  const config = loadConfig(root);
  const health = buildBundleImportsIndex(root, config).index.imports.find((item) => item.alias === alias);
  if (!health) {
    throw new NotFoundError(`bundle import not found: ${alias}`);
  }
  return health;
}

function withBundleImportLock<T>(root: string, fn: () => T): T {
  const config = loadConfig(root);
  return withMutationLock(root, config.index.lock_timeout_ms, fn);
}

function runBundleImportAddCommandLocked(options: BundleImportAddOptions): void {
  const alias = normalizeAlias(options.alias);
  const bundlePath = normalizeContained(options.bundlePath, "bundle import path");
  const visibility = normalizeVisibility(options.visibility);
  const expected_profile = normalizeProfile(options.profile);
  if (visibility !== "private" && expected_profile !== "public") {
    throw new UsageError("--profile public is required when --visibility is public or internal");
  }
  const source_path = options.sourcePath
    ? normalizeContained(options.sourcePath, "bundle import source path")
    : undefined;
  if (options.maxStaleSeconds !== undefined && (!Number.isInteger(options.maxStaleSeconds) || options.maxStaleSeconds <= 0)) {
    throw new UsageError("--max-stale-seconds must be a positive integer");
  }

  const { configPath, raw } = readRawConfig(options.root);
  const imports = getImports(raw);
  if (imports[alias]) {
    throw new UsageError(`bundle import already exists: ${alias}`);
  }
  const workspaces = raw.workspaces as Record<string, unknown>;
  if (workspaces && workspaces[alias]) {
    throw new UsageError(`bundle import alias collides with workspace: ${alias}`);
  }
  imports[alias] = {
    path: bundlePath,
    enabled: true,
    visibility,
    expected_profile,
    ...(source_path ? { source_path } : {}),
    ...(options.sourceRepo ? { source_repo: options.sourceRepo } : {}),
    ...(options.maxStaleSeconds !== undefined ? { max_stale_seconds: options.maxStaleSeconds } : {}),
  };
  raw.bundle_imports = imports;
  const validated = validateConfigSchema(raw);
  const health = buildBundleImportsIndex(options.root, validated).index.imports.find((item) => item.alias === alias);
  if (!health) {
    throw new NotFoundError(`bundle import not found after validation: ${alias}`);
  }
  if (health.error_count > 0) {
    throw new ValidationError(`bundle import ${alias} is invalid:\n${health.errors.join("\n")}`);
  }
  writeRawConfig(configPath, raw);
  const receipt = receiptForHealth("added", health);
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`bundle import added: ${alias} (${bundlePath})`);
  if (health.warning_count > 0) {
    console.log(`warnings: ${health.warning_count}`);
  }
}

export function runBundleImportAddCommand(options: BundleImportAddOptions): void {
  return withBundleImportLock(options.root, () => runBundleImportAddCommandLocked(options));
}

export function runBundleImportListCommand(options: BundleImportListOptions): void {
  const config = loadConfig(options.root);
  const imports = buildBundleImportsIndex(options.root, config).index.imports;
  if (options.json) {
    writeJson({ action: "list", count: imports.length, imports });
    return;
  }
  if (imports.length === 0) {
    console.log("no bundle imports configured");
    return;
  }
  for (const item of imports) {
    const status = item.enabled ? item.error_count > 0 ? "invalid" : item.stale ? "stale" : "ok" : "disabled";
    console.log(`${item.alias} | ${status} | ${item.visibility} | ${item.path}`);
  }
}

function runBundleImportRemoveCommandLocked(options: BundleImportAliasOptions): void {
  const alias = normalizeAlias(options.alias);
  const { configPath, raw } = readRawConfig(options.root);
  const imports = getImports(raw);
  const existing = imports[alias];
  if (!existing) {
    throw new NotFoundError(`bundle import not found: ${alias}`);
  }
  delete imports[alias];
  raw.bundle_imports = imports;
  validateConfigSchema(raw);
  writeRawConfig(configPath, raw);
  const receipt = { action: "removed", import: { alias } };
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`bundle import removed: ${alias}`);
}

export function runBundleImportRemoveCommand(options: BundleImportAliasOptions): void {
  return withBundleImportLock(options.root, () => runBundleImportRemoveCommandLocked(options));
}

function setBundleImportEnabledLocked(options: BundleImportAliasOptions, enabled: boolean): void {
  const alias = normalizeAlias(options.alias);
  const { configPath, raw } = readRawConfig(options.root);
  const imports = getImports(raw);
  const existing = imports[alias];
  if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
    throw new NotFoundError(`bundle import not found: ${alias}`);
  }
  imports[alias] = { ...(existing as Record<string, unknown>), enabled };
  raw.bundle_imports = imports;
  validateConfigSchema(raw);
  writeRawConfig(configPath, raw);
  const health = healthByAlias(options.root, alias);
  const receipt = receiptForHealth(enabled ? "enabled" : "disabled", health);
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`bundle import ${enabled ? "enabled" : "disabled"}: ${alias}`);
}

export function runBundleImportEnableCommand(options: BundleImportAliasOptions): void {
  withBundleImportLock(options.root, () => setBundleImportEnabledLocked(options, true));
}

export function runBundleImportDisableCommand(options: BundleImportAliasOptions): void {
  withBundleImportLock(options.root, () => setBundleImportEnabledLocked(options, false));
}

export function runBundleImportVerifyCommand(options: BundleImportVerifyOptions): void {
  const config = loadConfig(options.root);
  const all = options.all || !options.alias;
  const imports = buildBundleImportsIndex(options.root, config).index.imports.filter((item) =>
    all ? true : item.alias === options.alias
  );
  if (!all && imports.length === 0) {
    throw new NotFoundError(`bundle import not found: ${options.alias}`);
  }
  const ok = imports.every((item) => item.error_count === 0 && !item.stale);
  const receipt = { action: "verified", ok, count: imports.length, imports };
  if (options.json) {
    writeJson(receipt);
  } else if (ok) {
    console.log(`bundle imports verified: ${imports.length}`);
  } else {
    console.log(`bundle import verify failed: ${imports.length}`);
    for (const item of imports) {
      for (const warning of item.warnings) {
        console.log(`warning: ${item.alias}: ${warning}`);
      }
      for (const error of item.errors) {
        console.log(`error: ${item.alias}: ${error}`);
      }
    }
  }
  if (!ok) {
    throw new ValidationError("bundle import verify failed");
  }
}
