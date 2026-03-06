import path from "path";
import { loadConfig } from "../core/config";
import { buildIndex, IndexOptions } from "../graph/indexer";
import { writeIndex } from "../graph/index_cache";
import { writeSkillsIndex } from "../graph/skills_index_cache";
import { buildSkillsIndex, resolveSkillsIndexPath } from "../graph/skills_indexer";

export type IndexCommandOptions = IndexOptions & {
  root: string;
};

export function runIndexCommand(options: IndexCommandOptions): void {
  const config = loadConfig(options.root);
  const nodeIndex = buildIndex(options.root, config, { tolerant: options.tolerant });
  const skillsIndex = buildSkillsIndex(options.root, config);

  const nodesOutputPath = path.resolve(options.root, config.index.global_index_path);
  const skillsOutputPath = resolveSkillsIndexPath(options.root);
  writeIndex(nodesOutputPath, nodeIndex);
  writeSkillsIndex(skillsOutputPath, skillsIndex);
  console.log(`index written: ${path.relative(options.root, nodesOutputPath)}`);
  console.log(`skills index written: ${path.relative(options.root, skillsOutputPath)}`);
}
