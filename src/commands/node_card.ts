import { IndexNode } from "../graph/indexer";

function formatStatusPriority(node: IndexNode): string {
  const status = node.status ?? "-";
  const priority = node.priority === undefined ? "-" : `p${node.priority}`;
  return `${status}/${priority}`;
}

export function formatNodeCard(node: IndexNode): string {
  const sourceLabel = node.source?.imported
    ? ` | import:${node.source.import_alias}${node.source.stale ? ":stale" : ""} | read-only`
    : "";
  return [
    node.qid,
    node.type,
    formatStatusPriority(node),
    node.title,
    node.path,
  ].join(" | ") + sourceLabel;
}
