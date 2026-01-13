import path from "path";
import { loadConfig } from "../core/config";
import { buildIndex, IndexOptions } from "../graph/indexer";
import { writeIndex } from "../graph/index_cache";

export type IndexCommandOptions = IndexOptions & {
  root: string;
};

export function runIndexCommand(options: IndexCommandOptions): void {
  const config = loadConfig(options.root);
  const index = buildIndex(options.root, config, { tolerant: options.tolerant });

  const outputPath = path.resolve(options.root, config.index.global_index_path);
  writeIndex(outputPath, index);
  console.log(`index written: ${path.relative(options.root, outputPath)}`);
}
