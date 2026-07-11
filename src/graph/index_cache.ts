import fs from "fs";
import path from "path";
import { Config } from "../core/config";
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

function readIndex(indexPath: string): Index {
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    return JSON.parse(raw) as Index;
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`failed to read index: ${message}`);
  }
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
    return withSubgraphs(readIndex(indexPath), false, false);
  }

  if (allowReindex) {
    const index = buildIndex(options.root, options.config, { tolerant });
    if (persistReindex) {
      writeIndex(indexPath, index);
    }
    return withSubgraphs(index, true, stale);
  }

  if (fs.existsSync(indexPath)) {
    return withSubgraphs(readIndex(indexPath), false, true);
  }

  throw new Error("index missing and auto-reindex is disabled");
}
