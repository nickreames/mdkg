import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { loadSkillsIndex } from "../graph/skills_index_cache";
import { IndexNode } from "../graph/indexer";
import { SkillIndexEntry } from "../graph/skills_indexer";
import { filterNodes } from "../util/filter";
import { NotFoundError, UsageError } from "../util/errors";
import { sortNodesByQid } from "../util/sort";
import { formatNodeCard } from "./node_card";

export type SearchCommandOptions = {
  root: string;
  query: string;
  ws?: string;
  type?: string;
  status?: string;
  tags?: string[];
  tagsMode?: "any" | "all";
  noCache?: boolean;
  noReindex?: boolean;
};

function normalizeWorkspace(value?: string): string | undefined {
  if (!value || value === "all") {
    return undefined;
  }
  return value;
}

function buildSearchText(node: IndexNode): string {
  const tokens = [
    node.id,
    node.qid,
    node.title,
    node.path,
    ...node.tags,
    ...node.owners,
    ...node.links,
    ...node.artifacts,
    ...node.refs,
    ...node.aliases,
    ...node.skills,
  ];
  return tokens.join(" ").toLowerCase();
}

function formatSkillCard(skill: SkillIndexEntry): string {
  return [skill.qid, "skill", "-/-", skill.name, skill.path].join(" | ");
}

function buildSkillSearchText(skill: SkillIndexEntry): string {
  const ochatrTokens = Object.entries(skill.ochatr).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, ...value];
    }
    if (typeof value === "boolean") {
      return [key, value ? "true" : "false"];
    }
    return [key, value];
  });
  const tokens = [
    skill.slug,
    skill.id,
    skill.qid,
    skill.name,
    skill.description,
    skill.path,
    ...skill.tags,
    ...skill.authors,
    ...skill.links,
    ...ochatrTokens,
  ];
  return tokens.join(" ").toLowerCase();
}

function matchesQuery(node: IndexNode, terms: string[]): boolean {
  const text = buildSearchText(node);
  for (const term of terms) {
    if (!text.includes(term)) {
      return false;
    }
  }
  return true;
}

function matchesSkillQuery(skill: SkillIndexEntry, terms: string[]): boolean {
  const text = buildSkillSearchText(skill);
  for (const term of terms) {
    if (!text.includes(term)) {
      return false;
    }
  }
  return true;
}

function filterSkillsByTags(
  skills: SkillIndexEntry[],
  tags?: string[],
  tagsMode: "any" | "all" = "any"
): SkillIndexEntry[] {
  const normalizedTags = tags?.map((value) => value.toLowerCase()).filter(Boolean) ?? [];
  if (normalizedTags.length === 0) {
    return skills;
  }
  return skills.filter((skill) => {
    const skillTags = new Set(skill.tags.map((value) => value.toLowerCase()));
    if (tagsMode === "all") {
      return normalizedTags.every((value) => skillTags.has(value));
    }
    return normalizedTags.some((value) => skillTags.has(value));
  });
}

export function runSearchCommand(options: SearchCommandOptions): void {
  const query = options.query.trim();
  if (!query) {
    throw new UsageError("search query cannot be empty");
  }

  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (ws && !config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const normalizedType = options.type?.toLowerCase();
  if (normalizedType === "skill" && options.status) {
    throw new UsageError("--status is not supported with --type skill");
  }
  if (normalizedType === "skill" && ws && ws !== "root") {
    throw new UsageError("skills are only available in workspace root");
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

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const nodeResults =
    normalizedType === "skill"
      ? []
      : filterNodes(Object.values(index.nodes), {
          ws,
          type: normalizedType,
          status: options.status,
          tags: options.tags,
          tagsMode: options.tagsMode,
        }).filter((node) => matchesQuery(node, terms));

  let skillResults: SkillIndexEntry[] = [];
  const includeSkills = normalizedType === "skill" || normalizedType === undefined;
  if (includeSkills && (!ws || ws === "root")) {
    const skillsLoad = loadSkillsIndex({
      root: options.root,
      config,
      useCache: !options.noCache,
      allowReindex: !options.noReindex,
    });
    if (skillsLoad.stale && !skillsLoad.rebuilt && !options.noCache) {
      console.error("warning: skills index is stale; run mdkg index to refresh");
    }
    skillResults = filterSkillsByTags(
      Object.values(skillsLoad.index.skills),
      options.tags,
      options.tagsMode ?? "any"
    ).filter((skill) => matchesSkillQuery(skill, terms));
  }

  const lines = [
    ...sortNodesByQid(nodeResults).map((node) => ({
      qid: node.qid,
      line: formatNodeCard(node),
    })),
    ...skillResults.map((skill) => ({
      qid: skill.qid,
      line: formatSkillCard(skill),
    })),
  ].sort((a, b) => a.qid.localeCompare(b.qid));

  for (const entry of lines) {
    console.log(entry.line);
  }
}
