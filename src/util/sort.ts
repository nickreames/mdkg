import { IndexNode } from "../graph/indexer";

export function sortNodesByQid<T extends { qid: string }>(nodes: T[]): T[] {
  return [...nodes].sort((a, b) => a.qid.localeCompare(b.qid));
}

export function sortIndexNodes(nodes: Record<string, IndexNode>): Record<string, IndexNode> {
  const sorted: Record<string, IndexNode> = {};
  for (const qid of Object.keys(nodes).sort()) {
    sorted[qid] = nodes[qid];
  }
  return sorted;
}
