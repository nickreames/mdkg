import { Index, IndexNode } from "./indexer";
import { GOAL_SCOPE_ACTIONABLE_TYPES } from "./goal_scope";
import { resolveQid } from "../util/qid";
import { sortNodesForNext } from "../util/sort";
import { dependencyIsComplete } from "./checkpoint_readiness";

const CONCRETE_GOAL_NEXT_TYPES = new Set(["feat", "task", "bug", "test", "spike"]);

export type GoalNextSelectionOptions = {
  index: Index;
  goal: IndexNode;
  actionableQids: Set<string>;
  activeNode?: string;
  strategy: string;
  statusPreference: string[];
  priorityMax: number;
};

export type GoalNextSelection = {
  node?: IndexNode;
  warnings: string[];
};

type LinearComponent = {
  qids: Set<string>;
  orderedQids?: string[];
};

export function isGoalNextCandidate(node: IndexNode, statusRanks: Set<string>): boolean {
  if (node.source?.imported) {
    return false;
  }
  if (!CONCRETE_GOAL_NEXT_TYPES.has(node.type) || !GOAL_SCOPE_ACTIONABLE_TYPES.has(node.type)) {
    return false;
  }
  if (!node.status || !statusRanks.has(node.status)) {
    return false;
  }
  return node.status !== "done" && node.status !== "archived";
}

function unresolvedBlockerQids(index: Index, node: IndexNode): string[] {
  return node.edges.blocked_by.filter((qid) => !dependencyIsComplete(index.nodes[qid]));
}

function blockerWarnings(index: Index, candidates: IndexNode[]): string[] {
  const warnings: string[] = [];
  const seen = new Set<string>();
  for (const node of [...candidates].sort((a, b) => a.qid.localeCompare(b.qid))) {
    for (const blockerQid of unresolvedBlockerQids(index, node)) {
      const blocker = index.nodes[blockerQid];
      let warning: string | undefined;
      if (!blocker) {
        warning = `${node.qid} is blocked by missing node ${blockerQid}; repair the blocker reference before claiming local work`;
      } else if (blocker.source?.imported) {
        warning = `${node.qid} is blocked by read-only subgraph node ${blocker.qid}; update the source workspace for subgraph ${blocker.source.subgraph_alias} or refresh the subgraph bundle before claiming local work`;
      }
      if (warning && !seen.has(warning)) {
        seen.add(warning);
        warnings.push(warning);
      }
    }
  }
  return warnings;
}

function localScopeNodes(index: Index, actionableQids: Set<string>): Map<string, IndexNode> {
  const nodes = new Map<string, IndexNode>();
  for (const qid of [...actionableQids].sort()) {
    const node = index.nodes[qid];
    if (!node || node.source?.imported || !GOAL_SCOPE_ACTIONABLE_TYPES.has(node.type)) {
      continue;
    }
    nodes.set(qid, node);
  }
  return nodes;
}

function addEdge(
  from: string,
  to: string,
  nodes: Map<string, IndexNode>,
  outgoing: Map<string, Set<string>>,
  incoming: Map<string, Set<string>>
): void {
  if (from === to || !nodes.has(from) || !nodes.has(to)) {
    return;
  }
  const next = outgoing.get(from) ?? new Set<string>();
  next.add(to);
  outgoing.set(from, next);
  const previous = incoming.get(to) ?? new Set<string>();
  previous.add(from);
  incoming.set(to, previous);
}

