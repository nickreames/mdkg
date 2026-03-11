import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { filterNodes } from "../util/filter";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { sortNodesByQid } from "../util/sort";
import { formatNodeCard } from "./node_card";
import { toNodeSummaryJson, writeCount, writeJson } from "./query_output";

export type ListCommandOptions = {
  root: string;
  ws?: string;
  type?: string;
  status?: string;
  epic?: string;
  priority?: number;
  blocked?: boolean;
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

export function runListCommand(options: ListCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (ws && !config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const normalizedType = options.type?.toLowerCase();

  if (normalizedType === "skill") {
    throw new UsageError("--type skill is no longer supported here; use `mdkg skill list`");
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

  let epicQid: string | undefined;
  if (options.epic) {
    const resolved = resolveQid(index, options.epic, ws);
    if (resolved.status !== "ok") {
      throw new NotFoundError(formatResolveError("epic", options.epic, resolved, ws));
    }
    epicQid = resolved.qid;
  }

  const filtered = filterNodes(Object.values(index.nodes), {
    ws,
    type: normalizedType,
    status: options.status,
    epic: epicQid,
    priority: options.priority,
    blocked: options.blocked,
    tags: options.tags,
    tagsMode: options.tagsMode,
  });

  const sorted = sortNodesByQid(filtered);
  if (options.json) {
    writeJson({
      command: "list",
      kind: "node",
      count: sorted.length,
      items: sorted.map(toNodeSummaryJson),
    });
    return;
  }

  writeCount(sorted.length, sorted.length === 0 ? "no nodes matched current filters" : undefined);
  for (const node of sorted) {
    console.log(formatNodeCard(node));
  }
}
