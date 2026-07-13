import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { withContainedPathSink } from "../core/filesystem_authority";
import { workspaceDocumentRelativePath } from "../core/workspace_path";

export type WorkspaceDocRoot = {
  alias: string;
  root: string;
};

const DOC_FOLDERS = ["core", "design", "work"];

type DiscoveryBudget = {
  files: number;
  bytes: number;
  limits: Config["index"]["limits"];
};

function accountMarkdownFile(filePath: string, budget: DiscoveryBudget): void {
  const size = fs.statSync(filePath).size;
  if (size > budget.limits.max_file_bytes) {
    throw new Error(`graph file exceeds index.limits.max_file_bytes (${budget.limits.max_file_bytes}): ${filePath}`);
  }
  if (budget.files + 1 > budget.limits.max_files) {
    throw new Error(`graph file count exceeds index.limits.max_files (${budget.limits.max_files})`);
  }
  if (budget.bytes + size > budget.limits.max_total_bytes) {
    throw new Error(`graph bytes exceed index.limits.max_total_bytes (${budget.limits.max_total_bytes})`);
  }
  budget.files += 1;
  budget.bytes += size;
}

function listMarkdownFiles(dir: string, budget: DiscoveryBudget, depth = 0): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  if (depth > budget.limits.max_depth) {
    throw new Error(`graph directory depth exceeds index.limits.max_depth (${budget.limits.max_depth}): ${dir}`);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath, budget, depth + 1));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      accountMarkdownFile(fullPath, budget);
      files.push(fullPath);
    }
  }
  return files;
}

function listArchiveSidecarFiles(dir: string, budget: DiscoveryBudget, depth = 0): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  if (depth > budget.limits.max_depth) {
    throw new Error(`graph directory depth exceeds index.limits.max_depth (${budget.limits.max_depth}): ${dir}`);
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "source") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listArchiveSidecarFiles(fullPath, budget, depth + 1));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      accountMarkdownFile(fullPath, budget);
      files.push(fullPath);
    }
  }
  return files;
}

export function getWorkspaceDocRoots(root: string, config: Config): WorkspaceDocRoot[] {
  const roots: WorkspaceDocRoot[] = [];
  const aliases = Object.keys(config.workspaces).sort();
  for (const alias of aliases) {
    const entry = config.workspaces[alias];
    if (!entry.enabled) {
      continue;
    }
    const wsRoot = withContainedPathSink(
      {
        root,
        relativePath: workspaceDocumentRelativePath(entry.path, entry.mdkg_dir),
        operation: "read",
      },
      ({ absolutePath }) => absolutePath
    );
    roots.push({ alias, root: wsRoot });
  }
  return roots;
}

export function listWorkspaceDocFiles(root: string, config: Config): string[] {
  const files: string[] = [];
  const budget: DiscoveryBudget = { files: 0, bytes: 0, limits: config.index.limits };
  for (const { root: wsRoot } of getWorkspaceDocRoots(root, config)) {
    for (const folder of DOC_FOLDERS) {
      const folderPath = path.join(wsRoot, folder);
      files.push(...listMarkdownFiles(folderPath, budget));
    }
    files.push(...listArchiveSidecarFiles(path.join(wsRoot, "archive"), budget));
  }
  return files;
}

export function listWorkspaceDocFilesByAlias(
  root: string,
  config: Config
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const budget: DiscoveryBudget = { files: 0, bytes: 0, limits: config.index.limits };
  for (const { alias, root: wsRoot } of getWorkspaceDocRoots(root, config)) {
    const files: string[] = [];
    for (const folder of DOC_FOLDERS) {
      const folderPath = path.join(wsRoot, folder);
      files.push(...listMarkdownFiles(folderPath, budget));
    }
    files.push(...listArchiveSidecarFiles(path.join(wsRoot, "archive"), budget));
    files.sort();
    result[alias] = files;
  }
  return result;
}
