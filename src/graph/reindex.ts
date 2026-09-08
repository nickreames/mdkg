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
import { preflightCacheOutputs } from "./cache_output";
import { withContainedPathSink } from "../core/filesystem_authority";

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

  // Reject an unsafe later destination before refreshing earlier JSON caches.
  // Each actual writer still validates containment at replacement. This is not
  // a transaction for authoring operations that called into cache rebuilding.
  preflightCacheOutputs(root, [nodesOutputPath, skillsOutputPath, capabilitiesOutputPath, subgraphsOutputPath]);
  if (isSqliteBackend(config)) {
    withContainedPathSink({ root, relativePath: config.index.sqlite_path, operation: "replace", createParents: false }, () => undefined);
  }
  writeIndex(root, nodesOutputPath, nextNodeIndex);
  writeSkillsIndex(root, skillsOutputPath, skillsIndex);
  writeCapabilitiesIndex(root, capabilitiesOutputPath, capabilitiesIndex);
  writeSubgraphsIndex(root, subgraphsOutputPath, subgraphsIndex.index);

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
