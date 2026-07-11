import { Index } from "../graph/indexer";
import { collectGoalScope } from "../graph/goal_scope";
import { readNodeBody } from "../graph/node_body";
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
  includeLatestCheckpoint?: boolean;
};

const EDGE_KEYS = ["parent", "epic", "relates", "blocked_by", "blocks", "prev", "next", "context_refs", "evidence_refs"] as const;
const LOOP_REF_FIELDS = [
  "scope_refs",
  "child_refs",
  "lane_waiver_refs",
  "run_refs",
  "decision_refs",
  "output_refs",
  "approval_refs",
  "evaluation_refs",
] as const;
const LOOP_REVERSE_CHILD_EDGES = ["parent", "epic", "relates"] as const;

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
      case "context_refs":
        neighbors.push(...(node.edges.context_refs ?? []));
        break;
      case "evidence_refs":
        neighbors.push(...(node.edges.evidence_refs ?? []));
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

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function isUriRef(value: string): boolean {
  return value.includes("://");
}

function resolveLoopGraphRef(
  index: Index,
  loopQid: string,
  field: string,
  ref: string,
  wsHint: string,
  warnings: string[]
): string | undefined {
  if (isUriRef(ref)) {
    return undefined;
  }
  const resolved = resolveQid(index, ref, wsHint);
  if (resolved.status === "ok") {
    return resolved.qid;
  }
  if (resolved.status === "ambiguous") {
    mergeWarnings(
      warnings,
      `loop scope ref ambiguous: ${loopQid} ${field} ${ref} (${resolved.candidates.join(", ")})`
    );
    return undefined;
  }
  mergeWarnings(warnings, `loop scope ref missing: ${loopQid} ${field} ${ref}`);
  return undefined;
}

function addLoopPackClosure(
  index: Index,
  rootLoopQid: string,
  qids: Set<string>,
  depths: Map<string, number>,
  warnings: string[]
): void {
  const visited = new Set<string>();
  const queued = new Set<string>();
  const queue: Array<{ qid: string; depth: number }> = [];

  function enqueue(qid: string, depth: number): void {
    if (queued.has(qid)) {
      return;
    }
    queued.add(qid);
    queue.push({ qid, depth });
  }

  function addDeclaredLoopRefs(loopQid: string, depth: number): void {
    const loop = index.nodes[loopQid];
    if (!loop) {
      return;
    }
    for (const field of LOOP_REF_FIELDS) {
      for (const ref of toStringList(loop.attributes[field])) {
        const resolved = resolveLoopGraphRef(index, loop.qid, field, ref, loop.ws, warnings);
        if (resolved) {
          enqueue(resolved, depth);
        }
      }
    }
  }

  function addReverseChildren(qid: string, depth: number): void {
    for (const edge of LOOP_REVERSE_CHILD_EDGES) {
      for (const childQid of index.reverse_edges[edge]?.[qid] ?? []) {
        enqueue(childQid, depth);
      }
    }
  }

  function addSemanticEdges(loopQid: string, depth: number): void {
    const loop = index.nodes[loopQid];
    if (!loop) {
      return;
    }
    for (const field of ["context_refs", "evidence_refs"] as const) {
      for (const ref of loop.edges[field] ?? []) {
        if (index.nodes[ref]) {
          enqueue(ref, depth);
        } else if (!isUriRef(ref)) {
          mergeWarnings(warnings, `loop scope ref missing: ${loop.qid} ${field} ${ref}`);
        }
      }
    }
  }

  addDeclaredLoopRefs(rootLoopQid, 1);
  addSemanticEdges(rootLoopQid, 1);
  addReverseChildren(rootLoopQid, 1);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.qid)) {
      continue;
    }
    visited.add(current.qid);
    const node = index.nodes[current.qid];
    if (!node) {
      continue;
    }
    qids.add(current.qid);
    if (!depths.has(current.qid)) {
      depths.set(current.qid, current.depth);
    }

    if (node.type === "goal") {
      const scoped = collectGoalScope(index, node);
      for (const scopedQid of scoped.qids) {
        enqueue(scopedQid, current.depth + 1);
      }
      for (const missing of scoped.missingRefs) {
        mergeWarnings(warnings, `loop goal scope ref missing: ${node.qid} ${missing}`);
      }
      for (const invalid of scoped.invalidRefs) {
        mergeWarnings(warnings, `loop goal scope ref unsupported: ${node.qid} ${invalid}`);
      }
    }

    if (node.type === "loop") {
      addDeclaredLoopRefs(node.qid, current.depth + 1);
      addSemanticEdges(node.qid, current.depth + 1);
      addReverseChildren(node.qid, current.depth + 1);
    }

    if (node.type === "epic" || node.type === "feat") {
      addReverseChildren(node.qid, current.depth + 1);
    }
  }
}

