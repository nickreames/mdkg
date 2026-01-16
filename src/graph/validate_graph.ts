import { Index } from "./indexer";

export type ValidateGraphOptions = {
  allowMissing?: boolean;
};

function pushError(errors: string[] | null, message: string): void {
  if (errors) {
    errors.push(message);
    return;
  }
  throw new Error(message);
}

function validateEdgeTargets(
  index: Index,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const nodes = index.nodes;
  for (const [qid, node] of Object.entries(nodes)) {
    const edges = node.edges;
    const edgeLists: Array<[string, string[]]> = [
      ["relates", edges.relates],
      ["blocked_by", edges.blocked_by],
      ["blocks", edges.blocks],
    ];

    if (edges.epic) {
      edgeLists.push(["epic", [edges.epic]]);
    }
    if (edges.parent) {
      edgeLists.push(["parent", [edges.parent]]);
    }
    if (edges.prev) {
      edgeLists.push(["prev", [edges.prev]]);
    }
    if (edges.next) {
      edgeLists.push(["next", [edges.next]]);
    }

    for (const [edgeKey, values] of edgeLists) {
      for (const value of values) {
        if (!nodes[value]) {
          if (allowMissing) {
            continue;
          }
          pushError(errors, `${qid}: ${edgeKey} references missing node ${value}`);
        }
      }
    }
  }
}

function validatePrevNextSymmetry(index: Index, _allowMissing: boolean, errors: string[] | null): void {
  const nodes = index.nodes;
  for (const [qid, node] of Object.entries(nodes)) {
    const edges = node.edges;
    if (edges.next) {
      const target = nodes[edges.next];
      if (!target) {
        continue;
      }
      if (target.edges.prev !== qid) {
        pushError(errors, `${qid}: next ${edges.next} missing matching prev`);
      }
    }
    if (edges.prev) {
      const target = nodes[edges.prev];
      if (!target) {
        continue;
      }
      if (target.edges.next !== qid) {
        pushError(errors, `${qid}: prev ${edges.prev} missing matching next`);
      }
    }
  }
}

function detectPrevNextCycles(index: Index, errors: string[] | null): void {
  const nodes = index.nodes;
  const seen = new Set<string>();

  for (const start of Object.keys(nodes)) {
    if (seen.has(start)) {
      continue;
    }
    const path = new Map<string, number>();
    let current: string | undefined = start;
    while (current) {
      if (seen.has(current)) {
        break;
      }
      if (path.has(current)) {
        const entries = Array.from(path.keys());
        const cycleStart = path.get(current) ?? 0;
        const cycle = entries.slice(cycleStart);
        cycle.push(current);
        pushError(errors, `cycle detected in prev/next chain: ${cycle.join(" -> ")}`);
        break;
      }
      path.set(current, path.size);
      const nextQid: string | undefined = nodes[current]?.edges.next;
      if (!nextQid || !nodes[nextQid]) {
        break;
      }
      current = nextQid;
    }
    for (const visited of path.keys()) {
      seen.add(visited);
    }
  }
}

export function collectGraphErrors(index: Index, options: ValidateGraphOptions = {}): string[] {
  const errors: string[] = [];
  const allowMissing = options.allowMissing ?? false;
  validateEdgeTargets(index, allowMissing, errors);
  validatePrevNextSymmetry(index, allowMissing, errors);
  detectPrevNextCycles(index, errors);
  return errors;
}

export function validateGraph(index: Index, options: ValidateGraphOptions = {}): void {
  const errors = collectGraphErrors(index, options);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }
}
