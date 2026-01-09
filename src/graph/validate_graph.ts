import { Index } from "./indexer";

export type ValidateGraphOptions = {
  allowMissing?: boolean;
};

export function validateGraph(index: Index, options: ValidateGraphOptions = {}): void {
  const allowMissing = options.allowMissing ?? false;
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
          throw new Error(`${qid}: ${edgeKey} references missing node ${value}`);
        }
      }
    }
  }
}
