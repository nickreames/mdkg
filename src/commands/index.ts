import path from "path";
import { loadConfig } from "../core/config";
import { IndexOptions } from "../graph/indexer";
import { writeDerivedIndexes } from "../graph/reindex";
import { withMutationLock } from "../util/lock";

export type IndexCommandOptions = IndexOptions & {
  root: string;
};

export function rebuildDerivedIndexCaches(options: IndexCommandOptions) {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    writeDerivedIndexes(
      options.root,
      config,
      undefined,
      { tolerant: options.tolerant }
    )
  );
}

export function printIndexRebuildReceipt(root: string, result: ReturnType<typeof rebuildDerivedIndexCaches>): void {
  console.log(`index written: ${path.relative(root, result.paths.nodes)}`);
  console.log(`skills index written: ${path.relative(root, result.paths.skills)}`);
  console.log(`capabilities index written: ${path.relative(root, result.paths.capabilities)}`);
  console.log(`subgraphs index written: ${path.relative(root, result.paths.subgraphs)}`);
  if (result.paths.sqlite) {
    console.log(`sqlite index written: ${path.relative(root, result.paths.sqlite)}`);
  }
}

export function runIndexCommand(options: IndexCommandOptions): void {
  printIndexRebuildReceipt(options.root, rebuildDerivedIndexCaches(options));
}
