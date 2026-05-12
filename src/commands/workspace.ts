import fs from "fs";
import path from "path";
import { loadConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import {
  isRootWorkspacePath,
  normalizeContainedWorkspacePath,
  workspaceDocumentRootKey,
} from "../core/workspace_path";
import { NotFoundError, UsageError } from "../util/errors";

export type WorkspaceListCommandOptions = {
  root: string;
  json?: boolean;
};

export type WorkspaceAddCommandOptions = {
  root: string;
  alias: string;
  workspacePath: string;
  mdkgDir?: string;
  json?: boolean;
};

export type WorkspaceRemoveCommandOptions = {
  root: string;
  alias: string;
  json?: boolean;
};

export type WorkspaceToggleCommandOptions = {
  root: string;
  alias: string;
  json?: boolean;
};

const ALIAS_RE = /^[a-z][a-z0-9_]*$/;

type WorkspaceReceipt = {
  alias: string;
  path: string;
  enabled: boolean;
  mdkg_dir: string;
};

function workspaceReceipt(alias: string, workspace: Record<string, unknown>): WorkspaceReceipt {
  return {
    alias,
    path: workspace.path as string,
    enabled: workspace.enabled as boolean,
    mdkg_dir: workspace.mdkg_dir as string,
  };
}

function printWorkspaceMutationReceipt(
  action: string,
  workspace: WorkspaceReceipt,
  json?: boolean
): void {
  if (json) {
    console.log(JSON.stringify({ action, workspace }, null, 2));
    return;
  }

  if (action === "added") {
    console.log(`workspace added: ${workspace.alias} (${workspace.path})`);
    return;
  }

  console.log(`workspace ${action}: ${workspace.alias}`);
}

function readRawConfig(root: string): { path: string; raw: Record<string, unknown> } {
  const configPath = path.join(root, ".mdkg", "config.json");
  if (!fs.existsSync(configPath)) {
    throw new NotFoundError(`config not found at ${configPath}`);
  }
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new UsageError(`failed to read config: ${message}`);
  }
  if (typeof raw !== "object" || raw === null) {
    throw new UsageError("config must be a JSON object");
  }
  const migrated = migrateConfig(raw).config;
  validateConfigSchema(migrated);
  if (typeof migrated !== "object" || migrated === null || Array.isArray(migrated)) {
    throw new UsageError("config must be a JSON object");
  }
  return { path: configPath, raw: migrated as Record<string, unknown> };
}

function writeRawConfig(configPath: string, raw: Record<string, unknown>): void {
  fs.writeFileSync(configPath, JSON.stringify(raw, null, 2), "utf8");
}

function normalizeAlias(alias: string): string {
  if (alias.toLowerCase() === "all") {
    throw new UsageError("workspace alias cannot be 'all'");
  }
  if (alias !== alias.toLowerCase() || !ALIAS_RE.test(alias)) {
    throw new UsageError("workspace alias must be lowercase and use [a-z0-9_]");
  }
  return alias;
}

function normalizeCommandWorkspacePath(value: string, label: string): string {
  try {
    return normalizeContainedWorkspacePath(value, label);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new UsageError(message);
  }
}

export function runWorkspaceListCommand(options: WorkspaceListCommandOptions): void {
  const config = loadConfig(options.root);
  const aliases = Object.keys(config.workspaces).sort();
  if (options.json) {
    console.log(
      JSON.stringify(
        {
          workspaces: aliases.map((alias) => {
            const ws = config.workspaces[alias];
            return {
              alias,
              path: ws.path,
              enabled: ws.enabled,
              mdkg_dir: ws.mdkg_dir,
            };
          }),
        },
        null,
        2
      )
    );
    return;
  }

  if (aliases.length === 0) {
    console.log("no workspaces registered");
    return;
  }
  for (const alias of aliases) {
    const ws = config.workspaces[alias];
    const status = ws.enabled ? "enabled" : "disabled";
    console.log(`${alias} | ${status} | ${ws.path} | ${ws.mdkg_dir}`);
  }
}

