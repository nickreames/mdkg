import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { Index, IndexNode } from "../graph/indexer";
import { NotFoundError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { sortNodesForNext } from "../util/sort";
import { formatNodeCard } from "./node_card";

export type NextCommandOptions = {
  root: string;
  id?: string;
  ws?: string;
  noCache?: boolean;
  noReindex?: boolean;
};

const NEXT_TYPES = new Set(["feat", "task", "bug"]);
const NO_MATCH_MESSAGE =
  'no matching work items found; consider `mdkg new task "..."` or `mdkg new epic "..."`';

function normalizeWorkspace(value?: string): string | undefined {
  if (!value || value === "all") {
    return undefined;
  }
  return value;
}

function selectNextByPriority(
  index: Index,
  ws: string | undefined,
  statusPreference: string[],
  priorityMax: number
): IndexNode | undefined {
  const statusRanks = new Set(statusPreference);
  const candidates = Object.values(index.nodes).filter((node) => {
    if (ws && node.ws !== ws) {
      return false;
    }
    if (!NEXT_TYPES.has(node.type)) {
      return false;
    }
    if (!node.status) {
      return false;
    }
    if (!statusRanks.has(node.status)) {
      return false;
    }
    return true;
  });

  const sorted = sortNodesForNext(candidates, {
    statusPreference,
    priorityMax,
  });
  return sorted[0];
}

export function runNextCommand(options: NextCommandOptions): void {
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

  if (options.id) {
    const resolved = resolveQid(index, options.id, ws);
    if (resolved.status !== "ok") {
      throw new NotFoundError(formatResolveError("id", options.id, resolved, ws));
    }
    const node = index.nodes[resolved.qid];
    const nextQid = node.edges.next;
    if (nextQid && index.nodes[nextQid]) {
      console.log(formatNodeCard(index.nodes[nextQid]));
      return;
    }
  }

  const statusPreference = config.work.next.status_preference.map((status) => status.toLowerCase());
  const selected = selectNextByPriority(
    index,
    ws,
    statusPreference,
    config.work.priority_max
  );

  if (!selected) {
    console.error(NO_MATCH_MESSAGE);
    return;
  }

  console.log(formatNodeCard(selected));
}
