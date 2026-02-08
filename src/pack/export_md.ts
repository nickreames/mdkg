import { PackMeta, PackNode, PackResult, PackTruncation } from "./types";

type MarkdownExport = {
  content: string;
  meta: PackMeta;
  nodes: PackNode[];
};

function formatList(label: string, values: string[]): string {
  if (values.length === 0) {
    return `${label}: []`;
  }
  return `${label}: ${values.join(", ")}`;
}

function renderHeader(meta: PackMeta, nodes: PackNode[]): string[] {
  const lines: string[] = [];
  lines.push("# mdkg pack");
  lines.push(`root: ${meta.root}`);
  lines.push(`depth: ${meta.depth}`);
  lines.push(`verbose: ${meta.verbose}`);
  if (meta.profile) {
    lines.push(`profile: ${meta.profile}`);
  }
  if (meta.body_mode) {
    lines.push(`body_mode: ${meta.body_mode}`);
  }
  lines.push(`nodes: ${nodes.length}`);
  lines.push(
    `truncated: max_nodes=${meta.truncated.max_nodes} max_bytes=${meta.truncated.max_bytes} max_chars=${Boolean(meta.truncated.max_chars)} max_lines=${Boolean(meta.truncated.max_lines)} max_tokens=${Boolean(meta.truncated.max_tokens)}`
  );
  if (meta.truncated.dropped.length > 0) {
    lines.push(`dropped: ${meta.truncated.dropped.join(", ")}`);
  }
  lines.push(`generated_at: ${meta.generated_at}`);
  lines.push("");
  lines.push("included_nodes:");
  for (const node of nodes) {
    lines.push(`- ${node.qid}`);
  }
  return lines;
}

function renderNode(node: PackNode): string[] {
  const lines: string[] = [];
  lines.push(`## ${node.qid}`);
  lines.push(`qid: ${node.qid}`);
  lines.push(`type: ${node.type}`);
  lines.push(`title: ${node.title}`);
  if (node.status) {
    lines.push(`status: ${node.status}`);
  }
  if (node.priority !== undefined) {
    lines.push(`priority: ${node.priority}`);
  }
  lines.push(`path: ${node.path}`);

  lines.push(formatList("links", node.links));
  lines.push(formatList("artifacts", node.artifacts));
  if (node.refs.length > 0) {
    lines.push(formatList("refs", node.refs));
  }

  if (node.body.trim().length > 0) {
    lines.push("");
    lines.push(node.body);
  }

  return lines;
}

function cloneTruncation(truncation: PackTruncation): PackTruncation {
  return {
    max_nodes: truncation.max_nodes,
    max_bytes: truncation.max_bytes,
    dropped: [...truncation.dropped],
    max_chars: truncation.max_chars,
    max_lines: truncation.max_lines,
    max_tokens: truncation.max_tokens,
    body_truncated: truncation.body_truncated ? [...truncation.body_truncated] : [],
  };
}

function buildMeta(meta: PackMeta, nodes: PackNode[]): PackMeta {
  return {
    ...meta,
    node_count: nodes.length,
    truncated: cloneTruncation(meta.truncated),
  };
}

function renderMarkdown(meta: PackMeta, nodes: PackNode[]): string {
  const lines: string[] = [];
  lines.push(...renderHeader(meta, nodes));

  for (const node of nodes) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(...renderNode(node));
  }

  return lines.join("\n");
}

export function exportMarkdown(pack: PackResult, maxBytes?: number): MarkdownExport {
  let nodes = pack.nodes;
  let meta = buildMeta(pack.meta, nodes);

  let content = renderMarkdown(meta, nodes);
  if (maxBytes !== undefined && maxBytes > 0 && Buffer.byteLength(content) > maxBytes) {
    meta.truncated.max_bytes = true;
    while (nodes.length > 1 && Buffer.byteLength(content) > maxBytes) {
      const dropped = nodes[nodes.length - 1];
      nodes = nodes.slice(0, -1);
      meta.truncated.dropped.push(dropped.qid);
      meta = buildMeta(meta, nodes);
      content = renderMarkdown(meta, nodes);
    }
  }

  return { content, meta, nodes };
}