export function runWorkspaceAddCommand(options: WorkspaceAddCommandOptions): void {
  const alias = normalizeAlias(options.alias);
  const workspacePath = normalizeCommandWorkspacePath(options.workspacePath, "workspace path");
  const mdkgDir = normalizeCommandWorkspacePath(options.mdkgDir ?? ".mdkg", "workspace mdkg dir");
  if (isRootWorkspacePath(workspacePath)) {
    throw new UsageError('workspace path must not be "." for non-root workspaces');
  }

  const { path: configPath, raw } = readRawConfig(options.root);
  const workspacesRaw = raw.workspaces;
  if (typeof workspacesRaw !== "object" || workspacesRaw === null) {
    throw new UsageError("config.workspaces must be an object");
  }
  const workspaces = workspacesRaw as Record<string, unknown>;
  if (workspaces[alias]) {
    throw new UsageError(`workspace already exists: ${alias}`);
  }
  const docRootKey = workspaceDocumentRootKey(workspacePath, mdkgDir);
  for (const [existingAlias, entry] of Object.entries(workspaces)) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      continue;
    }
    const existing = entry as Record<string, unknown>;
    if (
      typeof existing.path === "string" &&
      typeof existing.mdkg_dir === "string" &&
      workspaceDocumentRootKey(existing.path, existing.mdkg_dir) === docRootKey
    ) {
      throw new UsageError(`workspace document root already registered by ${existingAlias}`);
    }
  }

  const workspace = { path: workspacePath, enabled: true, mdkg_dir: mdkgDir };
  workspaces[alias] = workspace;
  raw.workspaces = workspaces;
  writeRawConfig(configPath, raw);

  const wsRoot = path.resolve(options.root, workspacePath, mdkgDir);
  fs.mkdirSync(path.join(wsRoot, "core"), { recursive: true });
  fs.mkdirSync(path.join(wsRoot, "design"), { recursive: true });
  fs.mkdirSync(path.join(wsRoot, "work"), { recursive: true });

  printWorkspaceMutationReceipt(
    "added",
    workspaceReceipt(alias, workspace),
    options.json
  );
}

export function runWorkspaceRemoveCommand(options: WorkspaceRemoveCommandOptions): void {
  const alias = normalizeAlias(options.alias);
  if (alias === "root") {
    throw new UsageError("cannot remove root workspace");
  }

  const { path: configPath, raw } = readRawConfig(options.root);
  const workspacesRaw = raw.workspaces;
  if (typeof workspacesRaw !== "object" || workspacesRaw === null) {
    throw new UsageError("config.workspaces must be an object");
  }
  const workspaces = workspacesRaw as Record<string, unknown>;
  const workspace = workspaces[alias];
  if (!workspace || typeof workspace !== "object" || Array.isArray(workspace)) {
    throw new NotFoundError(`workspace not found: ${alias}`);
  }
  const removed = workspaceReceipt(alias, workspace as Record<string, unknown>);
  delete workspaces[alias];
  raw.workspaces = workspaces;
  writeRawConfig(configPath, raw);

  printWorkspaceMutationReceipt("removed", removed, options.json);
}

function setWorkspaceEnabled(
  options: WorkspaceToggleCommandOptions,
  enabled: boolean
): void {
  const alias = normalizeAlias(options.alias);
  if (alias === "root" && !enabled) {
    throw new UsageError("cannot disable root workspace");
  }

  const { path: configPath, raw } = readRawConfig(options.root);
  const workspacesRaw = raw.workspaces;
  if (typeof workspacesRaw !== "object" || workspacesRaw === null) {
    throw new UsageError("config.workspaces must be an object");
  }
  const workspaces = workspacesRaw as Record<string, unknown>;
  const workspace = workspaces[alias];
  if (!workspace || typeof workspace !== "object" || Array.isArray(workspace)) {
    throw new NotFoundError(`workspace not found: ${alias}`);
  }

  const updated = { ...(workspace as Record<string, unknown>), enabled };
  workspaces[alias] = updated;
  raw.workspaces = workspaces;
  writeRawConfig(configPath, raw);

  printWorkspaceMutationReceipt(
    enabled ? "enabled" : "disabled",
    workspaceReceipt(alias, updated),
    options.json
  );
}

export function runWorkspaceEnableCommand(options: WorkspaceToggleCommandOptions): void {
  setWorkspaceEnabled(options, true);
}

export function runWorkspaceDisableCommand(options: WorkspaceToggleCommandOptions): void {
  setWorkspaceEnabled(options, false);
}
