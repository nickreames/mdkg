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
  frontmatter: Record<string, string[]>;
  body: string;
};

type JsonPack = {
  meta: PackResult["meta"];
  nodes: JsonNode[];
};

function buildFrontmatter(node: PackResult["nodes"][number]): Record<string, string[]> {
  const frontmatter: Record<string, string[]> = {};
  if (node.links.length > 0) {
    frontmatter.links = node.links;
  }
  if (node.artifacts.length > 0) {
    frontmatter.artifacts = node.artifacts;
  }
  if (node.refs.length > 0) {
    frontmatter.refs = node.refs;
  }
  if (node.aliases.length > 0) {
    frontmatter.aliases = node.aliases;
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
