import fs from "fs";
import { configPath } from "./paths";
import { migrateConfig } from "./migrate";
import {
  isRootWorkspacePath,
  normalizeContainedWorkspacePath,
  workspaceDocumentRootKey,
} from "./workspace_path";

export type WorkspaceConfig = {
  path: string;
  enabled: boolean;
  mdkg_dir: string;
  visibility: "private" | "internal" | "public";
};

export type SubgraphSourceConfig = {
  path: string;
  enabled: boolean;
  expected_profile: "private" | "public";
  label?: string;
};

export type SubgraphConfig = {
  enabled: boolean;
  visibility: "private" | "internal" | "public";
  permissions: string[];
  max_stale_seconds: number;
  source_path?: string;
  source_repo?: string;
  sources: SubgraphSourceConfig[];
};

export type Config = {
  schema_version: number;
  tool: string;
  root_required: boolean;
  archive: {
    large_cache_warning_bytes: number;
  };
  index: {
    auto_reindex: boolean;
    tolerant: boolean;
    backend: "json" | "sqlite";
    global_index_path: string;
    sqlite_path: string;
    sqlite_commit_warning_bytes: number;
    lock_timeout_ms: number;
  };
  capabilities: {
    cache_path: string;
  };
  bundles: {
    output_dir: string;
    default_profile: "private" | "public";
  };
  subgraphs: Record<string, SubgraphConfig>;
  pack: {
    default_depth: number;
    default_edges: string[];
    verbose_core_list_path: string;
    limits: {
      max_nodes: number;
      max_bytes: number;
    };
  };
  templates: {
    root_path: string;
    default_set: string;
    workspace_overrides_enabled: boolean;
  };
  work: {
    status_enum: string[];
    priority_min: number;
    priority_max: number;
    next: {
      strategy: string;
      status_preference: string[];
    };
  };
  workspaces: Record<string, WorkspaceConfig>;
};

type ValidationErrors = string[];

type JsonObject = Record<string, unknown>;

const WORKSPACE_ALIAS_RE = /^[a-z][a-z0-9_]*$/;
const PACK_EDGE_KEYS = new Set([
  "parent",
  "epic",
  "relates",
  "blocked_by",
  "blocks",
  "prev",
  "next",
]);
const NEXT_WORK_STRATEGIES = new Set(["chain_then_priority"]);
const WORKSPACE_VISIBILITY_VALUES = new Set(["private", "internal", "public"]);
const BUNDLE_PROFILE_VALUES = new Set(["private", "public"]);
const INDEX_BACKEND_VALUES = new Set(["json", "sqlite"]);
const SUBGRAPH_PERMISSION_VALUES = new Set(["read", "request", "propose", "mutate"]);
const DEFAULT_ARCHIVE_LARGE_CACHE_WARNING_BYTES = 26214400;
const DEFAULT_SQLITE_COMMIT_WARNING_BYTES = 52428800;
const DEFAULT_LOCK_TIMEOUT_MS = 10000;
const DEFAULT_SUBGRAPH_MAX_STALE_SECONDS = 3600;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, path: string, errors: ValidationErrors): string | undefined {
  if (typeof value !== "string") {
    errors.push(`${path} must be a string`);
    return undefined;
  }
  return value;
}

function requireStringInSet(
  value: unknown,
  path: string,
  allowed: Set<string>,
  errors: ValidationErrors
): string | undefined {
  const raw = requireString(value, path, errors);
  if (raw === undefined) {
    return undefined;
  }
  if (!allowed.has(raw)) {
    errors.push(`${path} must be one of ${Array.from(allowed).join(", ")}`);
    return undefined;
  }
  return raw;
}

function requireBoolean(value: unknown, path: string, errors: ValidationErrors): boolean | undefined {
  if (typeof value !== "boolean") {
    errors.push(`${path} must be a boolean`);
    return undefined;
  }
  return value;
}

function requireNumber(value: unknown, path: string, errors: ValidationErrors): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) {
    errors.push(`${path} must be a number`);
    return undefined;
  }
  return value;
}

