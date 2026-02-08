import { PackResult } from "./types";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function listItems(tag: string, itemTag: string, items: string[], indent: string): string[] {
  if (items.length === 0) {
    return [];
  }
  const lines: string[] = [];
  lines.push(`${indent}<${tag}>`);
  for (const item of items) {
    lines.push(`${indent}  <${itemTag}>${escapeXml(item)}</${itemTag}>`);
  }
  lines.push(`${indent}</${tag}>`);
  return lines;
}

export function exportXml(pack: PackResult): string {
  const lines: string[] = [];
  lines.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
  lines.push("<pack>");
  lines.push("  <meta>");
  lines.push(`    <root>${escapeXml(pack.meta.root)}</root>`);
  lines.push(`    <depth>${pack.meta.depth}</depth>`);
  lines.push(`    <verbose>${pack.meta.verbose}</verbose>`);
  if (pack.meta.profile) {
    lines.push(`    <profile>${escapeXml(pack.meta.profile)}</profile>`);
  }
  if (pack.meta.body_mode) {
    lines.push(`    <body_mode>${escapeXml(pack.meta.body_mode)}</body_mode>`);
  }
  lines.push(`    <generated_at>${escapeXml(pack.meta.generated_at)}</generated_at>`);
  lines.push(`    <node_count>${pack.meta.node_count}</node_count>`);
  lines.push("    <truncated>");
  lines.push(`      <max_nodes>${pack.meta.truncated.max_nodes}</max_nodes>`);
  lines.push(`      <max_bytes>${pack.meta.truncated.max_bytes}</max_bytes>`);
  lines.push(`      <max_chars>${Boolean(pack.meta.truncated.max_chars)}</max_chars>`);
  lines.push(`      <max_lines>${Boolean(pack.meta.truncated.max_lines)}</max_lines>`);
  lines.push(`      <max_tokens>${Boolean(pack.meta.truncated.max_tokens)}</max_tokens>`);
  if (pack.meta.truncated.dropped.length > 0) {
    lines.push("      <dropped>");
    for (const qid of pack.meta.truncated.dropped) {
      lines.push(`        <qid>${escapeXml(qid)}</qid>`);
    }
    lines.push("      </dropped>");
  }
  lines.push("    </truncated>");
  lines.push("  </meta>");
  lines.push("  <nodes>");

  for (const node of pack.nodes) {
    lines.push("    <node>");
    lines.push(`      <qid>${escapeXml(node.qid)}</qid>`);
    lines.push(`      <id>${escapeXml(node.id)}</id>`);
    lines.push(`      <workspace>${escapeXml(node.workspace)}</workspace>`);
    lines.push(`      <type>${escapeXml(node.type)}</type>`);
    lines.push(`      <title>${escapeXml(node.title)}</title>`);
    if (node.status) {
      lines.push(`      <status>${escapeXml(node.status)}</status>`);
    }
    if (node.priority !== undefined) {
      lines.push(`      <priority>${node.priority}</priority>`);
    }
    lines.push(`      <path>${escapeXml(node.path)}</path>`);
    lines.push("      <frontmatter>");
    lines.push(...listItems("links", "link", node.links, "        "));
    lines.push(...listItems("artifacts", "artifact", node.artifacts, "        "));
    lines.push(...listItems("refs", "ref", node.refs, "        "));
    lines.push(...listItems("aliases", "alias", node.aliases, "        "));
    lines.push("      </frontmatter>");
    lines.push(`      <body>${escapeXml(node.body)}</body>`);
    lines.push("    </node>");
  }

  lines.push("  </nodes>");
  lines.push("</pack>");
  return lines.join("\n");
}
