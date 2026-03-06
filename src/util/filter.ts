import { IndexNode } from "../graph/indexer";

export type NodeFilters = {
  ws?: string;
  type?: string;
  status?: string;
  epic?: string;
  priority?: number;
  blocked?: boolean;
  tags?: string[];
  tagsMode?: "any" | "all";
};

function matchesTags(
  nodeTags: string[],
  filterTags: string[] | undefined,
  mode: "any" | "all"
): boolean {
  if (!filterTags || filterTags.length === 0) {
    return true;
  }
  if (nodeTags.length === 0) {
    return false;
  }
  const nodeSet = new Set(nodeTags.map((value) => value.toLowerCase()));
  if (mode === "all") {
    return filterTags.every((value) => nodeSet.has(value));
  }
  return filterTags.some((value) => nodeSet.has(value));
}

export function filterNodes(nodes: IndexNode[], filters: NodeFilters): IndexNode[] {
  const normalizedTags = filters.tags?.map((value) => value.toLowerCase()).filter(Boolean) ?? [];
  const tagsMode = filters.tagsMode ?? "any";

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
    if (!matchesTags(node.tags, normalizedTags, tagsMode)) {
      return false;
    }
    return true;
  });
}
