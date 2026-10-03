import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { workingPath, workingStorePresent } from "../core/working_paths";
import { ContainedPathError } from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { configPath } from "../core/paths";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { absoluteWorkspaceDocumentOwner } from "./workspace_ownership";
import { writeCacheFile } from "./cache_output";
import { listWorkspaceDocFiles } from "./workspace_files";
import { readGraphFormat } from "./identity";
import { buildIndex } from "./indexer";
import { currentNodeCacheFingerprint } from "./staleness";
import { currentSkillCacheSources } from "./skills_indexer";
import { capabilityCacheFingerprint, readJsonCacheFingerprint, readJsonCacheText } from "./json_cache_fingerprint";
import { cacheSourceStats } from "./cache_sources";
import {
  buildCapabilitiesIndex,
  bindCapabilityLinkage,
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
    for (const item of cacheSourceStats(root, skillsRoot, config.index.limits, (file) => owner(file) === alias)) {
      if (item.mtimeMs > indexMtime) {
        return true;
      }
    }
  }

  const fingerprint = readJsonCacheFingerprint(root, indexPath, "capabilities");
  return !fingerprint || fingerprint !== capabilityCacheFingerprint(config,
    currentNodeCacheFingerprint(root, config), currentSkillCacheSources(root, config, true));
}

function readCapabilitiesIndex(root: string, config: Config, indexPath: string, allowStale = false): CapabilitiesIndex {
  try {
    const raw = readJsonCacheText(root, indexPath);
    const index = JSON.parse(raw) as CapabilitiesIndex;
    if (workingStorePresent(root) && index.records.some(record => workingPath(record.path))) {
      throw new UsageError("cached capability path overlaps private working storage");
    }
    try {
      const nodes = buildIndex(root, config);
      return { ...index, records: index.records.map(record => bindCapabilityLinkage(nodes, record)) };
    } catch (error) {
      if (!allowStale || error instanceof ContainedPathError || error instanceof UsageError) throw error;
      // Explicit stale discovery is still useful with an incomplete authored
      // graph. Return its metadata, never unverified workflow associations.
      return { ...index, meta: { ...index.meta, inspection_errors: [...(index.meta.inspection_errors ?? []),
        "cached workflow linkage withheld: current authored graph could not be verified"] },
        records: index.records.map(record => { const { linkage: _unverified, ...metadata } = projectCapabilityRecord(record); return metadata; }) };
    }
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
    return { index: readCapabilitiesIndex(options.root, options.config, indexPath), rebuilt: false, stale: false };
  }

  if (allowReindex) {
    const index = buildCapabilitiesIndex(options.root, options.config);
    if (persistReindex) {
      writeCapabilitiesIndex(options.root, indexPath, index);
    }
    return { index, rebuilt: true, stale };
  }

  if (fs.existsSync(indexPath)) {
    return { index: readCapabilitiesIndex(options.root, options.config, indexPath, true), rebuilt: false, stale: true };
  }

  throw new Error("capabilities index missing and auto-reindex is disabled");
}
