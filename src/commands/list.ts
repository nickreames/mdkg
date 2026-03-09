import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { loadSkillsIndex } from "../graph/skills_index_cache";
import { SkillIndexEntry } from "../graph/skills_indexer";
import { filterNodes } from "../util/filter";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { sortNodesByQid } from "../util/sort";
import { formatNodeCard } from "./node_card";

export type ListCommandOptions = {
  root: string;
  ws?: string;
  type?: string;
  status?: string;
  epic?: string;
  priority?: number;
  blocked?: boolean;
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

function formatSkillCard(skill: SkillIndexEntry): string {
  return [skill.qid, "skill", "-/-", skill.name, skill.path].join(" | ");
}

function filterSkills(
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

export function runListCommand(options: ListCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (ws && !config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const normalizedType = options.type?.toLowerCase();

  if (normalizedType === "skill") {
    if (ws && ws !== "root") {
      throw new UsageError("skills are only available in workspace root");
    }
    if (options.status || options.epic || options.priority !== undefined || options.blocked) {
      throw new UsageError(
        "--status/--epic/--priority/--blocked are not supported with --type skill"
      );
    }
    const { index, rebuilt, stale } = loadSkillsIndex({
      root: options.root,
      config,
      useCache: !options.noCache,
      allowReindex: !options.noReindex,
    });
    if (stale && !rebuilt && !options.noCache) {
      console.error("warning: skills index is stale; run mdkg index to refresh");
    }
    const skills = filterSkills(
      Object.values(index.skills),
      options.tags,
      options.tagsMode ?? "any"
    ).sort((a, b) => a.qid.localeCompare(b.qid));
    if (skills.length === 0) {
      console.error("note: no skills indexed under .mdkg/skills/");
      return;
    }
    for (const skill of skills) {
      console.log(formatSkillCard(skill));
    }
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

  let epicQid: string | undefined;
  if (options.epic) {
    const resolved = resolveQid(index, options.epic, ws);
    if (resolved.status !== "ok") {
      throw new NotFoundError(formatResolveError("epic", options.epic, resolved, ws));
    }
    epicQid = resolved.qid;
  }

  const filtered = filterNodes(Object.values(index.nodes), {
    ws,
    type: normalizedType,
    status: options.status,
    epic: epicQid,
    priority: options.priority,
    blocked: options.blocked,
    tags: options.tags,
    tagsMode: options.tagsMode,
  });

  const sorted = sortNodesByQid(filtered);
  for (const node of sorted) {
    console.log(formatNodeCard(node));
  }
}
