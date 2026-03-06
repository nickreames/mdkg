import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { parseFrontmatter } from "../graph/frontmatter";
import { loadSkillsIndex } from "../graph/skills_index_cache";
import { SkillIndexEntry } from "../graph/skills_indexer";
import { ALLOWED_TYPES } from "../graph/node";
import { applyPackBudgets } from "../pack/budget";
import { exportJson } from "../pack/export_json";
import { exportMarkdown } from "../pack/export_md";
import { exportToon } from "../pack/export_toon";
import { exportXml } from "../pack/export_xml";
import { measurePack } from "../pack/metrics";
import { buildPack } from "../pack/pack";
import { resolvePackProfile, shapePackBodies } from "../pack/profile";
import { renderPackStats } from "../pack/stats";
import { PackResult, PackTruncationReport } from "../pack/types";
import { loadTemplateHeadingMap } from "../templates/headings";
import { NotFoundError, UsageError } from "../util/errors";
import { buildDefaultPackPath } from "../util/output";
import { formatResolveError, resolveQid } from "../util/qid";

const EDGE_KEYS = new Set(["parent", "epic", "relates", "blocked_by", "blocks", "prev", "next"]);
const FORMAT_KEYS = new Set(["md", "json", "toon", "xml"]);
const SKILL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PackCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  depth?: number;
  edges?: string[];
  verbose?: boolean;
  concise?: boolean;
  stripCode?: boolean;
  format?: string;
  packProfile?: string;
  maxCodeLines?: number;
  maxChars?: number;
  maxLines?: number;
  maxTokens?: number;
  dryRun?: boolean;
  truncationReport?: string;
  stats?: boolean;
  statsOut?: string;
  skills?: string;
  skillsDepth?: string;
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

type SkillsPolicy =
  | { mode: "none" }
  | { mode: "auto" }
  | { mode: "list"; slugs: string[] };

function normalizeSkillSlug(slug: string): string {
  const normalized = slug.toLowerCase().trim();
  if (!SKILL_SLUG_RE.test(normalized)) {
    throw new UsageError(`invalid skill slug: ${slug}`);
  }
  return normalized;
}

function resolveSkillsPolicy(raw?: string): SkillsPolicy {
  if (!raw) {
    return { mode: "auto" };
  }
  const normalized = raw.toLowerCase().trim();
  if (!normalized || normalized === "auto") {
    return { mode: "auto" };
  }
  if (normalized === "none") {
    return { mode: "none" };
  }
  const slugs = normalized
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => normalizeSkillSlug(value));
  if (slugs.length === 0) {
    return { mode: "none" };
  }
  return { mode: "list", slugs: Array.from(new Set(slugs)) };
}

function resolveSkillsDepth(raw?: string): "meta" | "full" {
  if (!raw) {
    return "meta";
  }
  const normalized = raw.toLowerCase().trim();
  if (normalized === "meta" || normalized === "full") {
    return normalized;
  }
  throw new UsageError("--skills-depth must be meta or full");
}

