import { FrontmatterValue } from "../graph/frontmatter";
import { PackResult } from "./types";

type JsonNode = {
  qid: string;
  id: string;
  workspace: string;
  type: string;
  title: string;
  status?: string;
  priority?: number;
  path: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
};

type JsonPack = {
  meta: PackResult["meta"];
  nodes: JsonNode[];
};

function buildFrontmatter(node: PackResult["nodes"][number]): Record<string, FrontmatterValue> {
  const links = node.links ?? [];
  const artifacts = node.artifacts ?? [];
  const refs = node.refs ?? [];
  const contextRefs = node.context_refs ?? [];
  const evidenceRefs = node.evidence_refs ?? [];
  const aliases = node.aliases ?? [];
  const frontmatter: Record<string, FrontmatterValue> = {};
  if (links.length > 0) {
    frontmatter.links = links;
  }
  if (artifacts.length > 0) {
    frontmatter.artifacts = artifacts;
  }
  if (refs.length > 0) {
    frontmatter.refs = refs;
  }
  if (contextRefs.length > 0) {
    frontmatter.context_refs = contextRefs;
  }
  if (evidenceRefs.length > 0) {
    frontmatter.evidence_refs = evidenceRefs;
  }
  if (aliases.length > 0) {
    frontmatter.aliases = aliases;
  }
  for (const [key, value] of Object.entries(node.attributes ?? {})) {
    frontmatter[key] = value;
  }
  return frontmatter;
}

export function exportJson(pack: PackResult): string {
  const nodes: JsonNode[] = pack.nodes.map((node) => ({
    qid: node.qid,
    id: node.id,
    workspace: node.workspace,
    type: node.type,
    title: node.title,
    status: node.status,
    priority: node.priority,
    path: node.path,
    frontmatter: buildFrontmatter(node),
    body: node.body,
  }));

  const payload: JsonPack = {
    meta: pack.meta,
    nodes,
  };

  return JSON.stringify(payload, null, 2);
}
