import fs from "fs";
import { configPath } from "./paths";
import { migrateConfig } from "./migrate";

export type WorkspaceConfig = {
  path: string;
  enabled: boolean;
  mdkg_dir: string;
};

export type Config = {
  schema_version: number;
  tool: string;
  root_required: boolean;
  index: {
    auto_reindex: boolean;
    tolerant: boolean;
    global_index_path: string;
  };
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

function requireObject(value: unknown, path: string, errors: ValidationErrors): JsonObject | undefined {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return undefined;
  }
  return value;
}

function validateConfigSchema(raw: unknown): Config {
  const errors: ValidationErrors = [];
  if (!isObject(raw)) {
    throw new Error("config must be a JSON object");
  }

  const schema_version = requireNumber(raw.schema_version, "schema_version", errors);
  const tool = requireString(raw.tool, "tool", errors);
  const root_required = requireBoolean(raw.root_required, "root_required", errors);

  const indexRaw = requireObject(raw.index, "index", errors);
  const packRaw = requireObject(raw.pack, "pack", errors);
  const templatesRaw = requireObject(raw.templates, "templates", errors);
  const workRaw = requireObject(raw.work, "work", errors);
  const workspacesRaw = requireObject(raw.workspaces, "workspaces", errors);

  const index = indexRaw
    ? {
        auto_reindex: requireBoolean(indexRaw.auto_reindex, "index.auto_reindex", errors),
        tolerant: requireBoolean(indexRaw.tolerant, "index.tolerant", errors),
        global_index_path: requireString(indexRaw.global_index_path, "index.global_index_path", errors),
      }
    : undefined;

  const packLimitsRaw = packRaw ? requireObject(packRaw.limits, "pack.limits", errors) : undefined;
  const pack = packRaw
    ? {
        default_depth: requireNumber(packRaw.default_depth, "pack.default_depth", errors),
        default_edges: requireStringArray(packRaw.default_edges, "pack.default_edges", errors),
        verbose_core_list_path: requireString(
          packRaw.verbose_core_list_path,
          "pack.verbose_core_list_path",
          errors
        ),
        limits: packLimitsRaw
          ? {
              max_nodes: requireNumber(packLimitsRaw.max_nodes, "pack.limits.max_nodes", errors),
              max_bytes: requireNumber(packLimitsRaw.max_bytes, "pack.limits.max_bytes", errors),
            }
          : undefined,
      }
    : undefined;

  const templates = templatesRaw
    ? {
        root_path: requireString(templatesRaw.root_path, "templates.root_path", errors),
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
    ? {
        status_enum: requireStringArray(workRaw.status_enum, "work.status_enum", errors),
        priority_min: requireNumber(workRaw.priority_min, "work.priority_min", errors),
        priority_max: requireNumber(workRaw.priority_max, "work.priority_max", errors),
        next: workNextRaw
          ? {
              strategy: requireString(workNextRaw.strategy, "work.next.strategy", errors),
              status_preference: requireStringArray(
                workNextRaw.status_preference,
                "work.next.status_preference",
                errors
              ),
            }
          : undefined,
      }
    : undefined;

  const workspaces: Record<string, WorkspaceConfig> = {};
  if (workspacesRaw) {
    for (const [alias, entry] of Object.entries(workspacesRaw)) {
      if (alias !== alias.toLowerCase()) {
        errors.push(`workspaces.${alias} alias must be lowercase`);
      }
      const ws = requireObject(entry, `workspaces.${alias}`, errors);
      if (!ws) {
        continue;
      }
      const wsPath = requireString(ws.path, `workspaces.${alias}.path`, errors);
      const wsEnabled = requireBoolean(ws.enabled, `workspaces.${alias}.enabled`, errors);
      const wsMdkgDir = requireString(ws.mdkg_dir, `workspaces.${alias}.mdkg_dir`, errors);

      if (wsPath && wsEnabled !== undefined && wsMdkgDir) {
        workspaces[alias] = {
          path: wsPath,
          enabled: wsEnabled,
          mdkg_dir: wsMdkgDir,
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
    index: index as Config["index"],
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
