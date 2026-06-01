import path from "path";
import { Config } from "../core/config";
import { buildCapabilitiesIndex, resolveCapabilitiesIndexPath } from "./capabilities_indexer";
import { writeCapabilitiesIndex } from "./capabilities_index_cache";
import { buildSubgraphsIndex, resolveSubgraphsIndexPath, writeSubgraphsIndex } from "./subgraphs";
import { buildIndex, Index } from "./indexer";
import { writeIndex } from "./index_cache";
import { writeSkillsIndex } from "./skills_index_cache";
import { buildSkillsIndex, resolveSkillsIndexPath } from "./skills_indexer";
import { isSqliteBackend, writeSqliteIndex } from "./sqlite_index";

export type DerivedIndexWriteResult = {
  nodeIndex: Index;
  paths: {
    nodes: string;
    skills: string;
    capabilities: string;
    subgraphs: string;
    sqlite?: string;
  };
};

export function writeDerivedIndexes(
  root: string,
  config: Config,
  nodeIndex?: Index,
  options?: { tolerant?: boolean }
): DerivedIndexWriteResult {
  const nextNodeIndex = nodeIndex ?? buildIndex(root, config, { tolerant: options?.tolerant ?? config.index.tolerant });
  const skillsIndex = buildSkillsIndex(root, config);
  const capabilitiesIndex = buildCapabilitiesIndex(root, config, nextNodeIndex);
  const subgraphsIndex = buildSubgraphsIndex(root, config);

  const nodesOutputPath = path.resolve(root, config.index.global_index_path);
  const skillsOutputPath = resolveSkillsIndexPath(root);
  const capabilitiesOutputPath = resolveCapabilitiesIndexPath(root, config);
  const subgraphsOutputPath = resolveSubgraphsIndexPath(root);

  writeIndex(nodesOutputPath, nextNodeIndex);
  writeSkillsIndex(skillsOutputPath, skillsIndex);
  writeCapabilitiesIndex(capabilitiesOutputPath, capabilitiesIndex);
  writeSubgraphsIndex(subgraphsOutputPath, subgraphsIndex.index);

  const paths: DerivedIndexWriteResult["paths"] = {
    nodes: nodesOutputPath,
    skills: skillsOutputPath,
    capabilities: capabilitiesOutputPath,
    subgraphs: subgraphsOutputPath,
  };
  if (isSqliteBackend(config)) {
    paths.sqlite = writeSqliteIndex({
      root,
      config,
      nodeIndex: nextNodeIndex,
      skillsIndex,
      capabilitiesIndex,
      subgraphsIndex: subgraphsIndex.index,
    });
  }

  return { nodeIndex: nextNodeIndex, paths };
}
