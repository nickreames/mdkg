import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { NotFoundError, UsageError } from "../util/errors";

export type WorkspaceListCommandOptions = {
  root: string;
};

export type WorkspaceAddCommandOptions = {
  root: string;
  alias: string;
  workspacePath: string;
  mdkgDir?: string;
};

export type WorkspaceRemoveCommandOptions = {
  root: string;
  alias: string;
};

const ALIAS_RE = /^[a-z][a-z0-9_]*$/;

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
  return { path: configPath, raw: raw as Record<string, unknown> };
}

function writeRawConfig(configPath: string, raw: Record<string, unknown>): void {
  fs.writeFileSync(configPath, JSON.stringify(raw, null, 2), "utf8");
}

function normalizeAlias(alias: string): string {
  const normalized = alias.toLowerCase();
  if (normalized === "all") {
    throw new UsageError("workspace alias cannot be 'all'");
  }
  if (!ALIAS_RE.test(normalized)) {
    throw new UsageError("workspace alias must be lowercase and use [a-z0-9_]");
  }
  return normalized;
}

export function runWorkspaceListCommand(options: WorkspaceListCommandOptions): void {
  const config = loadConfig(options.root);
  const aliases = Object.keys(config.workspaces).sort();
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
  const workspacePath = options.workspacePath.trim();
  if (!workspacePath) {
    throw new UsageError("workspace path cannot be empty");
  }
  const mdkgDir = options.mdkgDir?.trim() || ".mdkg";

  const { path: configPath, raw } = readRawConfig(options.root);
  const workspacesRaw = raw.workspaces;
  if (typeof workspacesRaw !== "object" || workspacesRaw === null) {
    throw new UsageError("config.workspaces must be an object");
  }
  const workspaces = workspacesRaw as Record<string, unknown>;
  if (workspaces[alias]) {
    throw new UsageError(`workspace already exists: ${alias}`);
  }

  workspaces[alias] = { path: workspacePath, enabled: true, mdkg_dir: mdkgDir };
  raw.workspaces = workspaces;
  writeRawConfig(configPath, raw);

  const wsRoot = path.resolve(options.root, workspacePath, mdkgDir);
  fs.mkdirSync(path.join(wsRoot, "core"), { recursive: true });
  fs.mkdirSync(path.join(wsRoot, "design"), { recursive: true });
  fs.mkdirSync(path.join(wsRoot, "work"), { recursive: true });

  console.log(`workspace added: ${alias} (${workspacePath})`);
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
  if (!workspaces[alias]) {
    throw new NotFoundError(`workspace not found: ${alias}`);
  }
  delete workspaces[alias];
  raw.workspaces = workspaces;
  writeRawConfig(configPath, raw);

  console.log(`workspace removed: ${alias}`);
}
