import fs from "fs";
import path from "path";
import { Config } from "../core/config";

export type WorkspaceDocRoot = {
  alias: string;
  root: string;
};

const DOC_FOLDERS = ["core", "design", "work"];

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
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
    const wsRoot = path.resolve(root, entry.path, entry.mdkg_dir);
    roots.push({ alias, root: wsRoot });
  }
  return roots;
}

export function listWorkspaceDocFiles(root: string, config: Config): string[] {
  const files: string[] = [];
  for (const { root: wsRoot } of getWorkspaceDocRoots(root, config)) {
    for (const folder of DOC_FOLDERS) {
      const folderPath = path.join(wsRoot, folder);
      files.push(...listMarkdownFiles(folderPath));
    }
  }
  return files;
}

export function listWorkspaceDocFilesByAlias(
  root: string,
  config: Config
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const { alias, root: wsRoot } of getWorkspaceDocRoots(root, config)) {
    const files: string[] = [];
    for (const folder of DOC_FOLDERS) {
      const folderPath = path.join(wsRoot, folder);
      files.push(...listMarkdownFiles(folderPath));
    }
    files.sort();
    result[alias] = files;
  }
  return result;
}
