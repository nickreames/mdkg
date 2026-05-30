import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { configPath } from "../core/paths";
import { atomicWriteFile } from "../util/atomic";
import { listWorkspaceDocFiles } from "./workspace_files";
import {
  buildCapabilitiesIndex,
  CapabilitiesIndex,
  resolveCapabilitiesIndexPath,
} from "./capabilities_indexer";

export type LoadCapabilitiesIndexOptions = {
  root: string;
  config: Config;
  useCache?: boolean;
  allowReindex?: boolean;
};

export type LoadCapabilitiesIndexResult = {
  index: CapabilitiesIndex;
  rebuilt: boolean;
  stale: boolean;
};

function mtimeMs(filePath: string): number {
  return fs.statSync(filePath).mtimeMs;
}

function listFilesAndDirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items: string[] = [dir];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(...listFilesAndDirectories(fullPath));
      continue;
    }
    if (entry.isFile()) {
      items.push(fullPath);
    }
  }
  return items;
}

function workspaceSkillsRoots(root: string, config: Config): string[] {
  return Object.keys(config.workspaces)
    .sort()
    .filter((alias) => config.workspaces[alias].enabled)
    .map((alias) => {
      const workspace = config.workspaces[alias];
      return path.resolve(root, workspace.path, workspace.mdkg_dir, "skills");
    });
}

export function isCapabilitiesIndexStale(root: string, config: Config): boolean {
  const indexPath = resolveCapabilitiesIndexPath(root, config);
  if (!fs.existsSync(indexPath)) {
    return true;
  }

  const indexMtime = mtimeMs(indexPath);
  const cfgPath = configPath(root);
  if (fs.existsSync(cfgPath) && mtimeMs(cfgPath) > indexMtime) {
    return true;
  }

  for (const filePath of listWorkspaceDocFiles(root, config)) {
    if (mtimeMs(filePath) > indexMtime) {
      return true;
    }
  }

  for (const skillsRoot of workspaceSkillsRoots(root, config)) {
    for (const item of listFilesAndDirectories(skillsRoot)) {
      if (mtimeMs(item) > indexMtime) {
        return true;
      }
    }
  }

  return false;
}

function readCapabilitiesIndex(indexPath: string): CapabilitiesIndex {
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    return JSON.parse(raw) as CapabilitiesIndex;
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`failed to read capabilities index: ${message}`);
  }
}

export function writeCapabilitiesIndex(indexPath: string, index: CapabilitiesIndex): void {
  atomicWriteFile(indexPath, JSON.stringify(index, null, 2));
}

export function loadCapabilitiesIndex(
  options: LoadCapabilitiesIndexOptions
): LoadCapabilitiesIndexResult {
  const useCache = options.useCache ?? true;
  const allowReindex = options.allowReindex ?? options.config.index.auto_reindex;
  const indexPath = resolveCapabilitiesIndexPath(options.root, options.config);

  if (!useCache) {
    const index = buildCapabilitiesIndex(options.root, options.config);
    return { index, rebuilt: true, stale: false };
  }

  const stale = isCapabilitiesIndexStale(options.root, options.config);
  if (fs.existsSync(indexPath) && !stale) {
    return { index: readCapabilitiesIndex(indexPath), rebuilt: false, stale: false };
  }

  if (allowReindex) {
    const index = buildCapabilitiesIndex(options.root, options.config);
    writeCapabilitiesIndex(indexPath, index);
    return { index, rebuilt: true, stale };
  }

  if (fs.existsSync(indexPath)) {
    return { index: readCapabilitiesIndex(indexPath), rebuilt: false, stale: true };
  }

  throw new Error("capabilities index missing and auto-reindex is disabled");
}
