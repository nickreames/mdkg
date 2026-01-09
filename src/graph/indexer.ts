import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { parseNode } from "./node";
import { EdgeMap } from "./edges";
import { listWorkspaceDocFilesByAlias } from "./workspace_files";
import { validateGraph } from "./validate_graph";

export type IndexNode = {
  id: string;
  qid: string;
  ws: string;
  type: string;
  title: string;
  status?: string;
  priority?: number;
  created: string;
  updated: string;
  tags: string[];
  owners: string[];
  links: string[];
  artifacts: string[];
  refs: string[];
  aliases: string[];
  path: string;
  edges: EdgeMap;
};

export type Index = {
  meta: {
    tool: string;
    schema_version: number;
    generated_at: string;
    root: string;
    workspaces: string[];
  };
  workspaces: Record<string, { path: string; enabled: boolean }>;
  nodes: Record<string, IndexNode>;
  reverse_edges: Record<string, Record<string, string[]>>;
};

export type IndexOptions = {
  tolerant?: boolean;
};

function normalizeEdgeTarget(value: string, ws: string): string {
  if (value.includes(":")) {
    return value;
  }
  return `${ws}:${value}`;
}

function normalizeEdges(edges: EdgeMap, ws: string): EdgeMap {
  return {
    epic: edges.epic ? normalizeEdgeTarget(edges.epic, ws) : undefined,
    parent: edges.parent ? normalizeEdgeTarget(edges.parent, ws) : undefined,
    prev: edges.prev ? normalizeEdgeTarget(edges.prev, ws) : undefined,
    next: edges.next ? normalizeEdgeTarget(edges.next, ws) : undefined,
    relates: edges.relates.map((value) => normalizeEdgeTarget(value, ws)),
    blocked_by: edges.blocked_by.map((value) => normalizeEdgeTarget(value, ws)),
    blocks: edges.blocks.map((value) => normalizeEdgeTarget(value, ws)),
  };
}

function addReverseEdge(
  reverse: Record<string, Record<string, string[]>>,
  edgeKey: string,
  target: string,
  source: string
): void {
  if (!reverse[edgeKey]) {
    reverse[edgeKey] = {};
  }
  if (!reverse[edgeKey][target]) {
    reverse[edgeKey][target] = [];
  }
  reverse[edgeKey][target].push(source);
}

export function buildIndex(root: string, config: Config, options: IndexOptions = {}): Index {
  const tolerant = options.tolerant ?? config.index.tolerant;
  const nodes: Record<string, IndexNode> = {};
  const idsByWorkspace: Record<string, Set<string>> = {};
  const docFilesByAlias = listWorkspaceDocFilesByAlias(root, config);
  const workspaceAliases = Object.keys(docFilesByAlias).sort();

  for (const alias of workspaceAliases) {
    idsByWorkspace[alias] = new Set();
    const files = docFilesByAlias[alias];
    for (const filePath of files) {
      if (path.basename(filePath) === "core.md" && path.basename(path.dirname(filePath)) === "core") {
        continue;
      }
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const node = parseNode(content, filePath);

        if (idsByWorkspace[alias].has(node.id)) {
          throw new Error(`duplicate id ${node.id} in workspace ${alias}`);
        }
        idsByWorkspace[alias].add(node.id);

        const qid = `${alias}:${node.id}`;
        const relPath = path.relative(root, filePath);
        const normalizedEdges = normalizeEdges(node.edges, alias);

        nodes[qid] = {
          id: node.id,
          qid,
          ws: alias,
          type: node.type,
          title: node.title,
          status: node.status,
          priority: node.priority,
          created: node.created,
          updated: node.updated,
          tags: node.tags,
          owners: node.owners,
          links: node.links,
          artifacts: node.artifacts,
          refs: node.refs,
          aliases: node.aliases,
          path: relPath,
          edges: normalizedEdges,
        };
      } catch (err) {
        if (!tolerant) {
          throw err;
        }
      }
    }
  }

  const reverse_edges: Record<string, Record<string, string[]>> = {};
  for (const [qid, node] of Object.entries(nodes)) {
    const edges = node.edges;
    if (edges.epic) {
      addReverseEdge(reverse_edges, "epic", edges.epic, qid);
    }
    if (edges.parent) {
      addReverseEdge(reverse_edges, "parent", edges.parent, qid);
    }
    if (edges.prev) {
      addReverseEdge(reverse_edges, "prev", edges.prev, qid);
    }
    if (edges.next) {
      addReverseEdge(reverse_edges, "next", edges.next, qid);
    }
    for (const target of edges.relates) {
      addReverseEdge(reverse_edges, "relates", target, qid);
    }
    for (const target of edges.blocked_by) {
      addReverseEdge(reverse_edges, "blocked_by", target, qid);
    }
    for (const target of edges.blocks) {
      addReverseEdge(reverse_edges, "blocks", target, qid);
    }
  }

  for (const edgeKey of Object.keys(reverse_edges)) {
    for (const target of Object.keys(reverse_edges[edgeKey])) {
      reverse_edges[edgeKey][target].sort();
    }
  }

  const workspaces: Record<string, { path: string; enabled: boolean }> = {};
  for (const alias of Object.keys(config.workspaces).sort()) {
    const entry = config.workspaces[alias];
    workspaces[alias] = { path: entry.path, enabled: entry.enabled };
  }

  const index: Index = {
    meta: {
      tool: config.tool,
      schema_version: config.schema_version,
      generated_at: new Date().toISOString(),
      root,
      workspaces: workspaceAliases,
    },
    workspaces,
    nodes,
    reverse_edges,
  };

  validateGraph(index, { allowMissing: tolerant });
  return index;
}