function renderSkillMetaBody(skill: SkillIndexEntry): string {
  const lines: string[] = [];
  lines.push(`description: ${skill.description}`);
  if (skill.tags.length > 0) {
    lines.push(`tags: ${skill.tags.join(", ")}`);
  }
  if (skill.version) {
    lines.push(`version: ${skill.version}`);
  }
  if (skill.authors.length > 0) {
    lines.push(`authors: ${skill.authors.join(", ")}`);
  }
  if (skill.links.length > 0) {
    lines.push(`links: ${skill.links.join(", ")}`);
  }
  lines.push(`has_scripts: ${skill.has_scripts ? "true" : "false"}`);
  lines.push(`has_references: ${skill.has_references ? "true" : "false"}`);
  for (const [key, value] of Object.entries(skill.ochatr).sort(([a], [b]) => a.localeCompare(b))) {
    if (Array.isArray(value)) {
      lines.push(`${key}: ${value.join(", ")}`);
    } else if (typeof value === "boolean") {
      lines.push(`${key}: ${value ? "true" : "false"}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  return lines.join("\n").trimEnd();
}

function loadSkillFullBody(root: string, skill: SkillIndexEntry): string {
  const skillPath = path.resolve(root, skill.path);
  if (!fs.existsSync(skillPath)) {
    return renderSkillMetaBody(skill);
  }
  const content = fs.readFileSync(skillPath, "utf8");
  return parseFrontmatter(content, skillPath).body.trimEnd();
}

function uniqueSkillOrder(slugs: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    ordered.push(slug);
  }
  return ordered;
}

function collectReferencedSkills(
  indexQids: string[],
  indexNodes: Record<string, { skills: string[]; type: string }>
): string[] {
  const slugs: string[] = [];
  for (const qid of indexQids) {
    const node = indexNodes[qid];
    if (!node) {
      continue;
    }
    if (node.type === "skill") {
      continue;
    }
    slugs.push(...node.skills);
  }
  return uniqueSkillOrder(slugs);
}

function appendSkillsToPack(
  pack: PackResult,
  skillEntries: SkillIndexEntry[],
  depth: "meta" | "full",
  root: string
): PackResult {
  const existing = new Set(pack.nodes.map((node) => node.qid));
  const newNodes = skillEntries
    .filter((skill) => !existing.has(skill.qid))
    .map((skill) => ({
      qid: skill.qid,
      id: skill.id,
      workspace: skill.ws,
      type: "skill",
      title: skill.name,
      status: undefined,
      priority: undefined,
      path: skill.path,
      links: skill.links,
      artifacts: [],
      refs: [],
      aliases: [skill.slug, ...skill.tags],
      body: depth === "full" ? loadSkillFullBody(root, skill) : renderSkillMetaBody(skill),
    }));
  if (newNodes.length === 0) {
    return pack;
  }
  const mergedNodes = [...pack.nodes, ...newNodes];
  return {
    meta: {
      ...pack.meta,
      node_count: mergedNodes.length,
    },
    nodes: mergedNodes,
  };
}

function applyNodeCountLimit(pack: PackResult, maxNodes: number): PackResult {
  if (maxNodes <= 0 || pack.nodes.length <= maxNodes) {
    return pack;
  }
  const included = pack.nodes.slice(0, maxNodes);
  const dropped = pack.nodes.slice(maxNodes).map((node) => node.qid);
  return {
    meta: {
      ...pack.meta,
      node_count: included.length,
      truncated: {
        ...pack.meta.truncated,
        max_nodes: true,
        dropped: [...pack.meta.truncated.dropped, ...dropped],
      },
    },
    nodes: included,
  };
}

function writeJsonFile(outPath: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
}

function resolveStatsPath(root: string, outPath: string, statsOut?: string): string {
  if (statsOut) {
    return path.resolve(root, statsOut);
  }
  return `${outPath}.stats.json`;
}

function shouldWriteTruncationReport(
  pack: PackResult,
  options: Pick<PackCommandOptions, "maxChars" | "maxLines" | "maxTokens" | "truncationReport">
): boolean {
  if (options.truncationReport) {
    return true;
  }
  if (!options.maxChars && !options.maxLines && !options.maxTokens) {
    return false;
  }
  const hasDrops = pack.meta.truncated.dropped.length > 0;
  const hasBodyTruncation = (pack.meta.truncated.body_truncated ?? []).length > 0;
  return hasDrops || hasBodyTruncation;
}

function printDryRunSummary(
  pack: PackResult,
  stats: ReturnType<typeof measurePack>,
  format: string
): void {
  console.log("dry-run: no files written");
  console.log(`root: ${pack.meta.root}`);
  console.log(`profile: ${pack.meta.profile ?? "standard"}`);
  console.log(`body_mode: ${pack.meta.body_mode ?? "full"}`);
  console.log(`format: ${format}`);
  console.log(`nodes: ${pack.nodes.length}`);
  if (pack.meta.latest_checkpoint_qid) {
    console.log(`latest_checkpoint_qid: ${pack.meta.latest_checkpoint_qid}`);
  }
  if (pack.meta.latest_checkpoint_qid_hint) {
    console.log(`latest_checkpoint_qid_hint: ${pack.meta.latest_checkpoint_qid_hint}`);
  }
  if (pack.meta.truncated.dropped.length > 0) {
    console.log(`dropped: ${pack.meta.truncated.dropped.join(", ")}`);
  }
  if ((pack.meta.truncated.body_truncated ?? []).length > 0) {
    console.log(`body_truncated: ${(pack.meta.truncated.body_truncated ?? []).join(", ")}`);
  }
  console.log("included_nodes:");
  for (const node of pack.nodes) {
    console.log(`- ${node.qid}`);
  }
  console.log("");
  console.log(renderPackStats(stats));
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
  if (!Number.isInteger(depth) || depth < 0) {
    throw new UsageError("--depth must be a non-negative integer");
  }

  const extraEdges = options.edges ? normalizeEdges(options.edges) : [];
  const edges = normalizeEdges([...config.pack.default_edges, ...extraEdges]);
  const skillsPolicy = resolveSkillsPolicy(options.skills);
  const skillsDepth = resolveSkillsDepth(options.skillsDepth);

  let resolvedProfile;
  try {
    resolvedProfile = resolvePackProfile({
      profile: options.packProfile,
      concise: options.concise,
      stripCode: options.stripCode,
      maxCodeLines: options.maxCodeLines,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new UsageError(message);
  }

  if (options.verbose && resolvedProfile.profile !== "standard") {
    throw new UsageError("--verbose is only supported with --pack-profile standard");
  }

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
    includeLatestCheckpoint: true,
  });

  for (const warning of buildResult.warnings) {
    console.error(`warning: ${warning}`);
  }

  let packWithSkills = buildResult.pack;
  if (skillsPolicy.mode !== "none") {
    const skillsLoad = loadSkillsIndex({
      root: options.root,
      config,
      useCache: !options.noCache,
      allowReindex: !options.noReindex,
    });
    if (skillsLoad.stale && !skillsLoad.rebuilt && !options.noCache) {
      console.error("warning: skills index is stale; run mdkg index to refresh");
    }

    const indexQids = buildResult.pack.nodes.map((node) => node.qid);
    const autoSlugs = collectReferencedSkills(indexQids, index.nodes);
    const selectedSlugs =
      skillsPolicy.mode === "list"
        ? skillsPolicy.slugs
        : autoSlugs;

    const selectedEntries: SkillIndexEntry[] = [];
    for (const slug of selectedSlugs) {
      const entry = skillsLoad.index.skills[slug];
      if (!entry) {
        console.error(`warning: requested skill missing: ${slug}`);
        continue;
      }
      selectedEntries.push(entry);
    }
    packWithSkills = appendSkillsToPack(packWithSkills, selectedEntries, skillsDepth, options.root);
    packWithSkills = applyNodeCountLimit(packWithSkills, config.pack.limits.max_nodes);
  }

  const templateHeadingMap =
    resolvedProfile.bodyMode === "summary"
      ? loadTemplateHeadingMap(options.root, config, Array.from(ALLOWED_TYPES))
      : {};
  const shaped = shapePackBodies(packWithSkills, {
    resolved: resolvedProfile,
    templateHeadingMap,
  });

  let budgeted;
  try {
    budgeted = applyPackBudgets(
      shaped,
      {
        maxChars: options.maxChars,
        maxLines: options.maxLines,
        maxTokens: options.maxTokens,
      },
      resolvedProfile.profile
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new UsageError(message);
  }

  let finalPack = budgeted.pack;
  const format = normalizeFormat(options.format);
  let output = "";

  if (format === "md") {
    const markdown = exportMarkdown(finalPack, config.pack.limits.max_bytes);
    output = markdown.content;
    finalPack = {
      meta: markdown.meta,
      nodes: markdown.nodes,
    };
  } else if (format === "json") {
    output = exportJson(finalPack);
  } else if (format === "toon") {
    output = exportToon(finalPack);
  } else if (format === "xml") {
    output = exportXml(finalPack);
  }

  const finalStats = measurePack(finalPack);
  if (options.dryRun) {
    if (options.out || options.statsOut || options.truncationReport) {
      console.error("warning: --out/--stats-out/--truncation-report are ignored with --dry-run");
    }
    printDryRunSummary(finalPack, finalStats, format);
    return;
  }

  const rootId = resolved.qid.split(":")[1] ?? resolved.qid;
  const outPath = options.out
    ? path.resolve(options.root, options.out)
    : buildDefaultPackPath(
        options.root,
        rootId,
        format,
        Boolean(options.verbose),
        new Date(),
        resolvedProfile.profile
      );

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output, "utf8");
  console.log(`pack written: ${outPath}`);

  const statsEnabled = Boolean(options.stats || options.statsOut);
  if (statsEnabled) {
    const statsPayload = {
      root: finalPack.meta.root,
      profile: finalPack.meta.profile ?? resolvedProfile.profile,
      body_mode: finalPack.meta.body_mode ?? resolvedProfile.bodyMode,
      ...finalStats,
    };
    const statsPath = resolveStatsPath(options.root, outPath, options.statsOut);
    writeJsonFile(statsPath, statsPayload);
    console.log(`pack stats written: ${statsPath}`);
    if (options.stats) {
      console.log(renderPackStats(finalStats));
    }
  }

  const truncationReport: PackTruncationReport = {
    ...budgeted.report,
    after: {
      node_count: finalPack.nodes.length,
      chars: finalStats.totals.chars,
      lines: finalStats.totals.lines,
      bytes: finalStats.totals.bytes,
      tokens_estimate: finalStats.totals.tokens_estimate,
    },
    dropped_nodes: [...finalPack.meta.truncated.dropped],
    body_truncated_nodes: [...(finalPack.meta.truncated.body_truncated ?? [])],
  };

  if (shouldWriteTruncationReport(finalPack, options)) {
    const reportPath = options.truncationReport
      ? path.resolve(options.root, options.truncationReport)
      : `${outPath}.truncation.json`;
    writeJsonFile(reportPath, truncationReport);
    console.log(`pack truncation report written: ${reportPath}`);
  }
}
