import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { IndexNode } from "../graph/indexer";
import { filterNodes } from "../util/filter";
import { NotFoundError, UsageError } from "../util/errors";
import { sortNodesByQid } from "../util/sort";
import { formatNodeCard } from "./node_card";
import {
  QueryOutputFormat,
  toNodeSummaryJson,
  writeCount,
  writeStructuredOutput,
} from "./query_output";

export type SearchCommandOptions = {
  root: string;
  query: string;
  ws?: string;
  type?: string;
  status?: string;
  tags?: string[];
  tagsMode?: "any" | "all";
  limit?: number;
  format?: QueryOutputFormat;
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

const DEFAULT_STRUCTURED_SEARCH_LIMIT = 50;

function normalizeWorkspace(value?: string): string | undefined {
  if (!value || value === "all") {
    return undefined;
  }
  return value;
}

function buildSearchText(node: IndexNode): string {
  const attributeTokens = Object.entries(node.attributes ?? {}).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, ...value];
    }
    return [key, String(value)];
  });
  const tokens = [
    node.id,
    node.qid,
    node.type,
    node.title,
    node.path,
    ...node.tags,
    ...node.owners,
    ...node.links,
    ...node.artifacts,
    ...node.refs,
    ...node.aliases,
    ...node.skills,
    ...attributeTokens,
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
  if (ws && !config.workspaces[ws] && !config.subgraphs[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const normalizedType = options.type?.toLowerCase();
  if (normalizedType === "skill") {
    throw new UsageError("--type skill is no longer supported here; use `mdkg skill search`");
  }

  const { index, rebuilt, stale, warnings } = loadIndex({
    root: options.root,
    config,
    useCache: !options.noCache,
    allowReindex: !options.noReindex,
  });

  if (stale && !rebuilt && !options.noCache) {
    console.error("warning: index is stale; run mdkg index to refresh");
  }
  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
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
  const format = options.format ?? (options.json ? "json" : undefined);
  if (format) {
    const limit = options.limit ?? DEFAULT_STRUCTURED_SEARCH_LIMIT;
    if (!Number.isInteger(limit) || limit < 1) {
      throw new UsageError("--limit must be a positive integer");
    }
    const items = sorted.slice(0, limit);
    writeStructuredOutput({
      command: "search",
      kind: "node",
      count: sorted.length,
      returned_count: items.length,
      limit,
      truncated: items.length < sorted.length,
      items: items.map(toNodeSummaryJson),
    }, format);
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
