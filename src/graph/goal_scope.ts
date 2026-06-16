import type { Index, IndexNode } from "./indexer";
import { resolveQid } from "../util/qid";

export const GOAL_SCOPE_CONTAINER_TYPES = new Set(["epic", "feat"]);
export const GOAL_SCOPE_ACTIONABLE_TYPES = new Set(["feat", "task", "bug", "test", "spike"]);
export const GOAL_SCOPE_ALLOWED_TYPES = new Set([
  ...GOAL_SCOPE_CONTAINER_TYPES,
  ...GOAL_SCOPE_ACTIONABLE_TYPES,
]);

export type GoalScopeResult = {
  rootQids: string[];
  qids: Set<string>;
  actionableQids: Set<string>;
  missingRefs: string[];
  invalidRefs: string[];
};

export type GoalScopeOptions = {
  includeCompatibilityRefs?: boolean;
};

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export function goalScopeRefs(goal: IndexNode): string[] {
  return toStringList(goal.attributes.scope_refs);
}

function resolveGoalScopeRef(index: Index, value: string, ws: string): string | undefined {
  const resolved = resolveQid(index, value, ws);
  return resolved.status === "ok" ? resolved.qid : undefined;
}

function addIfPresent(values: Set<string>, value: string | undefined): void {
  if (value) {
    values.add(value);
  }
}

function collectDirectCompatibilityRefs(index: Index, goal: IndexNode): Set<string> {
  const qids = new Set<string>();
  const edges = goal.edges;
  addIfPresent(qids, edges.next);
  addIfPresent(qids, edges.prev);
  addIfPresent(qids, edges.parent);
  addIfPresent(qids, edges.epic);
  for (const value of edges.relates) {
    qids.add(value);
  }
  for (const value of edges.blocks) {
    qids.add(value);
  }
  for (const value of edges.blocked_by) {
    qids.add(value);
  }

  for (const node of Object.values(index.nodes)) {
    if (
      node.edges.parent === goal.qid ||
      node.edges.epic === goal.qid ||
      node.edges.prev === goal.qid ||
      node.edges.next === goal.qid ||
      node.edges.relates.includes(goal.qid) ||
      node.edges.blocked_by.includes(goal.qid) ||
      node.edges.blocks.includes(goal.qid)
    ) {
      qids.add(node.qid);
    }
  }
  return qids;
}

function descendantQids(index: Index, qid: string): string[] {
  const byEpic = index.reverse_edges.epic?.[qid] ?? [];
  const byParent = index.reverse_edges.parent?.[qid] ?? [];
  return [...new Set([...byEpic, ...byParent])].sort();
}

export function collectGoalScope(
  index: Index,
  goal: IndexNode,
  options: GoalScopeOptions = {}
): GoalScopeResult {
  const includeCompatibilityRefs = options.includeCompatibilityRefs ?? true;
  const rootQids: string[] = [];
  const qids = new Set<string>();
  const actionableQids = new Set<string>();
  const missingRefs: string[] = [];
  const invalidRefs: string[] = [];
  const queued = new Set<string>();
  const queue: string[] = [];

  function enqueue(qid: string): void {
    if (queued.has(qid)) {
      return;
    }
    queued.add(qid);
    queue.push(qid);
  }

  for (const ref of goalScopeRefs(goal)) {
    const resolved = resolveGoalScopeRef(index, ref, goal.ws);
    if (!resolved) {
      missingRefs.push(ref);
      continue;
    }
    rootQids.push(resolved);
    enqueue(resolved);
  }

  if (includeCompatibilityRefs) {
    for (const qid of collectDirectCompatibilityRefs(index, goal)) {
      rootQids.push(qid);
      enqueue(qid);
    }
  }

  while (queue.length > 0) {
    const qid = queue.shift();
    if (!qid) {
      break;
    }
    const node = index.nodes[qid];
    if (!node) {
      continue;
    }
    if (!GOAL_SCOPE_ALLOWED_TYPES.has(node.type)) {
      invalidRefs.push(qid);
      continue;
    }
    qids.add(qid);
    if (GOAL_SCOPE_ACTIONABLE_TYPES.has(node.type)) {
      actionableQids.add(qid);
    }
    if (GOAL_SCOPE_CONTAINER_TYPES.has(node.type)) {
      for (const childQid of descendantQids(index, qid)) {
        enqueue(childQid);
      }
    }
  }

  rootQids.sort();
  return {
    rootQids: [...new Set(rootQids)],
    qids,
    actionableQids,
    missingRefs,
    invalidRefs: [...new Set(invalidRefs)].sort(),
  };
}
