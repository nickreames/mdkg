import path from "path";
import { loadConfig } from "../core/config";
import { IndexOptions } from "../graph/indexer";
import { writeDerivedIndexes } from "../graph/reindex";
import { withMutationLock } from "../util/lock";

export type IndexCommandOptions = IndexOptions & {
  root: string;
};

export function runIndexCommand(options: IndexCommandOptions): void {
  const config = loadConfig(options.root);
  withMutationLock(options.root, config.index.lock_timeout_ms, () => {
    const result = writeDerivedIndexes(
      options.root,
      config,
      undefined,
      { tolerant: options.tolerant }
    );
    console.log(`index written: ${path.relative(options.root, result.paths.nodes)}`);
    console.log(`skills index written: ${path.relative(options.root, result.paths.skills)}`);
    console.log(`capabilities index written: ${path.relative(options.root, result.paths.capabilities)}`);
    console.log(`bundle imports index written: ${path.relative(options.root, result.paths.imports)}`);
    if (result.paths.sqlite) {
      console.log(`sqlite index written: ${path.relative(options.root, result.paths.sqlite)}`);
    }
  });
}
