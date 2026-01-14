import fs from "fs";
import path from "path";
import { Index } from "../graph/indexer";
import { parseFrontmatter } from "../graph/frontmatter";
import { resolveQid } from "../util/qid";
import { orderPackNodes } from "./order";
import { readVerboseCoreList } from "./verbose_core";
import { PackBuildResult, PackNode, PackResult, PackTruncation } from "./types";

export type PackBuildOptions = {
  root: string;
  index: Index;
  rootQid: string;
  depth: number;
  edges: string[];
  verbose: boolean;
  maxNodes: number;
  verboseCoreListPath: string;
  wsHint?: string;
};

const EDGE_KEYS = ["parent", "epic", "relates", "blocked_by", "blocks", "prev", "next"] as const;

function normalizeEdgeList(edges: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const edge of edges) {
    const normalized = edge.trim().toLowerCase().replace(/-/g, "_");
    if (!EDGE_KEYS.includes(normalized as (typeof EDGE_KEYS)[number])) {
      continue;
    }
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

function getNeighbors(index: Index, qid: string, edges: string[]): string[] {
  const node = index.nodes[qid];
  if (!node) {
    return [];
  }
  const neighbors: string[] = [];
  for (const edge of edges) {
    switch (edge) {
      case "parent":
        if (node.edges.parent) {
          neighbors.push(node.edges.parent);
        }
        break;
      case "epic":
        if (node.edges.epic) {
          neighbors.push(node.edges.epic);
        }
        break;
      case "prev":
        if (node.edges.prev) {
          neighbors.push(node.edges.prev);
        }
        break;
      case "next":
        if (node.edges.next) {
          neighbors.push(node.edges.next);
        }
        break;
      case "relates":
        neighbors.push(...node.edges.relates);
        break;
      case "blocked_by":
        neighbors.push(...node.edges.blocked_by);
        break;
      case "blocks":
        neighbors.push(...node.edges.blocks);
        break;
      default:
        break;
    }
  }
  return neighbors;
}

function collectNodes(
  index: Index,
  rootQid: string,
  depth: number,
  edges: string[]
): { qids: Set<string>; depths: Map<string, number> } {
  const selectedEdges = normalizeEdgeList(edges);
  const visited = new Set<string>();
  const depths = new Map<string, number>();

  const queue: Array<{ qid: string; depth: number }> = [];
  queue.push({ qid: rootQid, depth: 0 });
  visited.add(rootQid);
  depths.set(rootQid, 0);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }
    if (current.depth >= depth) {
      continue;
    }
    const neighbors = getNeighbors(index, current.qid, selectedEdges);
    for (const neighbor of neighbors) {
      if (!index.nodes[neighbor]) {
        continue;
      }
      if (visited.has(neighbor)) {
        continue;
      }
      visited.add(neighbor);
      depths.set(neighbor, current.depth + 1);
      queue.push({ qid: neighbor, depth: current.depth + 1 });
    }
  }

  return { qids: visited, depths };
}

function buildPackNode(root: string, index: Index, qid: string): PackNode {
  const node = index.nodes[qid];
  if (!node) {
    throw new Error(`node not found: ${qid}`);
  }

  const filePath = path.resolve(root, node.path);
  if (!fs.existsSync(filePath)) {
    throw new Error(`file not found for ${qid}: ${node.path}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const body = parseFrontmatter(content, filePath).body.trimEnd();

  return {
    qid: node.qid,
    id: node.id,
    workspace: node.ws,
    type: node.type,
    title: node.title,
    status: node.status,
    priority: node.priority,
    path: node.path,
    links: node.links,
    artifacts: node.artifacts,
    refs: node.refs,
    aliases: node.aliases,
    body,
  };
}

function mergeWarnings(warnings: string[], message: string): void {
  warnings.push(message);
}

function applyMaxNodes(
  orderedQids: string[],
  maxNodes: number,
  truncation: PackTruncation
): { included: string[]; dropped: string[] } {
  if (maxNodes <= 0 || orderedQids.length <= maxNodes) {
    return { included: orderedQids, dropped: [] };
  }

  const included = orderedQids.slice(0, maxNodes);
  const dropped = orderedQids.slice(maxNodes);
  truncation.max_nodes = true;
  truncation.dropped.push(...dropped);
  return { included, dropped };
}

export function buildPack(options: PackBuildOptions): PackBuildResult {
  const warnings: string[] = [];
  const { qids, depths } = collectNodes(
    options.index,
    options.rootQid,
    options.depth,
    options.edges
  );

  if (options.verbose) {
    const coreIds = readVerboseCoreList(options.verboseCoreListPath);
    for (const id of coreIds) {
      const resolved = resolveQid(options.index, id, options.wsHint);
      if (resolved.status === "ok") {
        qids.add(resolved.qid);
      } else if (resolved.status === "ambiguous") {
        mergeWarnings(warnings, `verbose core id ambiguous: ${id}`);
      } else {
        mergeWarnings(warnings, `verbose core id missing: ${id}`);
      }
    }
  }

  const ordered = orderPackNodes(options.index, options.rootQid, Array.from(qids), depths);

  const truncation: PackTruncation = {
    max_nodes: false,
    max_bytes: false,
    dropped: [],
  };

  const { included } = applyMaxNodes(ordered, options.maxNodes, truncation);

  const nodes: PackNode[] = included.map((qid) => buildPackNode(options.root, options.index, qid));

  const pack: PackResult = {
    meta: {
      root: options.rootQid,
      depth: options.depth,
      verbose: options.verbose,
      generated_at: new Date().toISOString(),
      node_count: nodes.length,
      truncated: truncation,
    },
    nodes,
  };

  return { pack, warnings };
}
