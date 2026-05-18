import path from "path";
import { loadConfig } from "../core/config";
import { buildIndex, IndexOptions } from "../graph/indexer";
import { writeIndex } from "../graph/index_cache";
import { writeSkillsIndex } from "../graph/skills_index_cache";
import { buildSkillsIndex, resolveSkillsIndexPath } from "../graph/skills_indexer";
import {
  buildCapabilitiesIndex,
  resolveCapabilitiesIndexPath,
} from "../graph/capabilities_indexer";
import { writeCapabilitiesIndex } from "../graph/capabilities_index_cache";
import {
  buildBundleImportsIndex,
  resolveBundleImportsIndexPath,
  writeBundleImportsIndex,
} from "../graph/bundle_imports";

export type IndexCommandOptions = IndexOptions & {
  root: string;
};

export function runIndexCommand(options: IndexCommandOptions): void {
  const config = loadConfig(options.root);
  const nodeIndex = buildIndex(options.root, config, { tolerant: options.tolerant });
  const skillsIndex = buildSkillsIndex(options.root, config);
  const capabilitiesIndex = buildCapabilitiesIndex(options.root, config, nodeIndex);
  const importsIndex = buildBundleImportsIndex(options.root, config);

  const nodesOutputPath = path.resolve(options.root, config.index.global_index_path);
  const skillsOutputPath = resolveSkillsIndexPath(options.root);
  const capabilitiesOutputPath = resolveCapabilitiesIndexPath(options.root, config);
  const importsOutputPath = resolveBundleImportsIndexPath(options.root);
  writeIndex(nodesOutputPath, nodeIndex);
  writeSkillsIndex(skillsOutputPath, skillsIndex);
  writeCapabilitiesIndex(capabilitiesOutputPath, capabilitiesIndex);
  writeBundleImportsIndex(importsOutputPath, importsIndex.index);
  console.log(`index written: ${path.relative(options.root, nodesOutputPath)}`);
  console.log(`skills index written: ${path.relative(options.root, skillsOutputPath)}`);
  console.log(`capabilities index written: ${path.relative(options.root, capabilitiesOutputPath)}`);
  console.log(`bundle imports index written: ${path.relative(options.root, importsOutputPath)}`);
}
