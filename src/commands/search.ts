import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { IndexNode } from "../graph/indexer";
import { filterNodes } from "../util/filter";
import { NotFoundError, UsageError } from "../util/errors";
import { sortNodesByQid } from "../util/sort";
import { formatNodeCard } from "./node_card";
import { toNodeSummaryJson, writeCount, writeJson } from "./query_output";

export type SearchCommandOptions = {
  root: string;
  query: string;
  ws?: string;
  type?: string;
  status?: string;
  tags?: string[];
  tagsMode?: "any" | "all";
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

function normalizeWorkspace(value?: string): string | undefined {
  if (!value || value === "all") {
    return undefined;
  }
  return value;
}

function buildSearchText(node: IndexNode): string {
  const tokens = [
    node.id,
    node.qid,
    node.title,
    node.path,
    ...node.tags,
    ...node.owners,
    ...node.links,
    ...node.artifacts,
    ...node.refs,
    ...node.aliases,
    ...node.skills,
  ];
  return tokens.join(" ").toLowerCase();
}

function matchesQuery(node: IndexNode, terms: string[]): boolean {
  const text = buildSearchText(node);
  for (const term of terms) {
    if (!text.includes(term)) {
      return false;
    }
  }
  return true;
}

export function runSearchCommand(options: SearchCommandOptions): void {
  const query = options.query.trim();
  if (!query) {
    throw new UsageError("search query cannot be empty");
  }

  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (ws && !config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const normalizedType = options.type?.toLowerCase();
  if (normalizedType === "skill") {
    throw new UsageError("--type skill is no longer supported here; use `mdkg skill search`");
  }

  const { index, rebuilt, stale } = loadIndex({
    root: options.root,
    config,
    useCache: !options.noCache,
    allowReindex: !options.noReindex,
  });

  if (stale && !rebuilt && !options.noCache) {
    console.error("warning: index is stale; run mdkg index to refresh");
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const nodeResults = filterNodes(Object.values(index.nodes), {
    ws,
    type: normalizedType,
    status: options.status,
    tags: options.tags,
    tagsMode: options.tagsMode,
  }).filter((node) => matchesQuery(node, terms));

  const sorted = sortNodesByQid(nodeResults);
  if (options.json) {
    writeJson({
      command: "search",
      kind: "node",
      count: sorted.length,
      items: sorted.map(toNodeSummaryJson),
    });
    return;
  }

  writeCount(
    sorted.length,
    sorted.length === 0 ? `no nodes matched query "${query}"` : undefined
  );
  for (const node of sorted) {
    console.log(formatNodeCard(node));
  }
}
