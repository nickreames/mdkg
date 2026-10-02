import { Index, IndexNode } from "./indexer";
import { parseIdentityRef } from "./identity";
import { resolveQid } from "../util/qid";

/** Resolve evidence where it was authored. An imported legacy qualifier must
 * not accidentally name a host-project node after the graph is mounted.
 */
export function workflowTarget(index: Index, source: IndexNode, field: string, type: string): string | undefined {
  const value = source.attributes[field];
  if (typeof value !== "string") return undefined;
  if (source.source?.imported && !parseIdentityRef(value)) {
    const normalized = value.toLowerCase(), owner = source.source;
    const candidates = Object.values(index.nodes).filter(node => node.type === type && node.source?.imported &&
      node.source.subgraph_alias === owner.subgraph_alias && (normalized.includes(":")
        ? node.source.original_qid === normalized || (Boolean(source.identity) && node.qid === normalized)
        : node.id === normalized && node.source.original_ws === owner.original_ws));
    return candidates.length === 1 ? candidates[0].qid : undefined;
  }
  const resolved = resolveQid(index, value, source.ws);
  return resolved.status === "ok" && index.nodes[resolved.qid]?.type === type ? resolved.qid : undefined;
}
