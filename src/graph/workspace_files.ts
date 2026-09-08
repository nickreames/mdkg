import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { containedPathExists, readContainedDirectory, readContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { absoluteWorkspaceDocumentOwner, assertWorkspaceDocumentRootSpellings } from "./workspace_ownership";

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

function documentPath(root: string, filePath: string) {
  return { root, relativePath: path.relative(root, filePath), pathSyntax: "native" as const };
}

export function readWorkspaceDocument(root: string, filePath: string, maxBytes: number): string {
  return readContainedFile({ ...documentPath(root, filePath), maxBytes }, "utf8");
}

function accountMarkdownFile(root: string, filePath: string, budget: DiscoveryBudget): void {
  const size = withContainedPathSink({ ...documentPath(root, filePath), operation: "read" }, ({ absolutePath }) => {
    const stat = fs.lstatSync(absolutePath);
    if (!stat.isFile()) throw new Error(`graph document must be a regular file: ${filePath}`);
    return stat.size;
  });
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

function listMarkdownFiles(root: string, dir: string, budget: DiscoveryBudget, owns: (file: string) => boolean, depth = 0): string[] {
  if (!owns(dir)) return [];
  if (!containedPathExists(documentPath(root, dir))) {
    return [];
  }
  if (depth > budget.limits.max_depth) {
    throw new Error(`graph directory depth exceeds index.limits.max_depth (${budget.limits.max_depth}): ${dir}`);
  }

  const entries = readContainedDirectory(documentPath(root, dir));
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (!owns(fullPath)) continue;
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(root, fullPath, budget, owns, depth + 1));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      accountMarkdownFile(root, fullPath, budget);
      files.push(fullPath);
    }
  }
  return files;
}

function listArchiveSidecarFiles(root: string, dir: string, budget: DiscoveryBudget, owns: (file: string) => boolean, depth = 0): string[] {
  if (!owns(dir)) return [];
  if (!containedPathExists(documentPath(root, dir))) {
    return [];
  }
  if (depth > budget.limits.max_depth) {
    throw new Error(`graph directory depth exceeds index.limits.max_depth (${budget.limits.max_depth}): ${dir}`);
  }
  const entries = readContainedDirectory(documentPath(root, dir));
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "source") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (!owns(fullPath)) continue;
    if (entry.isDirectory()) {
      files.push(...listArchiveSidecarFiles(root, fullPath, budget, owns, depth + 1));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      accountMarkdownFile(root, fullPath, budget);
      files.push(fullPath);
    }
  }
  return files;
}

export function getWorkspaceDocRoots(root: string, config: Config): WorkspaceDocRoot[] {
  assertWorkspaceDocumentRootSpellings(root, config);
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
  const owner = absoluteWorkspaceDocumentOwner(root, config);
  const budget: DiscoveryBudget = { files: 0, bytes: 0, limits: config.index.limits };
  for (const { alias, root: wsRoot } of getWorkspaceDocRoots(root, config)) {
    const owns = (file: string) => owner(file) === alias;
    for (const folder of DOC_FOLDERS) {
      const folderPath = path.join(wsRoot, folder);
      files.push(...listMarkdownFiles(root, folderPath, budget, owns));
    }
    files.push(...listArchiveSidecarFiles(root, path.join(wsRoot, "archive"), budget, owns));
  }
  return files;
}

export function listWorkspaceDocFilesByAlias(
  root: string,
  config: Config
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const owner = absoluteWorkspaceDocumentOwner(root, config);
  const budget: DiscoveryBudget = { files: 0, bytes: 0, limits: config.index.limits };
  for (const { alias, root: wsRoot } of getWorkspaceDocRoots(root, config)) {
    const owns = (file: string) => owner(file) === alias;
    const files: string[] = [];
    for (const folder of DOC_FOLDERS) {
      const folderPath = path.join(wsRoot, folder);
      files.push(...listMarkdownFiles(root, folderPath, budget, owns));
    }
    files.push(...listArchiveSidecarFiles(root, path.join(wsRoot, "archive"), budget, owns));
    files.sort();
    result[alias] = files;
  }
  return result;
}
