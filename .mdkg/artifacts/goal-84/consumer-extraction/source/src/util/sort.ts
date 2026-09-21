import { IndexNode } from "../graph/indexer";

export function sortNodesByQid<T extends { qid: string }>(nodes: T[]): T[] {
  return [...nodes].sort((a, b) => a.qid.localeCompare(b.qid));
}

export type NextSortOptions = {
  statusPreference: string[];
  priorityMax: number;
};

function rankPriority(node: IndexNode, priorityMax: number): number {
  return node.priority === undefined ? priorityMax + 1 : node.priority;
}

function rankStatus(node: IndexNode, statusRanks: Map<string, number>): number {
  if (!node.status) {
    return statusRanks.size;
  }
  return statusRanks.get(node.status) ?? statusRanks.size;
}

export function sortNodesForNext(nodes: IndexNode[], options: NextSortOptions): IndexNode[] {
  const statusRanks = new Map(
    options.statusPreference.map((status, index) => [status, index])
  );

  return [...nodes].sort((a, b) => {
    const priorityA = rankPriority(a, options.priorityMax);
    const priorityB = rankPriority(b, options.priorityMax);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const statusA = rankStatus(a, statusRanks);
    const statusB = rankStatus(b, statusRanks);
    if (statusA !== statusB) {
      return statusA - statusB;
    }

    return a.qid.localeCompare(b.qid);
  });
}

export function sortIndexNodes(nodes: Record<string, IndexNode>): Record<string, IndexNode> {
  const sorted: Record<string, IndexNode> = {};
  for (const qid of Object.keys(nodes).sort()) {
    sorted[qid] = nodes[qid];
  }
  return sorted;
}
