import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { buildPack } from "../pack/pack";
import { exportMarkdown } from "../pack/export_md";
import { exportJson } from "../pack/export_json";
import { exportToon } from "../pack/export_toon";
import { exportXml } from "../pack/export_xml";

const EDGE_KEYS = new Set(["parent", "epic", "relates", "blocked_by", "blocks", "prev", "next"]);
const FORMAT_KEYS = new Set(["md", "json", "toon", "xml"]);

export type PackCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  depth?: number;
  edges?: string[];
  verbose?: boolean;
  format?: string;
  out?: string;
  noCache?: boolean;
  noReindex?: boolean;
};

function normalizeWorkspace(value?: string): string | undefined {
  if (!value || value === "all") {
    return undefined;
  }
  return value;
}

function normalizeEdges(edges: string[]): string[] {
  const normalized = edges.map((edge) => edge.toLowerCase().replace(/-/g, "_"));
  const invalid = normalized.filter((edge) => !EDGE_KEYS.has(edge));
  if (invalid.length > 0) {
    throw new UsageError(`invalid edge name(s): ${invalid.join(", ")}`);
  }
  return Array.from(new Set(normalized));
}

function normalizeFormat(format?: string): string {
  if (!format) {
    return "md";
  }
  const normalized = format.toLowerCase();
  if (!FORMAT_KEYS.has(normalized)) {
    throw new UsageError(`invalid format: ${format}`);
  }
  return normalized;
}

export function runPackCommand(options: PackCommandOptions): void {
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

  const resolved = resolveQid(index, options.id, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("id", options.id, resolved, ws));
  }

  const depth = options.depth ?? config.pack.default_depth;
  if (depth < 0) {
    throw new UsageError("--depth must be a non-negative integer");
  }

  const extraEdges = options.edges ? normalizeEdges(options.edges) : [];
  const edges = normalizeEdges([...config.pack.default_edges, ...extraEdges]);

  const buildResult = buildPack({
    root: options.root,
    index,
    rootQid: resolved.qid,
    depth,
    edges,
    verbose: Boolean(options.verbose),
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(options.root, config.pack.verbose_core_list_path),
    wsHint: ws,
  });

  for (const warning of buildResult.warnings) {
    console.error(`warning: ${warning}`);
  }

  const format = normalizeFormat(options.format);
  let output = "";

  if (format === "md") {
    output = exportMarkdown(buildResult.pack, config.pack.limits.max_bytes).content;
  } else if (format === "json") {
    output = exportJson(buildResult.pack);
  } else if (format === "toon") {
    output = exportToon(buildResult.pack);
  } else if (format === "xml") {
    output = exportXml(buildResult.pack);
  }

  if (options.out) {
    const outPath = path.resolve(options.root, options.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output, "utf8");
    console.log(`pack written: ${path.relative(options.root, outPath)}`);
    return;
  }

  console.log(output);
}
