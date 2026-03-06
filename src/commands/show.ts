import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { parseFrontmatter } from "../graph/frontmatter";
import { loadSkillsIndex } from "../graph/skills_index_cache";
import { SkillIndexEntry } from "../graph/skills_indexer";
import { NotFoundError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { formatNodeCard } from "./node_card";

export type ShowCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  includeBody?: boolean;
  metaOnly?: boolean;
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

function formatSkillCard(skill: SkillIndexEntry): string {
  return [skill.qid, "skill", "-/-", skill.name, skill.path].join(" | ");
}

function extractSkillSlug(raw: string): string | undefined {
  const normalized = raw.toLowerCase();
  if (normalized.startsWith("skill:")) {
    const slug = normalized.slice("skill:".length);
    return slug || undefined;
  }
  if (normalized.startsWith("root:skill:")) {
    const slug = normalized.slice("root:skill:".length);
    return slug || undefined;
  }
  return undefined;
}

export function runShowCommand(options: ShowCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (ws && !config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const skillSlug = extractSkillSlug(options.id);
  if (skillSlug) {
    const { index, rebuilt, stale } = loadSkillsIndex({
      root: options.root,
      config,
      useCache: !options.noCache,
      allowReindex: !options.noReindex,
    });
    if (stale && !rebuilt && !options.noCache) {
      console.error("warning: skills index is stale; run mdkg index to refresh");
    }
    const skill = index.skills[skillSlug];
    if (!skill) {
      throw new NotFoundError(`skill not found: ${options.id}`);
    }

    if (options.metaOnly) {
      const lines: string[] = [];
      lines.push(formatSkillCard(skill));
      lines.push(`description: ${skill.description}`);
      const tagsLine = maybeLine("tags", skill.tags);
      if (tagsLine) {
        lines.push(tagsLine);
      }
      if (skill.version) {
        lines.push(`version: ${skill.version}`);
      }
      const authorsLine = maybeLine("authors", skill.authors);
      if (authorsLine) {
        lines.push(authorsLine);
      }
      const linksLine = maybeLine("links", skill.links);
      if (linksLine) {
        lines.push(linksLine);
      }
      lines.push(`has_scripts: ${skill.has_scripts ? "true" : "false"}`);
      lines.push(`has_references: ${skill.has_references ? "true" : "false"}`);
      for (const [key, value] of Object.entries(skill.ochatr).sort(([a], [b]) => a.localeCompare(b))) {
        if (Array.isArray(value)) {
          lines.push(`${key}: ${value.join(", ")}`);
          continue;
        }
        if (typeof value === "boolean") {
          lines.push(`${key}: ${value ? "true" : "false"}`);
          continue;
        }
        lines.push(`${key}: ${value}`);
      }
      console.log(lines.join("\n"));
      return;
    }

    const skillPath = path.resolve(options.root, skill.path);
    if (!fs.existsSync(skillPath)) {
      throw new NotFoundError(`file not found for ${skill.id}: ${skill.path}`);
    }
    const content = fs.readFileSync(skillPath, "utf8").trimEnd();
    console.log(content);
    return;
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

  const node = index.nodes[resolved.qid];
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

  if (options.includeBody) {
    const filePath = path.resolve(options.root, node.path);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError(`file not found for ${node.qid}: ${node.path}`);
    }
    const content = fs.readFileSync(filePath, "utf8");
    const body = parseFrontmatter(content, filePath).body.trimEnd();
    if (body.length > 0) {
      lines.push("");
      lines.push(body);
    }
  }

  console.log(lines.join("\n"));
}
