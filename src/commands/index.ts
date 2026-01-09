import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { buildIndex, IndexOptions } from "../graph/indexer";

export type IndexCommandOptions = IndexOptions & {
  root: string;
};

export function runIndexCommand(options: IndexCommandOptions): void {
  const config = loadConfig(options.root);
  const index = buildIndex(options.root, config, { tolerant: options.tolerant });

  const outputPath = path.resolve(options.root, config.index.global_index_path);
  const outputDir = path.dirname(outputPath);
  fs.mkdirSync(outputDir, { recursive: true });

  const sortedNodes: Record<string, typeof index.nodes[string]> = {};
  for (const qid of Object.keys(index.nodes).sort()) {
    sortedNodes[qid] = index.nodes[qid];
  }

  const sortedIndex = { ...index, nodes: sortedNodes };
  fs.writeFileSync(outputPath, JSON.stringify(sortedIndex, null, 2));
  console.log(`index written: ${path.relative(options.root, outputPath)}`);
}
