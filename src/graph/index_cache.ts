import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { sortIndexNodes } from "../util/sort";
import { buildIndex, Index } from "./indexer";
import { isIndexStale } from "./staleness";
import {
  buildBundleImportsIndex,
  importWarnings,
  isBundleImportsIndexStale,
  mergeBundleImportsIntoIndex,
  resolveBundleImportsIndexPath,
  writeBundleImportsIndex,
} from "./bundle_imports";

export type LoadIndexOptions = {
  root: string;
  config: Config;
  useCache?: boolean;
  allowReindex?: boolean;
  tolerant?: boolean;
  includeImports?: boolean;
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
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, JSON.stringify(sortedIndex, null, 2));
}

export function loadIndex(options: LoadIndexOptions): LoadIndexResult {
  const useCache = options.useCache ?? true;
  const allowReindex = options.allowReindex ?? options.config.index.auto_reindex;
  const tolerant = options.tolerant ?? options.config.index.tolerant;
  const includeImports = options.includeImports ?? true;

  const indexPath = path.resolve(options.root, options.config.index.global_index_path);
  const withImports = (index: Index, rebuilt: boolean, stale: boolean): LoadIndexResult => {
    if (!includeImports || Object.keys(options.config.bundle_imports).length === 0) {
      return { index, rebuilt, stale, warnings: [] };
    }
    const imports = buildBundleImportsIndex(options.root, options.config);
    if (allowReindex) {
      writeBundleImportsIndex(resolveBundleImportsIndexPath(options.root), imports.index);
    }
    return {
      index: mergeBundleImportsIntoIndex(index, imports),
      rebuilt,
      stale: stale || isBundleImportsIndexStale(options.root, options.config),
      warnings: importWarnings(imports),
    };
  };

  if (!useCache) {
    const index = buildIndex(options.root, options.config, { tolerant });
    return withImports(index, true, false);
  }

  const stale = isIndexStale(options.root, options.config);
  if (fs.existsSync(indexPath) && !stale) {
    return withImports(readIndex(indexPath), false, false);
  }

  if (allowReindex) {
    const index = buildIndex(options.root, options.config, { tolerant });
    writeIndex(indexPath, index);
    return withImports(index, true, stale);
  }

  if (fs.existsSync(indexPath)) {
    return withImports(readIndex(indexPath), false, true);
  }

  throw new Error("index missing and auto-reindex is disabled");
}
