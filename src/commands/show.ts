import { loadConfig } from "../core/config";
import { IndexNode } from "../graph/indexer";
import { loadIndex } from "../graph/index_cache";
import { readNodeBody } from "../graph/node_body";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { formatNodeCard } from "./node_card";
import {
  QueryOutputFormat,
  toNodeDetailJson,
  writeStructuredOutput,
} from "./query_output";

export type ShowCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  metaOnly?: boolean;
  format?: QueryOutputFormat;
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

function maybeLine(label: string, values: string[]): string | undefined {
  if (values.length === 0) {
    return undefined;
  }
  return `${label}: ${values.join(", ")}`;
}

function formatAttributeLine(key: string, value: IndexNode["attributes"][string]): string {
  if (Array.isArray(value)) {
    return `${key}: ${value.join(", ")}`;
  }
  return `${key}: ${String(value)}`;
}

export function runShowCommand(options: ShowCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (ws && !config.workspaces[ws] && !config.bundle_imports[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const normalizedId = options.id.toLowerCase();
  if (normalizedId.startsWith("skill:") || normalizedId.startsWith("root:skill:")) {
    throw new UsageError(
      `generic skill show is no longer supported; use \`mdkg skill show ${options.id.replace(/^root:skill:|^skill:/i, "")}\``
    );
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

  const resolved = resolveQid(index, options.id, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("id", options.id, resolved, ws));
  }

  const node = index.nodes[resolved.qid];
  let body = "";
  if (!options.metaOnly) {
    body = readNodeBody(options.root, node);
  }

  const format = options.format ?? (options.json ? "json" : undefined);
  if (format) {
    writeStructuredOutput({
      command: "show",
      kind: "node",
      item: toNodeDetailJson(node, options.metaOnly ? undefined : body),
    }, format);
    return;
  }

  const lines: string[] = [];
  lines.push(formatNodeCard(node));

  const metaLines = [
    maybeLine("tags", node.tags),
    maybeLine("owners", node.owners),
    maybeLine("links", node.links),
    maybeLine("artifacts", node.artifacts),
    maybeLine("refs", node.refs),
    maybeLine("aliases", node.aliases),
    maybeLine("skills", node.skills),
  ].filter((line): line is string => Boolean(line));
  lines.push(...metaLines);
  lines.push(
    ...Object.entries(node.attributes ?? {}).map(([key, value]) => formatAttributeLine(key, value))
  );

  if (node.edges.epic) {
    lines.push(`epic: ${node.edges.epic}`);
  }
  if (node.edges.parent) {
    lines.push(`parent: ${node.edges.parent}`);
  }
  if (node.edges.prev) {
    lines.push(`prev: ${node.edges.prev}`);
  }
  if (node.edges.next) {
    lines.push(`next: ${node.edges.next}`);
  }
  const relatesLine = maybeLine("relates", node.edges.relates);
  if (relatesLine) {
    lines.push(relatesLine);
  }
  const blockedByLine = maybeLine("blocked_by", node.edges.blocked_by);
  if (blockedByLine) {
    lines.push(blockedByLine);
  }
  const blocksLine = maybeLine("blocks", node.edges.blocks);
  if (blocksLine) {
    lines.push(blocksLine);
  }

  if (!options.metaOnly && body.length > 0) {
    lines.push("");
    lines.push(body);
  }

  console.log(lines.join("\n"));
}
