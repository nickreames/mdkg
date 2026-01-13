import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { filterNodes } from "../util/filter";
import { NotFoundError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { sortNodesByQid } from "../util/sort";
import { formatNodeCard } from "./node_card";

export type ListCommandOptions = {
  root: string;
  ws?: string;
  type?: string;
  status?: string;
  epic?: string;
  priority?: number;
  blocked?: boolean;
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
    type: options.type,
    status: options.status,
    epic: epicQid,
    priority: options.priority,
    blocked: options.blocked,
  });

  const sorted = sortNodesByQid(filtered);
  for (const node of sorted) {
    console.log(formatNodeCard(node));
  }
}
