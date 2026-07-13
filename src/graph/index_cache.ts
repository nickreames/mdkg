import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { readContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { sortIndexNodes } from "../util/sort";
import { atomicWriteFile } from "../util/atomic";
import { buildIndex, Index } from "./indexer";
import { isIndexStale } from "./staleness";
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
    const relativePath = path.relative(root, indexPath).split(path.sep).join("/");
    const parsed = JSON.parse(readContainedFile({ root, relativePath }, "utf8")) as unknown;
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

export function writeIndex(indexPath: string, index: Index): void {
  const sortedIndex: Index = { ...index, nodes: sortIndexNodes(index.nodes) };
  atomicWriteFile(indexPath, JSON.stringify(sortedIndex, null, 2));
}

export function loadIndex(options: LoadIndexOptions): LoadIndexResult {
  const useCache = options.useCache ?? true;
  const allowReindex = options.allowReindex ?? options.config.index.auto_reindex;
  const tolerant = options.tolerant ?? options.config.index.tolerant;
  const includeImports = options.includeImports ?? true;
  const persistReindex = options.persistReindex ?? true;

  const indexPath = path.resolve(options.root, options.config.index.global_index_path);
  const withSubgraphs = (index: Index, rebuilt: boolean, stale: boolean): LoadIndexResult => {
    if (!includeImports || Object.keys(options.config.subgraphs).length === 0) {
      return { index, rebuilt, stale, warnings: [] };
    }
    const subgraphs = buildSubgraphsIndex(options.root, options.config);
    if (allowReindex && persistReindex) {
      writeSubgraphsIndex(resolveSubgraphsIndexPath(options.root), subgraphs.index);
    }
    return {
      index: mergeSubgraphsIntoIndex(index, subgraphs),
      rebuilt,
      stale: stale || isSubgraphsIndexStale(options.root, options.config),
      warnings: subgraphWarnings(subgraphs),
    };
  };

  if (!useCache) {
    const index = buildIndex(options.root, options.config, { tolerant });
    return withSubgraphs(index, true, false);
  }

  const stale = isIndexStale(options.root, options.config);
  if (fs.existsSync(indexPath) && !stale) {
    return withSubgraphs(validateCachedNodePaths(options.root, options.config, readIndex(options.root, indexPath)), false, false);
  }

  if (allowReindex) {
    const index = buildIndex(options.root, options.config, { tolerant });
    if (persistReindex) {
      writeIndex(indexPath, index);
    }
    return withSubgraphs(index, true, stale);
  }

  if (fs.existsSync(indexPath)) {
    const cached = validateCachedNodePaths(options.root, options.config, readIndex(options.root, indexPath));
    return withSubgraphs(cached, false, true);
  }

  throw new Error("index missing and auto-reindex is disabled");
}