function chainComponents(nodes: Map<string, IndexNode>): LinearComponent[] {
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();
  for (const node of nodes.values()) {
    if (node.edges.next) {
      addEdge(node.qid, node.edges.next, nodes, outgoing, incoming);
    }
    if (node.edges.prev) {
      addEdge(node.edges.prev, node.qid, nodes, outgoing, incoming);
    }
  }

  const linkedQids = new Set<string>();
  for (const [qid, targets] of outgoing) {
    if (targets.size > 0) {
      linkedQids.add(qid);
      for (const target of targets) {
        linkedQids.add(target);
      }
    }
  }

  const components: LinearComponent[] = [];
  const visited = new Set<string>();
  for (const start of [...linkedQids].sort()) {
    if (visited.has(start)) {
      continue;
    }
    const qids = new Set<string>();
    const queue = [start];
    while (queue.length > 0) {
      const qid = queue.shift();
      if (!qid || visited.has(qid)) {
        continue;
      }
      visited.add(qid);
      qids.add(qid);
      const neighbors = new Set([
        ...(outgoing.get(qid) ?? []),
        ...(incoming.get(qid) ?? []),
      ]);
      for (const neighbor of [...neighbors].sort()) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    const ambiguous = [...qids].some(
      (qid) => (outgoing.get(qid)?.size ?? 0) > 1 || (incoming.get(qid)?.size ?? 0) > 1
    );
    if (ambiguous) {
      components.push({ qids });
      continue;
    }

    const roots = [...qids].filter((qid) => (incoming.get(qid)?.size ?? 0) === 0).sort();
    if (roots.length !== 1) {
      components.push({ qids });
      continue;
    }

    const orderedQids: string[] = [];
    const walked = new Set<string>();
    let current: string | undefined = roots[0];
    while (current && !walked.has(current)) {
      walked.add(current);
      orderedQids.push(current);
      const targets: string[] = Array.from(outgoing.get(current) ?? []);
      current = targets[0];
    }
    components.push(walked.size === qids.size ? { qids, orderedQids } : { qids });
  }
  return components;
}

function chainThenPriorityCandidates(
  index: Index,
  actionableQids: Set<string>,
  candidates: IndexNode[],
  blockerEligibleQids: Set<string>
): IndexNode[] {
  const candidateByQid = new Map(candidates.map((node) => [node.qid, node]));
  const available = new Map(
    candidates
      .filter((node) => blockerEligibleQids.has(node.qid))
      .map((node) => [node.qid, node])
  );

  for (const component of chainComponents(localScopeNodes(index, actionableQids))) {
    const componentCandidates = [...component.qids].filter((qid) => candidateByQid.has(qid));
    if (componentCandidates.length === 0 || !component.orderedQids) {
      continue;
    }
    for (const qid of componentCandidates) {
      available.delete(qid);
    }
    const frontierQid = component.orderedQids.find((qid) => candidateByQid.has(qid));
    if (frontierQid && blockerEligibleQids.has(frontierQid)) {
      available.set(frontierQid, candidateByQid.get(frontierQid)!);
    }
  }

  return [...available.values()];
}

export function selectGoalNextCandidate(options: GoalNextSelectionOptions): GoalNextSelection {
  const statusPreference = options.statusPreference.map((status) => status.toLowerCase());
  const statusRanks = new Set(statusPreference);
  const candidates = [...options.actionableQids]
    .sort()
    .map((qid) => options.index.nodes[qid])
    .filter((node): node is IndexNode => Boolean(node))
    .filter((node) => isGoalNextCandidate(node, statusRanks));
  const warnings = blockerWarnings(options.index, candidates);

  if (options.activeNode) {
    const resolved = resolveQid(options.index, options.activeNode, options.goal.ws);
    const active = resolved.status === "ok" ? options.index.nodes[resolved.qid] : undefined;
    if (active && options.actionableQids.has(active.qid)) {
      if (active.status === "done") {
        // A completed active node is an expected chain transition.
      } else if (isGoalNextCandidate(active, statusRanks)) {
        const blockers = unresolvedBlockerQids(options.index, active);
        if (blockers.length === 0) {
          return { node: active, warnings };
        }
        warnings.push(`active_node is blocked by unresolved dependencies: ${blockers.join(", ")}`);
      } else {
        warnings.push(`active_node is not an actionable local concrete item: ${options.activeNode}`);
      }
    } else {
      warnings.push(`active_node is not an actionable local concrete item: ${options.activeNode}`);
    }
  }

  const blockerEligibleQids = new Set(
    candidates
      .filter((node) => unresolvedBlockerQids(options.index, node).length === 0)
      .map((node) => node.qid)
  );
  const eligible = options.strategy === "chain_then_priority"
    ? chainThenPriorityCandidates(
        options.index,
        options.actionableQids,
        candidates,
        blockerEligibleQids
      )
    : candidates.filter((node) => blockerEligibleQids.has(node.qid));
  const selected = sortNodesForNext(eligible, {
    statusPreference,
    priorityMax: options.priorityMax,
  })[0];
  return { node: selected, warnings };
}
