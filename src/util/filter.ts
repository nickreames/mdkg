import { IndexNode } from "../graph/indexer";

export type NodeFilters = {
  ws?: string;
  type?: string;
  status?: string;
  epic?: string;
  priority?: number;
  blocked?: boolean;
};

export function filterNodes(nodes: IndexNode[], filters: NodeFilters): IndexNode[] {
  return nodes.filter((node) => {
    if (filters.ws && node.ws !== filters.ws) {
      return false;
    }
    if (filters.type && node.type !== filters.type) {
      return false;
    }
    if (filters.status && node.status !== filters.status) {
      return false;
    }
    if (filters.epic && node.edges.epic !== filters.epic) {
      return false;
    }
    if (filters.priority !== undefined && node.priority !== filters.priority) {
      return false;
    }
    if (filters.blocked && node.status !== "blocked") {
      return false;
    }
    return true;
  });
}
