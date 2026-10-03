import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { privateWorkingPath } from "../core/working_paths";
import { withContainedPathSink } from "../core/filesystem_authority";
import { sortIndexNodes } from "../util/sort";
import { writeCacheFile } from "./cache_output";
import { buildIndex, Index } from "./indexer";
import { isIndexStale } from "./staleness";
import { readGraphFormat } from "./identity";
import { readJsonCacheText } from "./json_cache_fingerprint";
import {
  buildSubgraphsIndex,
  isSubgraphsIndexStale,
  mergeSubgraphsIntoIndex,
  resolveSubgraphsIndexPath,
  subgraphWarnings,
  writeSubgraphsIndex,
} from "./subgraphs";

export type LoadIndexOptions = {
  root: string;
  config: Config;
  useCache?: boolean;
  allowReindex?: boolean;
  tolerant?: boolean;
  includeImports?: boolean;
  persistReindex?: boolean;
  inspection?: boolean;
};

export type LoadIndexResult = {
  index: Index;
  rebuilt: boolean;
  stale: boolean;
  warnings: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readIndex(root: string, indexPath: string): Index {
  try {
    const parsed = JSON.parse(readJsonCacheText(root, indexPath)) as unknown;
    if (!isRecord(parsed) || !isRecord(parsed.meta) || !isRecord(parsed.workspaces) || !isRecord(parsed.nodes) || !isRecord(parsed.reverse_edges)) {
      throw new Error("index cache has an invalid shape");
    }
    return parsed as unknown as Index;
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`failed to read index: ${message}`);
  }
}

function validateCachedNodePaths(root: string, config: Config, cached: Index): Index {
  for (const node of Object.values(cached.nodes)) {
    if (node.qid !== `${node.ws}:${node.id}` || node.source?.imported) throw new Error(`invalid cached node identity: ${node.qid}`);
    const workspace = config.workspaces[node.ws];
    if (!workspace?.enabled) throw new Error(`invalid cached node workspace: ${node.ws}`);
    const normalized = node.path.split(path.sep).join("/");
    if (privateWorkingPath(root, normalized)) throw new Error("cached node path overlaps private working storage");
    const workspaceRoot = path.resolve(root, workspace.path, workspace.mdkg_dir);
    const absolutePath = path.resolve(root, normalized);
    const relativeWorkspacePath = path.relative(workspaceRoot, absolutePath);
    if (path.isAbsolute(normalized) || relativeWorkspacePath.startsWith("..") || path.isAbsolute(relativeWorkspacePath)) {
      throw new Error(`cached node path escapes workspace root: ${node.qid}`);
    }
    withContainedPathSink({ root, relativePath: normalized, operation: "read" }, () => undefined);
  }
  return cached;
}

export function writeIndex(root: string, indexPath: string, index: Index): void {
  if (index.meta.inspection_errors?.length) throw new Error("cannot persist an unresolved inspection graph; reviewed reconciliation required");
  const sortedIndex: Index = { ...index, nodes: sortIndexNodes(index.nodes) };
  writeCacheFile(root, indexPath, JSON.stringify(sortedIndex, null, 2));
}

export function loadIndex(options: LoadIndexOptions): LoadIndexResult {
  // Format checks and authored identities cannot be bypassed by a fresh cache.
  // V2 derives from the current working tree, including untracked/deleted nodes.
  const graphFormat = readGraphFormat(options.root);
  const inspection = graphFormat.format_version === 2 && options.inspection === true;
  const useCache = graphFormat.format_version === 2 ? false : options.useCache ?? true;
  const allowReindex = options.allowReindex ?? options.config.index.auto_reindex;
  const tolerant = options.tolerant ?? options.config.index.tolerant;
  const includeImports = options.includeImports ?? true;
  // Inspection never owns cache writes, even for legacy graphs. Keep this
  // persistence policy separate from v2's tolerant identity inspection above.
  const persistReindex = options.inspection === true ? false : options.persistReindex ?? true;

  const indexPath = path.resolve(options.root, options.config.index.global_index_path);
  const withSubgraphs = (index: Index, rebuilt: boolean, stale: boolean): LoadIndexResult => {
    if (!includeImports || Object.keys(options.config.subgraphs).length === 0) {
      return { index, rebuilt, stale, warnings: index.meta.inspection_errors ?? [] };
    }
    const subgraphs = buildSubgraphsIndex(options.root, options.config);
    if (allowReindex && persistReindex) {
      writeSubgraphsIndex(options.root, resolveSubgraphsIndexPath(options.root), subgraphs.index);
    }
    return {
      index: mergeSubgraphsIntoIndex(index, subgraphs),
      rebuilt,
      stale: stale || isSubgraphsIndexStale(options.root, options.config),
      warnings: [...(index.meta.inspection_errors ?? []), ...subgraphWarnings(subgraphs)],
    };
  };

  if (!useCache) {
    const index = buildIndex(options.root, options.config, { tolerant, inspection });
    return withSubgraphs(index, true, false);
  }

  const stale = isIndexStale(options.root, options.config, tolerant);
  if (fs.existsSync(indexPath) && !stale) {
    return withSubgraphs(validateCachedNodePaths(options.root, options.config, readIndex(options.root, indexPath)), false, false);
  }

  if (allowReindex) {
    const index = buildIndex(options.root, options.config, { tolerant });
    if (persistReindex) {
      writeIndex(options.root, indexPath, index);
    }
    return withSubgraphs(index, true, stale);
  }

  if (fs.existsSync(indexPath)) {
    const cached = validateCachedNodePaths(options.root, options.config, readIndex(options.root, indexPath));
    return withSubgraphs(cached, false, true);
  }

  throw new Error("index missing and auto-reindex is disabled");
}
