import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { sortIndexNodes } from "../util/sort";
import { buildIndex, Index } from "./indexer";
import { isIndexStale } from "./staleness";

export type LoadIndexOptions = {
  root: string;
  config: Config;
  useCache?: boolean;
  allowReindex?: boolean;
  tolerant?: boolean;
};

export type LoadIndexResult = {
  index: Index;
  rebuilt: boolean;
  stale: boolean;
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

  const indexPath = path.resolve(options.root, options.config.index.global_index_path);

  if (!useCache) {
    const index = buildIndex(options.root, options.config, { tolerant });
    return { index, rebuilt: true, stale: false };
  }

  const stale = isIndexStale(options.root, options.config);
  if (fs.existsSync(indexPath) && !stale) {
    return { index: readIndex(indexPath), rebuilt: false, stale: false };
  }

  if (allowReindex) {
    const index = buildIndex(options.root, options.config, { tolerant });
    writeIndex(indexPath, index);
    return { index, rebuilt: true, stale };
  }

  if (fs.existsSync(indexPath)) {
    return { index: readIndex(indexPath), rebuilt: false, stale: true };
  }

  throw new Error("index missing and auto-reindex is disabled");
}