function buildPackNode(root: string, index: Index, qid: string): PackNode {
  const node = index.nodes[qid];
  if (!node) {
    throw new Error(`node not found: ${qid}`);
  }

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
    context_refs: node.edges.context_refs ?? [],
    evidence_refs: node.edges.evidence_refs ?? [],
    aliases: node.aliases,
    attributes: node.attributes ?? {},
    ...(node.source ? { source: node.source } : {}),
    body: readNodeBody(root, node),
  };
}

function mergeWarnings(warnings: string[], message: string): void {
  warnings.push(message);
}

function checkpointWorkspaceFromQid(qid: string): string {
  const [workspace] = qid.split(":");
  return workspace ?? "root";
}

function resolveLatestCheckpointQid(index: Index, workspace: string): string | undefined {
  const candidates = Object.values(index.nodes)
    .filter((node) => node.ws === workspace && node.type === "checkpoint")
    .sort((a, b) => {
      if (a.updated !== b.updated) {
        return b.updated.localeCompare(a.updated);
      }
      if (a.created !== b.created) {
        return b.created.localeCompare(a.created);
      }
      return b.qid.localeCompare(a.qid);
    });
  return candidates[0]?.qid;
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
  const includeLatestCheckpoint = options.includeLatestCheckpoint ?? true;
  const { qids, depths } = collectNodes(
    options.index,
    options.rootQid,
    options.depth,
    options.edges
  );
  const rootNode = options.index.nodes[options.rootQid];
  if (rootNode?.type === "goal") {
    const scoped = collectGoalScope(options.index, rootNode);
    for (const qid of scoped.qids) {
      qids.add(qid);
      if (!depths.has(qid)) {
        depths.set(qid, 1);
      }
    }
    for (const missing of scoped.missingRefs) {
      mergeWarnings(warnings, `goal scope ref missing: ${missing}`);
    }
    for (const invalid of scoped.invalidRefs) {
      mergeWarnings(warnings, `goal scope ref unsupported: ${invalid}`);
    }
  }
  if (rootNode?.type === "loop") {
    addLoopPackClosure(options.index, rootNode.qid, qids, depths, warnings);
  }

  const workspace = checkpointWorkspaceFromQid(options.rootQid);
  const latestCheckpointHint = options.index.meta.latest_checkpoint_qid?.[workspace];
  const latestCheckpointResolved = includeLatestCheckpoint
    ? resolveLatestCheckpointQid(options.index, workspace)
    : undefined;
  if (latestCheckpointResolved && latestCheckpointResolved !== options.rootQid) {
    qids.add(latestCheckpointResolved);
  }
  if (
    includeLatestCheckpoint &&
    latestCheckpointHint &&
    latestCheckpointResolved &&
    latestCheckpointHint !== latestCheckpointResolved
  ) {
    mergeWarnings(
      warnings,
      `latest_checkpoint_qid hint mismatch for ${workspace}: ${latestCheckpointHint} -> ${latestCheckpointResolved}`
    );
  }

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
      latest_checkpoint_qid: latestCheckpointResolved,
      latest_checkpoint_qid_hint: latestCheckpointHint,
      truncated: truncation,
    },
    nodes,
  };

  return { pack, warnings };
}
