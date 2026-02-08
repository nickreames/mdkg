import { PackNode, PackResult, PackStats, PackStatsNode } from "./types";

export function countLines(text: string): number {
  if (text.length === 0) {
    return 0;
  }
  return text.split(/\r?\n/).length;
}

export function estimateTokensFromChars(chars: number): number {
  if (chars <= 0) {
    return 0;
  }
  return Math.ceil(chars / 4);
}

export function renderNodeMetricsText(node: PackNode): string {
  const lines: string[] = [];
  lines.push(`qid: ${node.qid}`);
  lines.push(`id: ${node.id}`);
  lines.push(`workspace: ${node.workspace}`);
  lines.push(`type: ${node.type}`);
  lines.push(`title: ${node.title}`);
  if (node.status) {
    lines.push(`status: ${node.status}`);
  }
  if (node.priority !== undefined) {
    lines.push(`priority: ${node.priority}`);
  }
  lines.push(`path: ${node.path}`);
  lines.push(`links: ${node.links.join(",")}`);
  lines.push(`artifacts: ${node.artifacts.join(",")}`);
  lines.push(`refs: ${node.refs.join(",")}`);
  lines.push(`aliases: ${node.aliases.join(",")}`);
  if (node.body.length > 0) {
    lines.push("");
    lines.push(node.body);
  }
  return lines.join("\n");
}

export function measureNode(node: PackNode): PackStatsNode {
  const rendered = renderNodeMetricsText(node);
  const chars = rendered.length;
  const lines = countLines(rendered);
  const bytes = Buffer.byteLength(rendered, "utf8");
  return {
    qid: node.qid,
    chars,
    lines,
    bytes,
    tokens_estimate: estimateTokensFromChars(chars),
  };
}

export function measurePack(pack: PackResult): PackStats {
  const nodes = pack.nodes.map((node) => measureNode(node));
  const totals = nodes.reduce(
    (acc, node) => ({
      chars: acc.chars + node.chars,
      lines: acc.lines + node.lines,
      bytes: acc.bytes + node.bytes,
      tokens_estimate: acc.tokens_estimate + node.tokens_estimate,
    }),
    { chars: 0, lines: 0, bytes: 0, tokens_estimate: 0 }
  );
  return { nodes, totals };
}