function requireInteger(value: unknown, path: string, errors: ValidationErrors): number | undefined {
  const number = requireNumber(value, path, errors);
  if (number === undefined) {
    return undefined;
  }
  if (!Number.isInteger(number)) {
    errors.push(`${path} must be an integer`);
    return undefined;
  }
  return number;
}

function requireNonNegativeInteger(
  value: unknown,
  path: string,
  errors: ValidationErrors
): number | undefined {
  const integer = requireInteger(value, path, errors);
  if (integer === undefined) {
    return undefined;
  }
  if (integer < 0) {
    errors.push(`${path} must be a non-negative integer`);
    return undefined;
  }
  return integer;
}

function requirePositiveInteger(
  value: unknown,
  path: string,
  errors: ValidationErrors
): number | undefined {
  const integer = requireInteger(value, path, errors);
  if (integer === undefined) {
    return undefined;
  }
  if (integer <= 0) {
    errors.push(`${path} must be a positive integer`);
    return undefined;
  }
  return integer;
}

function requireStringArray(
  value: unknown,
  path: string,
  errors: ValidationErrors
): string[] | undefined {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array of strings`);
    return undefined;
  }
  const items: string[] = [];
  for (let i = 0; i < value.length; i += 1) {
    if (typeof value[i] !== "string") {
      errors.push(`${path}[${i}] must be a string`);
      continue;
    }
    items.push(value[i]);
  }
  return items;
}

function requireLowercaseUniqueStringArray(
  value: unknown,
  path: string,
  errors: ValidationErrors,
  allowEmpty = false
): string[] | undefined {
  const items = requireStringArray(value, path, errors);
  if (items === undefined) {
    return undefined;
  }
  if (items.length === 0) {
    if (!allowEmpty) {
      errors.push(`${path} must not be empty`);
    }
    return items;
  }

  const seen = new Set<string>();
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.trim().length === 0) {
      errors.push(`${path}[${i}] must not be empty`);
      continue;
    }
    if (item !== item.trim()) {
      errors.push(`${path}[${i}] must not include surrounding whitespace`);
    }
    if (item !== item.toLowerCase()) {
      errors.push(`${path}[${i}] must be lowercase`);
    }
    if (seen.has(item)) {
      errors.push(`${path} must not contain duplicate value "${item}"`);
      continue;
    }
    seen.add(item);
  }
  return items;
}

function requireKnownLowercaseUniqueStringArray(
  value: unknown,
  path: string,
  allowed: Set<string>,
  errors: ValidationErrors,
  allowEmpty = false
): string[] | undefined {
  const items = requireLowercaseUniqueStringArray(value, path, errors, allowEmpty);
  if (items === undefined) {
    return undefined;
  }
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].trim().length === 0) {
      continue;
    }
    if (!allowed.has(items[i])) {
      errors.push(`${path}[${i}] must be one of ${Array.from(allowed).join(", ")}`);
    }
  }
  return items;
}

function requireObject(value: unknown, path: string, errors: ValidationErrors): JsonObject | undefined {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return undefined;
  }
  return value;
}

function validateWorkspaceAlias(alias: string, errors: ValidationErrors): void {
  if (alias === "all") {
    errors.push("workspaces.all alias is reserved");
    return;
  }
  if (alias !== alias.toLowerCase() || !WORKSPACE_ALIAS_RE.test(alias)) {
    errors.push(`workspaces.${alias} alias must be lowercase and use [a-z0-9_]`);
  }
}

function validateSubgraphAlias(
  alias: string,
  workspaces: Record<string, WorkspaceConfig>,
  errors: ValidationErrors
): void {
  if (alias === "all") {
    errors.push("subgraphs.all alias is reserved");
    return;
  }
  if (alias !== alias.toLowerCase() || !WORKSPACE_ALIAS_RE.test(alias)) {
    errors.push(`subgraphs.${alias} alias must be lowercase and use [a-z0-9_]`);
  }
  if (workspaces[alias]) {
    errors.push(`subgraphs.${alias} must not collide with workspaces.${alias}`);
  }
}

function requireContainedPath(
  value: unknown,
  path: string,
  errors: ValidationErrors
): string | undefined {
  const raw = requireString(value, path, errors);
  if (!raw) {
    return undefined;
  }
  try {
    return normalizeContainedWorkspacePath(raw, path);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    errors.push(message);
    return undefined;
  }
}

export function validateConfigSchema(raw: unknown): Config {
  const errors: ValidationErrors = [];
  if (!isObject(raw)) {
    throw new Error("config must be a JSON object");
  }

  const schema_version = requireNumber(raw.schema_version, "schema_version", errors);
  const tool = requireString(raw.tool, "tool", errors);
  const root_required = requireBoolean(raw.root_required, "root_required", errors);

  const archiveRaw =
    raw.archive === undefined
      ? { large_cache_warning_bytes: DEFAULT_ARCHIVE_LARGE_CACHE_WARNING_BYTES }
      : requireObject(raw.archive, "archive", errors);
  const indexRaw = requireObject(raw.index, "index", errors);
  const capabilitiesRaw =
    raw.capabilities === undefined
      ? { cache_path: ".mdkg/index/capabilities.json" }
      : requireObject(raw.capabilities, "capabilities", errors);
  const bundlesRaw =
    raw.bundles === undefined
      ? { output_dir: ".mdkg/bundles", default_profile: "private" }
      : requireObject(raw.bundles, "bundles", errors);
  if (raw.bundle_imports !== undefined && raw.subgraphs !== undefined) {
    errors.push("config must not define both subgraphs and legacy bundle_imports");
  }
  const subgraphsFromLegacyBundleImports =
    raw.subgraphs === undefined && raw.bundle_imports !== undefined;
  const subgraphsRaw =
    raw.subgraphs === undefined
      ? raw.bundle_imports === undefined
        ? {}
        : requireObject(raw.bundle_imports, "bundle_imports", errors)
      : requireObject(raw.subgraphs, "subgraphs", errors);
  const packRaw = requireObject(raw.pack, "pack", errors);
  const templatesRaw = requireObject(raw.templates, "templates", errors);
  const workRaw = requireObject(raw.work, "work", errors);
  const workspacesRaw = requireObject(raw.workspaces, "workspaces", errors);

  const archive = archiveRaw
    ? {
        large_cache_warning_bytes:
          archiveRaw.large_cache_warning_bytes === undefined
            ? DEFAULT_ARCHIVE_LARGE_CACHE_WARNING_BYTES
            : requireNonNegativeInteger(
                archiveRaw.large_cache_warning_bytes,
                "archive.large_cache_warning_bytes",
                errors
              ),
      }
    : undefined;

  const index = indexRaw
    ? {
        auto_reindex: requireBoolean(indexRaw.auto_reindex, "index.auto_reindex", errors),
        tolerant: requireBoolean(indexRaw.tolerant, "index.tolerant", errors),
        backend:
          indexRaw.backend === undefined
            ? "json"
            : requireStringInSet(indexRaw.backend, "index.backend", INDEX_BACKEND_VALUES, errors),
        global_index_path: requireContainedPath(
          indexRaw.global_index_path,
          "index.global_index_path",
          errors
        ),
        sqlite_path:
          indexRaw.sqlite_path === undefined
            ? ".mdkg/index/mdkg.sqlite"
            : requireContainedPath(indexRaw.sqlite_path, "index.sqlite_path", errors),
        sqlite_commit_warning_bytes:
          indexRaw.sqlite_commit_warning_bytes === undefined
            ? DEFAULT_SQLITE_COMMIT_WARNING_BYTES
            : requireNonNegativeInteger(
                indexRaw.sqlite_commit_warning_bytes,
                "index.sqlite_commit_warning_bytes",
                errors
              ),
        lock_timeout_ms:
          indexRaw.lock_timeout_ms === undefined
            ? DEFAULT_LOCK_TIMEOUT_MS
            : requirePositiveInteger(indexRaw.lock_timeout_ms, "index.lock_timeout_ms", errors),
      }
    : undefined;

  const capabilities = capabilitiesRaw
    ? {
        cache_path: requireContainedPath(
          capabilitiesRaw.cache_path,
          "capabilities.cache_path",
          errors
        ),
      }
    : undefined;

  const bundles = bundlesRaw
    ? {
        output_dir: requireContainedPath(bundlesRaw.output_dir, "bundles.output_dir", errors),
        default_profile: requireStringInSet(
          bundlesRaw.default_profile,
          "bundles.default_profile",
          BUNDLE_PROFILE_VALUES,
          errors
        ),
      }
    : undefined;

  const packLimitsRaw = packRaw ? requireObject(packRaw.limits, "pack.limits", errors) : undefined;
  const pack = packRaw
    ? {
        default_depth: requireNonNegativeInteger(
          packRaw.default_depth,
          "pack.default_depth",
          errors
        ),
        default_edges: requireKnownLowercaseUniqueStringArray(
          packRaw.default_edges,
          "pack.default_edges",
          PACK_EDGE_KEYS,
          errors,
          true
        ),
        verbose_core_list_path: requireContainedPath(
          packRaw.verbose_core_list_path,
          "pack.verbose_core_list_path",
          errors
        ),
        limits: packLimitsRaw
          ? {
              max_nodes: requirePositiveInteger(
                packLimitsRaw.max_nodes,
                "pack.limits.max_nodes",
                errors
              ),
              max_bytes: requirePositiveInteger(
                packLimitsRaw.max_bytes,
                "pack.limits.max_bytes",
                errors
              ),
            }
          : undefined,
      }
    : undefined;

  const templates = templatesRaw
    ? {
        root_path: requireContainedPath(templatesRaw.root_path, "templates.root_path", errors),
        default_set: requireString(templatesRaw.default_set, "templates.default_set", errors),
        workspace_overrides_enabled: requireBoolean(
          templatesRaw.workspace_overrides_enabled,
          "templates.workspace_overrides_enabled",
          errors
        ),
      }
    : undefined;

  const workNextRaw = workRaw ? requireObject(workRaw.next, "work.next", errors) : undefined;
  const work = workRaw
    ? (() => {
        const statusEnum = requireLowercaseUniqueStringArray(
          workRaw.status_enum,
          "work.status_enum",
          errors
        );
        const priorityMin = requireInteger(workRaw.priority_min, "work.priority_min", errors);
        const priorityMax = requireInteger(workRaw.priority_max, "work.priority_max", errors);
        if (
          priorityMin !== undefined &&
          priorityMax !== undefined &&
          priorityMin > priorityMax
        ) {
          errors.push("work.priority_min must be less than or equal to work.priority_max");
        }

        const statusPreference = workNextRaw
          ? requireLowercaseUniqueStringArray(
              workNextRaw.status_preference,
              "work.next.status_preference",
              errors
            )
          : undefined;
        if (statusEnum !== undefined && statusPreference !== undefined) {
          const allowedStatuses = new Set(statusEnum);
          for (let i = 0; i < statusPreference.length; i += 1) {
            if (!allowedStatuses.has(statusPreference[i])) {
              errors.push(`work.next.status_preference[${i}] must be listed in work.status_enum`);
            }
          }
        }

        return {
          status_enum: statusEnum,
          priority_min: priorityMin,
          priority_max: priorityMax,
          next: workNextRaw
            ? {
                strategy: requireStringInSet(
                  workNextRaw.strategy,
                  "work.next.strategy",
                  NEXT_WORK_STRATEGIES,
                  errors
                ),
                status_preference: statusPreference,
              }
            : undefined,
        };
      })()
    : undefined;

  const workspaces: Record<string, WorkspaceConfig> = {};
  const workspaceDocRootOwners = new Map<string, string>();
  if (workspacesRaw) {
    for (const [alias, entry] of Object.entries(workspacesRaw)) {
      validateWorkspaceAlias(alias, errors);
      const ws = requireObject(entry, `workspaces.${alias}`, errors);
      if (!ws) {
        continue;
      }
      const wsPath = requireString(ws.path, `workspaces.${alias}.path`, errors);
      const wsEnabled = requireBoolean(ws.enabled, `workspaces.${alias}.enabled`, errors);
      const wsMdkgDir = requireString(ws.mdkg_dir, `workspaces.${alias}.mdkg_dir`, errors);
      const wsVisibility =
        ws.visibility === undefined
          ? "private"
          : requireStringInSet(
              ws.visibility,
              `workspaces.${alias}.visibility`,
              WORKSPACE_VISIBILITY_VALUES,
              errors
            );

      if (wsPath && wsEnabled !== undefined && wsMdkgDir && wsVisibility) {
        let normalizedPath: string | undefined;
        let normalizedMdkgDir: string | undefined;
        try {
          normalizedPath = normalizeContainedWorkspacePath(wsPath, `workspaces.${alias}.path`);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push(message);
        }
        try {
          normalizedMdkgDir = normalizeContainedWorkspacePath(
            wsMdkgDir,
            `workspaces.${alias}.mdkg_dir`
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push(message);
        }
        if (!normalizedPath || !normalizedMdkgDir) {
          continue;
        }
        if (alias !== "root" && isRootWorkspacePath(normalizedPath)) {
          errors.push(`workspaces.${alias}.path must not be "." for non-root workspaces`);
          continue;
        }
        const docRootKey = workspaceDocumentRootKey(normalizedPath, normalizedMdkgDir);
        const existingAlias = workspaceDocRootOwners.get(docRootKey);
        if (existingAlias) {
          errors.push(`workspaces.${alias} document root duplicates workspaces.${existingAlias}`);
          continue;
        }
        workspaceDocRootOwners.set(docRootKey, alias);
        workspaces[alias] = {
          path: normalizedPath,
          enabled: wsEnabled,
          mdkg_dir: normalizedMdkgDir,
          visibility: wsVisibility as WorkspaceConfig["visibility"],
        };
      }
    }
  }

  const rootWorkspace = workspaces.root;
  if (root_required !== undefined && root_required !== true) {
    errors.push("root_required must be true");
  }
  if (!rootWorkspace) {
    errors.push("workspaces.root is required");
  } else {
    if (rootWorkspace.path !== ".") {
      errors.push('workspaces.root.path must be "."');
    }
    if (rootWorkspace.enabled !== true) {
      errors.push("workspaces.root.enabled must be true");
    }
    if (rootWorkspace.mdkg_dir !== ".mdkg") {
      errors.push('workspaces.root.mdkg_dir must be ".mdkg"');
    }
  }

  const subgraphs: Record<string, SubgraphConfig> = {};
  if (subgraphsRaw) {
    for (const [alias, entry] of Object.entries(subgraphsRaw)) {
      validateSubgraphAlias(alias, workspaces, errors);
      const basePath = subgraphsFromLegacyBundleImports ? `bundle_imports.${alias}` : `subgraphs.${alias}`;
      const rawSubgraph = requireObject(entry, basePath, errors);
      if (!rawSubgraph) {
        continue;
      }
      const enabled =
        rawSubgraph.enabled === undefined
          ? true
          : requireBoolean(rawSubgraph.enabled, `${basePath}.enabled`, errors);
      const visibility =
        rawSubgraph.visibility === undefined
          ? "private"
          : requireStringInSet(
              rawSubgraph.visibility,
              `${basePath}.visibility`,
              WORKSPACE_VISIBILITY_VALUES,
              errors
            );
      const permissions =
        rawSubgraph.permissions === undefined || subgraphsFromLegacyBundleImports
          ? ["read"]
          : requireKnownLowercaseUniqueStringArray(
              rawSubgraph.permissions,
              `${basePath}.permissions`,
              SUBGRAPH_PERMISSION_VALUES,
              errors
            );
      const maxStaleSeconds =
        rawSubgraph.max_stale_seconds === undefined
          ? DEFAULT_SUBGRAPH_MAX_STALE_SECONDS
          : requirePositiveInteger(rawSubgraph.max_stale_seconds, `${basePath}.max_stale_seconds`, errors);
      const sourcePath =
        rawSubgraph.source_path === undefined
          ? undefined
          : requireContainedPath(rawSubgraph.source_path, `${basePath}.source_path`, errors);
      const sourceRepo =
        rawSubgraph.source_repo === undefined
          ? undefined
          : requireString(rawSubgraph.source_repo, `${basePath}.source_repo`, errors);
      const rawSources = subgraphsFromLegacyBundleImports
        ? [{ path: rawSubgraph.path, enabled: true, expected_profile: rawSubgraph.expected_profile }]
        : rawSubgraph.sources;
      if (!Array.isArray(rawSources)) {
        errors.push(`${basePath}.sources must be an array`);
        continue;
      }
      if (rawSources.length === 0) {
        errors.push(`${basePath}.sources must not be empty`);
        continue;
      }
      const sources: SubgraphSourceConfig[] = [];
      const labels = new Set<string>();
      for (let i = 0; i < rawSources.length; i += 1) {
        const sourceBasePath = `${basePath}.sources[${i}]`;
        const rawSource = requireObject(rawSources[i], sourceBasePath, errors);
        if (!rawSource) {
          continue;
        }
        const sourceBundlePath = requireContainedPath(rawSource.path, `${sourceBasePath}.path`, errors);
        const sourceEnabled =
          rawSource.enabled === undefined
            ? true
            : requireBoolean(rawSource.enabled, `${sourceBasePath}.enabled`, errors);
        const expectedProfile =
          rawSource.expected_profile === undefined
            ? "private"
            : requireStringInSet(
                rawSource.expected_profile,
                `${sourceBasePath}.expected_profile`,
                BUNDLE_PROFILE_VALUES,
                errors
              );
        const label =
          rawSource.label === undefined
            ? undefined
            : requireString(rawSource.label, `${sourceBasePath}.label`, errors);
        if (label !== undefined) {
          if (label.trim().length === 0) {
            errors.push(`${sourceBasePath}.label must not be empty`);
          }
          if (labels.has(label)) {
            errors.push(`${basePath}.sources label must be unique: ${label}`);
          }
          labels.add(label);
        }
        if (
          visibility !== undefined &&
          expectedProfile !== undefined &&
          sourceEnabled !== false &&
          visibility !== "private" &&
          expectedProfile !== "public"
        ) {
          errors.push(
            `${sourceBasePath}.expected_profile must be public when ${basePath}.visibility is ${visibility}`
          );
        }
        if (sourceBundlePath && sourceEnabled !== undefined && expectedProfile) {
          sources.push({
            path: sourceBundlePath,
            enabled: sourceEnabled,
            expected_profile: expectedProfile as SubgraphSourceConfig["expected_profile"],
            ...(label ? { label } : {}),
          });
        }
      }

      if (enabled !== undefined && visibility && permissions && maxStaleSeconds !== undefined && sources.length > 0) {
        subgraphs[alias] = {
          enabled,
          visibility: visibility as SubgraphConfig["visibility"],
          permissions,
          max_stale_seconds: maxStaleSeconds,
          ...(sourcePath ? { source_path: sourcePath } : {}),
          ...(sourceRepo ? { source_repo: sourceRepo } : {}),
          sources,
        };
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`config validation failed:\n${errors.join("\n")}`);
  }

  return {
    schema_version: schema_version as number,
    tool: tool as string,
    root_required: root_required as boolean,
    archive: archive as Config["archive"],
    index: index as Config["index"],
    capabilities: capabilities as Config["capabilities"],
    bundles: bundles as Config["bundles"],
    subgraphs,
    pack: pack as Config["pack"],
    templates: templates as Config["templates"],
    work: work as Config["work"],
    workspaces,
  };
}

export function loadConfig(root: string): Config {
  const path = configPath(root);
  if (!fs.existsSync(path)) {
    throw new Error(`config not found at ${path}`);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`failed to read config: ${message}`);
  }

  const migrated = migrateConfig(raw);
  return validateConfigSchema(migrated.config);
}
