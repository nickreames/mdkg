import { PackStats } from "./types";

function pad(value: string, width: number): string {
  if (value.length >= width) {
    return value;
  }
  return `${value}${" ".repeat(width - value.length)}`;
}

function padLeft(value: string, width: number): string {
  if (value.length >= width) {
    return value;
  }
  return `${" ".repeat(width - value.length)}${value}`;
}

export function renderPackStats(stats: PackStats): string {
  const rows = stats.nodes.map((node) => ({
    qid: node.qid,
    chars: String(node.chars),
    lines: String(node.lines),
    bytes: String(node.bytes),
    tokens: String(node.tokens_estimate),
  }));
  const qidWidth = Math.max(3, ...rows.map((row) => row.qid.length), 5);
  const charsWidth = Math.max(5, ...rows.map((row) => row.chars.length), String(stats.totals.chars).length);
  const linesWidth = Math.max(5, ...rows.map((row) => row.lines.length), String(stats.totals.lines).length);
  const bytesWidth = Math.max(5, ...rows.map((row) => row.bytes.length), String(stats.totals.bytes).length);
  const tokensWidth = Math.max(
    6,
    ...rows.map((row) => row.tokens.length),
    String(stats.totals.tokens_estimate).length
  );

  const lines: string[] = [];
  lines.push(
    `${pad("qid", qidWidth)}  ${padLeft("chars", charsWidth)}  ${padLeft("lines", linesWidth)}  ${padLeft("bytes", bytesWidth)}  ${padLeft("tokens", tokensWidth)}`
  );
  lines.push(
    `${"-".repeat(qidWidth)}  ${"-".repeat(charsWidth)}  ${"-".repeat(linesWidth)}  ${"-".repeat(bytesWidth)}  ${"-".repeat(tokensWidth)}`
  );
  for (const row of rows) {
    lines.push(
      `${pad(row.qid, qidWidth)}  ${padLeft(row.chars, charsWidth)}  ${padLeft(row.lines, linesWidth)}  ${padLeft(row.bytes, bytesWidth)}  ${padLeft(row.tokens, tokensWidth)}`
    );
  }
  lines.push(
    `${pad("TOTAL", qidWidth)}  ${padLeft(String(stats.totals.chars), charsWidth)}  ${padLeft(String(stats.totals.lines), linesWidth)}  ${padLeft(String(stats.totals.bytes), bytesWidth)}  ${padLeft(String(stats.totals.tokens_estimate), tokensWidth)}`
  );
  return lines.join("\n");
}
