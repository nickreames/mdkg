import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { configPath } from "../core/paths";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { absoluteWorkspaceDocumentOwner } from "./workspace_ownership";
import { writeCacheFile } from "./cache_output";
import { listWorkspaceDocFiles } from "./workspace_files";
import { readGraphFormat } from "./identity";
import { buildIndex } from "./indexer";
import { currentNodeCacheFingerprint } from "./staleness";
import { currentSkillCacheSources } from "./skills_indexer";
import { capabilityCacheFingerprint, readJsonCacheFingerprint } from "./json_cache_fingerprint";
import {
  buildCapabilitiesIndex,
  CapabilitiesIndex,
  projectCapabilityRecord,
  resolveCapabilitiesIndexPath,
} from "./capabilities_indexer";

export type LoadCapabilitiesIndexOptions = {
  root: string;
  config: Config;
  useCache?: boolean;
  allowReindex?: boolean;
  persistReindex?: boolean;
};

export type LoadCapabilitiesIndexResult = {
  index: CapabilitiesIndex;
  rebuilt: boolean;
  stale: boolean;
};

function mtimeMs(filePath: string): number {
  return fs.statSync(filePath).mtimeMs;
}

function listFilesAndDirectories(dir: string, owns: (file: string) => boolean): string[] {
  if (!owns(dir)) return [];
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items: string[] = [dir];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (!owns(fullPath)) continue;
    if (entry.isDirectory()) {
      items.push(...listFilesAndDirectories(fullPath, owns));
      continue;
    }
    if (entry.isFile()) {
      items.push(fullPath);
    }
  }
  return items;
}

function workspaceSkillsRoots(root: string, config: Config): Array<{ alias: string; root: string }> {
  return Object.keys(config.workspaces)
    .sort()
    .filter((alias) => config.workspaces[alias].enabled)
    .map((alias) => {
      const workspace = config.workspaces[alias];
      return { alias, root: path.resolve(root, workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir, "skills")) };
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

  const owner = absoluteWorkspaceDocumentOwner(root, config);
  for (const { alias, root: skillsRoot } of workspaceSkillsRoots(root, config)) {
    for (const item of listFilesAndDirectories(skillsRoot, (file) => owner(file) === alias)) {
      if (mtimeMs(item) > indexMtime) {
        return true;
      }
    }
  }

  const fingerprint = readJsonCacheFingerprint(root, indexPath, "capabilities");
  return !fingerprint || fingerprint !== capabilityCacheFingerprint(config,
    currentNodeCacheFingerprint(root, config), currentSkillCacheSources(root, config, true));
}

function readCapabilitiesIndex(indexPath: string): CapabilitiesIndex {
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    const index = JSON.parse(raw) as CapabilitiesIndex;
    return { ...index, records: index.records.map(projectCapabilityRecord) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`failed to read capabilities index: ${message}`);
  }
}

export function writeCapabilitiesIndex(root: string, indexPath: string, index: CapabilitiesIndex): void {
  if (index.meta.inspection_errors?.length) throw new Error("cannot persist unresolved capability inspection; reviewed reconciliation required");
  writeCacheFile(root, indexPath, JSON.stringify(index, null, 2));
}

export function loadCapabilitiesIndex(
  options: LoadCapabilitiesIndexOptions
): LoadCapabilitiesIndexResult {
  if (readGraphFormat(options.root).format_version === 2) {
    const nodes = buildIndex(options.root, options.config, { inspection: true });
    const index = buildCapabilitiesIndex(options.root, options.config, nodes);
    if (nodes.meta.inspection_errors?.length) index.meta.inspection_errors = nodes.meta.inspection_errors;
    return { index, rebuilt: true, stale: false };
  }
  const useCache = options.useCache ?? true;
  const allowReindex = options.allowReindex ?? options.config.index.auto_reindex;
  const persistReindex = options.persistReindex ?? true;
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
    if (persistReindex) {
      writeCapabilitiesIndex(options.root, indexPath, index);
    }
    return { index, rebuilt: true, stale };
  }

  if (fs.existsSync(indexPath)) {
    return { index: readCapabilitiesIndex(indexPath), rebuilt: false, stale: true };
  }

  throw new Error("capabilities index missing and auto-reindex is disabled");
}
