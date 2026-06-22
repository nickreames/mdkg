import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { loadConfig, SubgraphConfig, SubgraphSourceConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import { normalizeContainedWorkspacePath } from "../core/workspace_path";
import { buildSubgraphsIndex, SubgraphHealth } from "../graph/subgraphs";
import { writeDerivedIndexes } from "../graph/reindex";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { atomicWriteFile } from "../util/atomic";
import { withMutationLock } from "../util/lock";
import { buildBundle, parseBundle, sha256Buffer, verifyBundle } from "./bundle";

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

export type SubgraphSyncOptions = {
  root: string;
  alias?: string;
  all?: boolean;
  dryRun?: boolean;
  allowDirty?: boolean;
  json?: boolean;
};

export type SubgraphMaterializeOptions = {
  root: string;
  alias?: string;
  all?: boolean;
  target: string;
  clean?: boolean;
  gitignore?: boolean;
  json?: boolean;
};

export type SubgraphAuditOptions = {
  root: string;
  alias?: string;
  all?: boolean;
  target?: string;
  json?: boolean;
};

export type SubgraphUpgradePlanOptions = {
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

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function relativeToRoot(root: string, filePath: string): string {
  return toPosixPath(path.relative(root, filePath));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPackageVersion(): string {
  const packagePath = path.resolve(__dirname, "..", "..", "package.json");
  try {
    const raw = JSON.parse(fs.readFileSync(packagePath, "utf8")) as { version?: unknown };
    return typeof raw.version === "string" ? raw.version : "unknown";
  } catch {
    return "unknown";
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

function selectAliases(config: ReturnType<typeof loadConfig>, alias?: string, all?: boolean): string[] {
  if (alias && all) {
    throw new UsageError("choose either an alias or --all, not both");
  }
  if (alias) {
    const normalized = normalizeAlias(alias);
    if (!config.subgraphs[normalized]) {
      throw new NotFoundError(`subgraph not found: ${normalized}`);
    }
    return [normalized];
  }
  return Object.keys(config.subgraphs).sort();
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

type SubgraphAuditCheck = {
  id: string;
  ok: boolean;
  severity: "info" | "warning" | "error";
  message: string;
  path?: string;
  details?: Record<string, unknown>;
};

function dirtySourceGuidance(paths: string[]): string {
  return `source_path has dirty tracked changes: ${paths.join(", ")}; commit or stash the child repo first, then refresh the root-owned subgraph bundle from the clean accepted child commit`;
}

type SubgraphAuditReceipt = {
  alias: string;
  enabled: boolean;
  visibility: "private" | "internal" | "public";
  source_path?: string;
  source_repo?: string;
  source_git_head?: string;
  source_repo_current?: string;
  dirty_tracked?: boolean;
  dirty_tracked_paths?: string[];
  capability_summary: {
    node_count: number;
    spec_count: number;
    work_count: number;
    skill_count: number;
  };
  checks: SubgraphAuditCheck[];
  warnings: string[];
  errors: string[];
  ok: boolean;
};

function pushAuditCheck(receipt: SubgraphAuditReceipt, check: SubgraphAuditCheck): void {
  receipt.checks.push(check);
  if (!check.ok && check.severity === "error") {
    receipt.errors.push(`${check.id}: ${check.message}`);
  } else if (!check.ok && check.severity === "warning") {
    receipt.warnings.push(`${check.id}: ${check.message}`);
  }
}

function inspectSourcePathForAudit(root: string, alias: string, subgraph: SubgraphConfig): GitState | undefined {
  try {
    return inspectSourcePath(root, alias, subgraph, true);
  } catch {
    return undefined;
  }
}

function auditOneAlias(options: {
  root: string;
  alias: string;
  subgraph: SubgraphConfig;
  health: SubgraphHealth;
  nodeTypes: string[];
  targetRoot?: string;
}): SubgraphAuditReceipt {
  const receipt: SubgraphAuditReceipt = {
    alias: options.alias,
    enabled: options.health.enabled,
    visibility: options.health.visibility,
    source_path: options.health.source_path,
    source_repo: options.health.source_repo,
    capability_summary: {
      node_count: options.nodeTypes.length,
      spec_count: options.nodeTypes.filter((type) => type === "spec").length,
      work_count: options.nodeTypes.filter((type) => type === "work").length,
      skill_count: options.nodeTypes.filter((type) => type === "skill").length,
    },
    checks: [],
    warnings: [],
    errors: [],
    ok: true,
  };

  pushAuditCheck(receipt, {
    id: "subgraph.enabled",
    ok: options.subgraph.enabled,
    severity: options.subgraph.enabled ? "info" : "warning",
    message: options.subgraph.enabled ? "subgraph is enabled" : "subgraph is disabled",
  });

  if (!options.subgraph.source_path) {
    pushAuditCheck(receipt, {
      id: "subgraph.source_path.configured",
      ok: false,
      severity: "warning",
      message: "source_path is not configured; sync and upgrade planning cannot inspect child Git state",
    });
  } else {
    let gitState: GitState | undefined;
    try {
      gitState = inspectSourcePath(options.root, options.alias, options.subgraph, true);
      receipt.source_git_head = gitState.head;
      receipt.source_repo_current = gitState.sourceRepo;
      receipt.dirty_tracked = gitState.dirtyTracked;
      receipt.dirty_tracked_paths = gitState.dirtyTrackedPaths;
      pushAuditCheck(receipt, {
        id: "subgraph.source_path.git_root",
        ok: true,
        severity: "info",
        message: "source_path is a contained child Git repo root with .mdkg",
        path: options.subgraph.source_path,
      });
      pushAuditCheck(receipt, {
        id: "subgraph.source_path.clean",
        ok: !gitState.dirtyTracked,
        severity: "warning",
        message: gitState.dirtyTracked
          ? dirtySourceGuidance(gitState.dirtyTrackedPaths)
          : "source_path has no dirty tracked changes",
        path: options.subgraph.source_path,
        details: { dirty_tracked_paths: gitState.dirtyTrackedPaths },
      });
      if (options.subgraph.source_repo && options.subgraph.source_repo !== gitState.sourceRepo) {
        pushAuditCheck(receipt, {
          id: "subgraph.source_repo.current",
          ok: false,
          severity: "warning",
          message: `configured source_repo differs from child repo head: ${options.subgraph.source_repo} -> ${gitState.sourceRepo}`,
          details: { configured: options.subgraph.source_repo, current: gitState.sourceRepo },
        });
      }
    } catch (err) {
      pushAuditCheck(receipt, {
        id: "subgraph.source_path.git_root",
        ok: false,
        severity: "error",
        message: err instanceof Error ? err.message : String(err),
        path: options.subgraph.source_path,
      });
    }

    if (gitState) {
      for (const source of options.subgraph.sources) {
        const bundlePath = path.resolve(options.root, source.path);
        pushAuditCheck(receipt, {
          id: "subgraph.bundle.root_owned",
          ok: !isPathWithin(gitState.sourceRoot, bundlePath),
          severity: "error",
          message: isPathWithin(gitState.sourceRoot, bundlePath)
            ? `bundle path must be root-owned and outside source_path: ${source.path}`
            : `bundle path is root-owned and outside source_path: ${source.path}`,
          path: source.path,
        });
      }
    }
  }

  for (const source of options.health.sources) {
    pushAuditCheck(receipt, {
      id: "subgraph.bundle.enabled",
      ok: source.enabled,
      severity: source.enabled ? "info" : "warning",
      message: source.enabled ? `source is enabled: ${source.path}` : `source is disabled: ${source.path}`,
      path: source.path,
    });
    pushAuditCheck(receipt, {
      id: "subgraph.bundle.valid",
      ok: source.error_count === 0,
      severity: "error",
      message: source.error_count === 0
        ? `bundle source is valid: ${source.path}`
        : `bundle source has errors: ${source.errors.join("; ")}`,
      path: source.path,
      details: { errors: source.errors },
    });
    pushAuditCheck(receipt, {
      id: "subgraph.bundle.fresh",
      ok: !source.stale,
      severity: "warning",
      message: source.stale
        ? `bundle source is stale: ${source.warnings.join("; ")}`
        : `bundle source is fresh: ${source.path}`,
      path: source.path,
      details: { warnings: source.warnings },
    });
  }

  if (options.targetRoot) {
    const outputDir = path.join(options.targetRoot, options.alias);
    const markerPath = path.join(outputDir, ".mdkg-materialized.json");
    const exists = fs.existsSync(outputDir);
    const hasMarker = fs.existsSync(markerPath);
    pushAuditCheck(receipt, {
      id: "subgraph.materialize.target_safe",
      ok: !exists || hasMarker,
      severity: "error",
      message: !exists
        ? `materialize target is available: ${relativeToRoot(options.root, outputDir)}`
        : hasMarker
          ? `materialize target has mdkg marker: ${relativeToRoot(options.root, outputDir)}`
          : `materialize target exists without mdkg marker: ${relativeToRoot(options.root, outputDir)}`,
      path: relativeToRoot(options.root, outputDir),
    });
  }

  receipt.ok = receipt.errors.length === 0;
  return receipt;
}

export function runSubgraphAuditCommand(options: SubgraphAuditOptions): void {
  const config = loadConfig(options.root);
  const aliases = selectAliases(config, options.alias, options.all);
  const projection = buildSubgraphsIndex(options.root, config).index;
  const targetRoot = options.target ? path.resolve(options.root, normalizeContained(options.target, "--target")) : undefined;
  const results = aliases.map((alias) => {
    const health = projection.subgraphs.find((item) => item.alias === alias);
    if (!health) {
      throw new NotFoundError(`subgraph not found: ${alias}`);
    }
    const nodeTypes = Object.values(projection.nodes)
      .filter((node) => node.ws === alias)
      .map((node) => node.type);
    return auditOneAlias({ root: options.root, alias, subgraph: config.subgraphs[alias], health, nodeTypes, targetRoot });
  });
  const errors = results.flatMap((item) => item.errors.map((error) => `${item.alias}: ${error}`));
  const warnings = results.flatMap((item) => item.warnings.map((warning) => `${item.alias}: ${warning}`));
  const receipt = {
    action: "audited",
    ok: errors.length === 0,
    count: results.length,
    target: targetRoot ? relativeToRoot(options.root, targetRoot) : undefined,
    errors,
    warnings,
    subgraphs: results,
  };
  if (options.json) {
    writeJson(receipt);
  } else {
    console.log(`subgraphs audited: ${results.length}`);
    for (const item of results) {
      const status = item.errors.length > 0 ? "error" : item.warnings.length > 0 ? "warning" : "ok";
      console.log(`${item.alias} | ${status} | checks:${item.checks.length}`);
    }
  }
  if (!receipt.ok) {
    throw new ValidationError("subgraph audit failed");
  }
}

function upgradePlanForAlias(options: {
  root: string;
  alias: string;
  subgraph: SubgraphConfig;
  audit: SubgraphAuditReceipt;
  health: SubgraphHealth;
}): Record<string, unknown> {
  const actions: Array<Record<string, unknown>> = [];
  const blockers: string[] = [];
  if (!options.subgraph.enabled) {
    actions.push({
      action: "none",
      status: "skipped",
      reason: "subgraph is disabled",
    });
    return { alias: options.alias, ok: true, capability_summary: options.audit.capability_summary, actions, blockers };
  }
  if (!options.subgraph.source_path) {
    blockers.push("source_path is required for upgrade planning");
  }
  const sourceGitError = options.audit.checks.find((check) => check.id === "subgraph.source_path.git_root" && !check.ok && check.severity === "error");
  if (sourceGitError) {
    blockers.push(sourceGitError.message);
  }
  if (options.audit.dirty_tracked) {
    blockers.push(dirtySourceGuidance(options.audit.dirty_tracked_paths ?? []));
  }
  const rootOwnedErrors = options.audit.checks.filter((check) => check.id === "subgraph.bundle.root_owned" && !check.ok);
  blockers.push(...rootOwnedErrors.map((check) => check.message));
  const bundleErrors = options.health.sources.flatMap((source) => source.errors.map((error) => `${source.path}: ${error}`));
  blockers.push(...bundleErrors);

  const needsSync =
    options.health.stale ||
    !options.subgraph.source_repo ||
    (options.audit.source_repo_current !== undefined && options.subgraph.source_repo !== options.audit.source_repo_current);

  if (blockers.length > 0) {
    actions.push({
      action: "subgraph.sync",
      status: "blocked",
      command: `mdkg subgraph sync ${options.alias} --dry-run --json`,
      blockers,
    });
  } else if (needsSync) {
    actions.push({
      action: "subgraph.sync",
      status: "planned",
      command: `mdkg subgraph sync ${options.alias} --dry-run --json`,
      apply_command: `mdkg subgraph sync ${options.alias} --json`,
      reason: options.health.stale ? "bundle is stale or source HEAD changed" : "configured source_repo is missing or behind current child head",
      current_source_repo: options.audit.source_repo_current,
      configured_source_repo: options.subgraph.source_repo,
    });
  } else {
    actions.push({
      action: "subgraph.verify",
      status: "planned",
      command: `mdkg subgraph verify ${options.alias} --json`,
      reason: "bundle snapshot is current; verify before downstream use",
    });
  }

  actions.push({
    action: "subgraph.materialize",
    status: "optional",
    command: `mdkg subgraph materialize ${options.alias} --target .mdkg/subgraphs --gitignore --json`,
    reason: "generate an ignored read-only inspection tree when human review needs file-level child graph context",
  });

  return { alias: options.alias, ok: blockers.length === 0, capability_summary: options.audit.capability_summary, actions, blockers };
}

export function runSubgraphUpgradePlanCommand(options: SubgraphUpgradePlanOptions): void {
  const config = loadConfig(options.root);
  const aliases = selectAliases(config, options.alias, options.all);
  const projection = buildSubgraphsIndex(options.root, config).index;
  const plans = aliases.map((alias) => {
    const health = projection.subgraphs.find((item) => item.alias === alias);
    if (!health) {
      throw new NotFoundError(`subgraph not found: ${alias}`);
    }
    const nodeTypes = Object.values(projection.nodes)
      .filter((node) => node.ws === alias)
      .map((node) => node.type);
    const audit = auditOneAlias({ root: options.root, alias, subgraph: config.subgraphs[alias], health, nodeTypes });
    return upgradePlanForAlias({ root: options.root, alias, subgraph: config.subgraphs[alias], audit, health });
  });
  const blockers = plans.flatMap((plan) => (plan.blockers as string[]).map((blocker) => `${plan.alias}: ${blocker}`));
  const receipt = {
    action: "upgrade_plan",
    ok: blockers.length === 0,
    count: plans.length,
    apply_supported: false,
    mutation_policy: "read_only_plan",
    blockers,
    subgraphs: plans,
  };
  if (options.json) {
    writeJson(receipt);
  } else {
    console.log(`subgraph upgrade plan: ${plans.length}`);
    for (const plan of plans) {
      console.log(`${plan.alias} | ${plan.ok ? "ok" : "blocked"} | actions:${(plan.actions as unknown[]).length}`);
    }
  }
  if (!receipt.ok) {
    throw new ValidationError("subgraph upgrade plan blocked");
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

type GitState = {
  sourceRoot: string;
  branch: string;
  head: string;
  sourceRepo: string;
  dirtyTracked: boolean;
  dirtyTrackedPaths: string[];
};

function gitRun(cwd: string, args: string[]): { ok: boolean; stdout: string; stderr: string } {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" });
  return {
    ok: result.status === 0,
    stdout: result.stdout.replace(/\r?\n$/, ""),
    stderr: result.stderr.trim(),
  };
}

function sameRealPath(a: string, b: string): boolean {
  try {
    return fs.realpathSync(a) === fs.realpathSync(b);
  } catch {
    return path.resolve(a) === path.resolve(b);
  }
}

function isPathWithin(parent: string, child: string): boolean {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function inspectSourcePath(root: string, alias: string, subgraph: SubgraphConfig, allowDirty: boolean): GitState {
  if (!subgraph.source_path) {
    throw new UsageError(`subgraph ${alias} is missing source_path`);
  }
  const sourcePath = normalizeContained(subgraph.source_path, `subgraphs.${alias}.source_path`);
  const sourceRoot = path.resolve(root, sourcePath);
  if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
    throw new NotFoundError(`subgraph ${alias} source_path does not exist: ${sourcePath}`);
  }
  const gitTop = gitRun(sourceRoot, ["rev-parse", "--show-toplevel"]);
  const gitTopPath = gitTop.stdout.trim();
  if (!gitTop.ok || !gitTopPath) {
    throw new UsageError(`subgraph ${alias} source_path is not a Git repo: ${sourcePath}`);
  }
  if (!sameRealPath(gitTopPath, sourceRoot)) {
    throw new UsageError(`subgraph ${alias} source_path must be the child Git repo root: ${sourcePath}`);
  }
  const mdkgDir = path.join(sourceRoot, ".mdkg");
  if (!fs.existsSync(mdkgDir) || !fs.statSync(mdkgDir).isDirectory()) {
    throw new NotFoundError(`subgraph ${alias} source_path is missing .mdkg: ${sourcePath}`);
  }
  const head = gitRun(sourceRoot, ["rev-parse", "HEAD"]);
  const headValue = head.stdout.trim();
  if (!head.ok || !headValue) {
    throw new UsageError(`subgraph ${alias} source Git HEAD could not be read`);
  }
  const branchResult = gitRun(sourceRoot, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const branchValue = branchResult.stdout.trim();
  const branch = branchResult.ok && branchValue && branchValue !== "HEAD"
    ? branchValue
    : "detached";
  const status = gitRun(sourceRoot, ["status", "--porcelain", "--untracked-files=no"]);
  if (!status.ok) {
    throw new UsageError(`subgraph ${alias} tracked dirty state could not be read`);
  }
  const dirtyTrackedPaths = status.stdout
    ? status.stdout.split(/\r?\n/).map((line) => line.slice(3)).filter(Boolean).sort()
    : [];
  if (dirtyTrackedPaths.length > 0 && !allowDirty) {
    throw new UsageError(`subgraph ${alias} ${dirtySourceGuidance(dirtyTrackedPaths)}`);
  }
  return {
    sourceRoot,
    branch,
    head: headValue,
    sourceRepo: `${branch}@${headValue}`,
    dirtyTracked: dirtyTrackedPaths.length > 0,
    dirtyTrackedPaths,
  };
}

function existingBundleHash(bundlePath: string): string | undefined {
  if (!fs.existsSync(bundlePath)) {
    return undefined;
  }
  try {
    return parseBundle(bundlePath).manifest.bundle_hash;
  } catch {
    return undefined;
  }
}

type SyncSourceReceipt = {
  label?: string;
  path: string;
  enabled: boolean;
  expected_profile: string;
  old_bundle_hash?: string;
  new_bundle_hash?: string;
  old_zip_sha256?: string;
  new_zip_sha256?: string;
  verified?: boolean;
  skipped?: boolean;
  warnings: string[];
  errors: string[];
};

type SyncAliasReceipt = {
  alias: string;
  enabled: boolean;
  dry_run: boolean;
  source_path?: string;
  old_source_repo?: string;
  new_source_repo?: string;
  source_git_head?: string;
  dirty_tracked?: boolean;
  dirty_tracked_paths?: string[];
  updated: boolean;
  skipped: boolean;
  warnings: string[];
  errors: string[];
  sources: SyncSourceReceipt[];
};

function enabledSources(subgraph: SubgraphConfig): SubgraphSourceConfig[] {
  return subgraph.sources.filter((source) => source.enabled);
}

function syncOneAlias(options: {
  root: string;
  alias: string;
  subgraph: SubgraphConfig;
  rawSubgraphs: Record<string, unknown>;
  dryRun: boolean;
  allowDirty: boolean;
}): SyncAliasReceipt {
  const warnings: string[] = [];
  const errors: string[] = [];
  const sources: SyncSourceReceipt[] = [];
  const receipt: SyncAliasReceipt = {
    alias: options.alias,
    enabled: options.subgraph.enabled,
    dry_run: options.dryRun,
    source_path: options.subgraph.source_path,
    old_source_repo: options.subgraph.source_repo,
    updated: false,
    skipped: false,
    warnings,
    errors,
    sources,
  };
  if (!options.subgraph.enabled) {
    receipt.skipped = true;
    warnings.push("subgraph is disabled");
    return receipt;
  }

  let gitState: GitState;
  try {
    gitState = inspectSourcePath(options.root, options.alias, options.subgraph, options.allowDirty);
    receipt.new_source_repo = gitState.sourceRepo;
    receipt.source_git_head = gitState.head;
    receipt.dirty_tracked = gitState.dirtyTracked;
    receipt.dirty_tracked_paths = gitState.dirtyTrackedPaths;
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
    return receipt;
  }

  const activeSources = enabledSources(options.subgraph);
  if (activeSources.length === 0) {
    errors.push(`subgraph ${options.alias} has no enabled sources`);
    return receipt;
  }

  const planned: Array<{ source: SubgraphSourceConfig; outputPath: string; zip: Buffer; newBundleHash: string; newZipSha256: string }> = [];
  for (const source of activeSources) {
    const outputPath = path.resolve(options.root, source.path);
    const sourceReceipt: SyncSourceReceipt = {
      label: source.label,
      path: source.path,
      enabled: source.enabled,
      expected_profile: source.expected_profile,
      old_bundle_hash: existingBundleHash(outputPath),
      old_zip_sha256: fs.existsSync(outputPath) ? sha256Buffer(fs.readFileSync(outputPath)) : undefined,
      warnings: [],
      errors: [],
    };
    sources.push(sourceReceipt);
    if (isPathWithin(gitState.sourceRoot, outputPath)) {
      sourceReceipt.errors.push(`bundle path must be root-owned and outside source_path: ${source.path}`);
      errors.push(`source ${source.path}: ${sourceReceipt.errors[sourceReceipt.errors.length - 1]}`);
      continue;
    }
    try {
      const built = buildBundle({
        root: gitState.sourceRoot,
        profile: source.expected_profile,
        output: outputPath,
      });
      sourceReceipt.new_bundle_hash = built.manifest.bundle_hash;
      sourceReceipt.new_zip_sha256 = built.zipSha256;
      planned.push({
        source,
        outputPath,
        zip: built.zip,
        newBundleHash: built.manifest.bundle_hash,
        newZipSha256: built.zipSha256,
      });
    } catch (err) {
      sourceReceipt.errors.push(err instanceof Error ? err.message : String(err));
      errors.push(`source ${source.path}: ${sourceReceipt.errors[sourceReceipt.errors.length - 1]}`);
    }
  }

  if (errors.length > 0) {
    return receipt;
  }
  if (options.dryRun) {
    receipt.skipped = true;
    return receipt;
  }

  for (const item of planned) {
    const sourceReceipt = sources.find((source) => source.path === item.source.path);
    try {
      atomicWriteFile(item.outputPath, item.zip);
      const verify = verifyBundle(gitState.sourceRoot, item.outputPath);
      sourceReceipt!.verified = verify.ok;
      if (!verify.ok) {
        sourceReceipt!.errors.push(...verify.errors, ...verify.stale_paths.map((stale) => `stale: ${stale}`));
        errors.push(`source ${item.source.path}: bundle verify failed`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      sourceReceipt!.errors.push(message);
      errors.push(`source ${item.source.path}: ${message}`);
    }
  }

  if (errors.length === 0) {
    const raw = options.rawSubgraphs[options.alias];
    if (isObject(raw)) {
      options.rawSubgraphs[options.alias] = { ...raw, source_repo: gitState.sourceRepo };
    }
    receipt.updated = true;
  }
  return receipt;
}

export function runSubgraphSyncCommand(options: SubgraphSyncOptions): void {
  const dryRun = Boolean(options.dryRun);
  const allowDirty = Boolean(options.allowDirty);
  withSubgraphLock(options.root, () => {
    const config = loadConfig(options.root);
    const aliases = selectAliases(config, options.alias, options.all);
    const { configPath, raw } = readRawConfig(options.root);
    const rawSubgraphs = getSubgraphs(raw);
    const results = aliases.map((alias) =>
      syncOneAlias({
        root: options.root,
        alias,
        subgraph: config.subgraphs[alias],
        rawSubgraphs,
        dryRun,
        allowDirty,
      })
    );
    const ok = results.every((item) => item.errors.length === 0);
    let indexPaths: ReturnType<typeof writeDerivedIndexes>["paths"] | undefined;
    if (!dryRun && results.some((item) => item.updated)) {
      raw.subgraphs = rawSubgraphs;
      validateConfigSchema(raw);
      writeRawConfig(configPath, raw);
      indexPaths = writeDerivedIndexes(options.root, loadConfig(options.root)).paths;
    }
    const receipt = {
      action: dryRun ? "sync_dry_run" : "synced",
      ok,
      count: results.length,
      updated: results.filter((item) => item.updated).map((item) => item.alias),
      skipped: results.filter((item) => item.skipped).map((item) => item.alias),
      errors: results.flatMap((item) => item.errors.map((error) => `${item.alias}: ${error}`)),
      warnings: results.flatMap((item) => item.warnings.map((warning) => `${item.alias}: ${warning}`)),
      ...(indexPaths ? { paths: indexPaths } : {}),
      subgraphs: results,
    };
    if (options.json) {
      writeJson(receipt);
    } else {
      console.log(`${dryRun ? "subgraph sync dry-run" : "subgraphs synced"}: ${results.length}`);
      for (const item of results) {
        const status = item.errors.length > 0 ? "error" : item.updated ? "updated" : item.skipped ? "skipped" : "ok";
        console.log(`${item.alias} | ${status} | ${item.new_source_repo ?? item.old_source_repo ?? "unknown"}`);
      }
    }
    if (!ok) {
      throw new ValidationError("subgraph sync failed");
    }
  });
}

function safeZipEntryPath(entryName: string): string {
  const normalized = entryName.replace(/\\/g, "/");
  const parts = normalized.split("/");
  if (path.isAbsolute(normalized) || parts.some((part) => part === "..") || parts.some((part) => part.length === 0)) {
    throw new ValidationError(`unsafe bundle entry path: ${entryName}`);
  }
  return normalized;
}

function writeMaterializeGitignore(targetRoot: string): void {
  const gitignorePath = path.join(targetRoot, ".gitignore");
  const required = ["*", "!.gitignore"];
  const existing = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, "utf8").split(/\r?\n/)
    : [];
  const lines = existing.filter((line) => line.length > 0);
  for (const line of required) {
    if (!lines.includes(line)) {
      lines.push(line);
    }
  }
  atomicWriteFile(gitignorePath, `${lines.join("\n")}\n`);
}

function materializeOneAlias(options: {
  root: string;
  alias: string;
  subgraph: SubgraphConfig;
  targetRoot: string;
  clean: boolean;
}): Record<string, unknown> {
  const enabled = enabledSources(options.subgraph);
  const errors: string[] = [];
  const warnings: string[] = [];
  const outputDir = path.join(options.targetRoot, options.alias);
  if (enabled.length !== 1) {
    errors.push(`materialize requires exactly one enabled source for ${options.alias}; found ${enabled.length}`);
    return { alias: options.alias, ok: false, output_path: relativeToRoot(options.root, outputDir), warnings, errors };
  }
  const source = enabled[0];
  const bundlePath = path.resolve(options.root, source.path);
  if (!fs.existsSync(bundlePath)) {
    errors.push(`bundle not found: ${source.path}`);
    return { alias: options.alias, ok: false, output_path: relativeToRoot(options.root, outputDir), warnings, errors };
  }
  if (fs.existsSync(outputDir)) {
    const marker = path.join(outputDir, ".mdkg-materialized.json");
    if (!options.clean) {
      errors.push(`materialized directory already exists: ${relativeToRoot(options.root, outputDir)}; use --clean`);
      return { alias: options.alias, ok: false, output_path: relativeToRoot(options.root, outputDir), warnings, errors };
    }
    if (!fs.existsSync(marker)) {
      errors.push(`refusing to clean non-materialized directory: ${relativeToRoot(options.root, outputDir)}`);
      return { alias: options.alias, ok: false, output_path: relativeToRoot(options.root, outputDir), warnings, errors };
    }
  }

  const tempDir = path.join(options.targetRoot, `.${options.alias}.${process.pid}.${Date.now()}.tmp`);
  fs.rmSync(tempDir, { recursive: true, force: true });
  try {
    const parsed = parseBundle(bundlePath);
    fs.mkdirSync(tempDir, { recursive: true });
    for (const [entryName, data] of parsed.entries.entries()) {
      const safeName = safeZipEntryPath(entryName);
      const target = path.join(tempDir, safeName);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, data);
    }
    const marker = {
      tool: "mdkg",
      kind: "subgraph_materialization",
      alias: options.alias,
      bundle_path: source.path,
      bundle_hash: parsed.manifest.bundle_hash,
      zip_sha256: sha256Buffer(fs.readFileSync(bundlePath)),
      profile: parsed.manifest.profile,
      source_repo: options.subgraph.source_repo ?? parsed.manifest.source.repo,
      source_git_head: parsed.manifest.source.git_head,
      generated_at: new Date().toISOString(),
      mdkg_version: readPackageVersion(),
    };
    fs.writeFileSync(path.join(tempDir, ".mdkg-materialized.json"), `${JSON.stringify(marker, null, 2)}\n`, "utf8");
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(path.dirname(outputDir), { recursive: true });
    fs.renameSync(tempDir, outputDir);
    return {
      alias: options.alias,
      ok: true,
      output_path: relativeToRoot(options.root, outputDir),
      bundle_path: source.path,
      bundle_hash: parsed.manifest.bundle_hash,
      profile: parsed.manifest.profile,
      warnings,
      errors,
    };
  } catch (err) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    errors.push(err instanceof Error ? err.message : String(err));
    return { alias: options.alias, ok: false, output_path: relativeToRoot(options.root, outputDir), warnings, errors };
  }
}

export function runSubgraphMaterializeCommand(options: SubgraphMaterializeOptions): void {
  withSubgraphLock(options.root, () => {
    const config = loadConfig(options.root);
    const aliases = selectAliases(config, options.alias, options.all);
    const targetRoot = path.resolve(options.root, normalizeContained(options.target, "--target"));
    const results = aliases.map((alias) =>
      materializeOneAlias({
        root: options.root,
        alias,
        subgraph: config.subgraphs[alias],
        targetRoot,
        clean: Boolean(options.clean),
      })
    );
    if (options.gitignore) {
      fs.mkdirSync(targetRoot, { recursive: true });
      writeMaterializeGitignore(targetRoot);
    }
    const ok = results.every((item) => item.ok === true);
    const receipt = {
      action: "materialized",
      ok,
      count: results.length,
      target: relativeToRoot(options.root, targetRoot),
      results,
      errors: results.flatMap((item) => (item.errors as string[] | undefined ?? []).map((error) => `${item.alias}: ${error}`)),
      warnings: results.flatMap((item) => (item.warnings as string[] | undefined ?? []).map((warning) => `${item.alias}: ${warning}`)),
    };
    if (options.json) {
      writeJson(receipt);
    } else {
      console.log(`subgraphs materialized: ${results.length}`);
      for (const item of results) {
        console.log(`${item.alias} | ${item.ok ? "ok" : "error"} | ${item.output_path}`);
      }
    }
    if (!ok) {
      throw new ValidationError("subgraph materialize failed");
    }
  });
}
