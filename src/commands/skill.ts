import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import {
  buildSkillIndexEntry,
  buildSkillsIndex,
  resolveSkillsIndexPath,
  resolveSkillsRoot,
  SKILL_SLUG_RE,
  SkillIndexEntry,
} from "../graph/skills_indexer";
import { loadSkillsIndex } from "../graph/skills_index_cache";
import { writeSkillsIndex } from "../graph/skills_index_cache";
import { UsageError, ValidationError, NotFoundError } from "../util/errors";
import {
  ensureSkillsRegistry,
  formatSkillCard,
  refreshSkillsRegistry,
  renderSkillTemplate,
} from "./skill_support";
import { toSkillDetailJson, toSkillSummaryJson, writeCount, writeJson } from "./query_output";
import { appendAutomaticEvent } from "./event_support";

export type SkillNewCommandOptions = {
  root: string;
  slug: string;
  name: string;
  description: string;
  tags?: string;
  authors?: string;
  links?: string;
  withScripts?: boolean;
  force?: boolean;
  runId?: string;
  now?: Date;
};

export type SkillListCommandOptions = {
  root: string;
  tags?: string[];
  tagsMode?: "any" | "all";
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

export type SkillShowCommandOptions = {
  root: string;
  slug: string;
  metaOnly?: boolean;
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

export type SkillSearchCommandOptions = {
  root: string;
  query: string;
  tags?: string[];
  tagsMode?: "any" | "all";
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

export type SkillValidateCommandOptions = {
  root: string;
  slug?: string;
};

function parseCsvList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeLowercaseList(raw?: string): string[] {
  return parseCsvList(raw).map((value) => value.toLowerCase());
}

function normalizeSlug(raw: string): string {
  const slug = raw.trim().toLowerCase();
  if (!SKILL_SLUG_RE.test(slug)) {
    throw new UsageError(`skill slug must be kebab-case: ${raw}`);
  }
  return slug;
}

function resolveSkillPaths(root: string, slug: string): {
  skillDir: string;
  canonicalPath: string;
  compatPath: string;
} {
  const config = loadConfig(root);
  const skillsRoot = resolveSkillsRoot(root, config);
  const skillDir = path.join(skillsRoot, slug);
  return {
    skillDir,
    canonicalPath: path.join(skillDir, "SKILL.md"),
    compatPath: path.join(skillDir, "SKILLS.md"),
  };
}

function validateSingleSkill(root: string, slug: string): { warnings: string[]; errors: string[] } {
  const { skillDir, canonicalPath, compatPath } = resolveSkillPaths(root, slug);
  const warnings: string[] = [];
  const errors: string[] = [];
  const hasCanonical = fs.existsSync(canonicalPath);
  const hasCompat = fs.existsSync(compatPath);

  if (!fs.existsSync(skillDir)) {
    throw new NotFoundError(`skill not found: ${slug}`);
  }
  if (hasCanonical && hasCompat) {
    errors.push(`${skillDir}: both SKILL.md and SKILLS.md exist`);
    return { warnings, errors };
  }
  if (!hasCanonical && !hasCompat) {
    errors.push(`${skillDir}: missing SKILL.md or SKILLS.md`);
    return { warnings, errors };
  }

  const skillPath = hasCanonical ? canonicalPath : compatPath;
  if (!hasCanonical) {
    warnings.push(`${path.relative(root, compatPath)}: using legacy SKILLS.md compatibility file`);
  }
  try {
    buildSkillIndexEntry(root, slug, skillPath);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown skill validation error";
    errors.push(message);
  }
  return { warnings, errors };
}

function maybeLine(label: string, values: string[]): string | undefined {
  if (values.length === 0) {
    return undefined;
  }
  return `${label}: ${values.join(", ")}`;
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

function matchesSkillQuery(skill: SkillIndexEntry, terms: string[]): boolean {
  const text = buildSkillSearchText(skill);
  for (const term of terms) {
    if (!text.includes(term)) {
      return false;
    }
  }
  return true;
}

export function runSkillNewCommand(options: SkillNewCommandOptions): void {
  const root = options.root;
  const config = loadConfig(root);
  const slug = normalizeSlug(options.slug);
  const name = options.name.trim();
  const description = options.description.trim();
  if (!name) {
    throw new UsageError("skill name cannot be empty");
  }
  if (!description) {
    throw new UsageError("skill description cannot be empty");
  }

  const tags = normalizeLowercaseList(options.tags);
  const authors = parseCsvList(options.authors);
  const links = parseCsvList(options.links);
  const skillsRoot = resolveSkillsRoot(root, config);
  const skillDir = path.join(skillsRoot, slug);
  const canonicalPath = path.join(skillDir, "SKILL.md");
  const compatPath = path.join(skillDir, "SKILLS.md");
  const force = Boolean(options.force);

  if (fs.existsSync(compatPath)) {
    throw new UsageError(`legacy compatibility file exists for ${slug}; migrate SKILLS.md before scaffolding`);
  }
  if (fs.existsSync(canonicalPath) && !force) {
    throw new UsageError(`skill already exists: ${path.relative(root, canonicalPath)} (use --force to overwrite)`);
  }

  fs.mkdirSync(skillDir, { recursive: true });
  fs.mkdirSync(path.join(skillDir, "references"), { recursive: true });
  fs.mkdirSync(path.join(skillDir, "assets"), { recursive: true });
  if (options.withScripts) {
    fs.mkdirSync(path.join(skillDir, "scripts"), { recursive: true });
  }

  const content = renderSkillTemplate({
    name,
    description,
    tags,
    authors,
    links,
  });
  fs.writeFileSync(canonicalPath, content, "utf8");

  ensureSkillsRegistry(root, config);
  refreshSkillsRegistry(root, config);

  if (config.index.auto_reindex) {
    const skillsIndex = buildSkillsIndex(root, config);
    writeSkillsIndex(resolveSkillsIndexPath(root), skillsIndex);
  }

  appendAutomaticEvent({
    root,
    ws: "root",
    kind: "SKILL_CREATED",
    status: "ok",
    refs: [`skill:${slug}`],
    notes: `skill created via mdkg skill new`,
    runId: options.runId,
    skill: slug,
    now: options.now,
  });

  console.log(`skill created: root:skill:${slug} (${path.relative(root, canonicalPath)})`);
}

export function runSkillListCommand(options: SkillListCommandOptions): void {
  const config = loadConfig(options.root);
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

  if (options.json) {
    writeJson({
      command: "list",
      kind: "skill",
      count: skills.length,
      items: skills.map(toSkillSummaryJson),
    });
    return;
  }

  writeCount(skills.length, skills.length === 0 ? "no skills matched current filters" : undefined);
  for (const skill of skills) {
    console.log(formatSkillCard(skill));
  }
}

export function runSkillShowCommand(options: SkillShowCommandOptions): void {
  const config = loadConfig(options.root);
  const slug = normalizeSlug(options.slug);
  const { index, rebuilt, stale } = loadSkillsIndex({
    root: options.root,
    config,
    useCache: !options.noCache,
    allowReindex: !options.noReindex,
  });
  if (stale && !rebuilt && !options.noCache) {
    console.error("warning: skills index is stale; run mdkg index to refresh");
  }
  const skill = index.skills[slug];
  if (!skill) {
    throw new NotFoundError(`skill not found: ${slug}`);
  }

  const skillPath = path.resolve(options.root, skill.path);
  let body = "";
  if (!options.metaOnly) {
    if (!fs.existsSync(skillPath)) {
      throw new NotFoundError(`file not found for ${skill.id}: ${skill.path}`);
    }
    body = fs.readFileSync(skillPath, "utf8").trimEnd();
  }

  if (options.json) {
    writeJson({
      command: "show",
      kind: "skill",
      item: toSkillDetailJson(skill, options.metaOnly ? undefined : body),
    });
    return;
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

  console.log(body);
}

export function runSkillSearchCommand(options: SkillSearchCommandOptions): void {
  const query = options.query.trim();
  if (!query) {
    throw new UsageError("search query cannot be empty");
  }

  const config = loadConfig(options.root);
  const { index, rebuilt, stale } = loadSkillsIndex({
    root: options.root,
    config,
    useCache: !options.noCache,
    allowReindex: !options.noReindex,
  });
  if (stale && !rebuilt && !options.noCache) {
    console.error("warning: skills index is stale; run mdkg index to refresh");
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const skills = filterSkills(
    Object.values(index.skills),
    options.tags,
    options.tagsMode ?? "any"
  )
    .filter((skill) => matchesSkillQuery(skill, terms))
    .sort((a, b) => a.qid.localeCompare(b.qid));

  if (options.json) {
    writeJson({
      command: "search",
      kind: "skill",
      count: skills.length,
      items: skills.map(toSkillSummaryJson),
    });
    return;
  }

  writeCount(skills.length, skills.length === 0 ? `no skills matched query "${query}"` : undefined);
  for (const skill of skills) {
    console.log(formatSkillCard(skill));
  }
}

export function runSkillValidateCommand(options: SkillValidateCommandOptions): void {
  const config = loadConfig(options.root);
  const targetSlug = options.slug?.trim().toLowerCase();

  const warnings: string[] = [];
  const errors: string[] = [];

  if (targetSlug) {
    const result = validateSingleSkill(options.root, normalizeSlug(targetSlug));
    warnings.push(...result.warnings);
    errors.push(...result.errors);
  } else {
    const skillsRoot = resolveSkillsRoot(options.root, config);
    if (fs.existsSync(skillsRoot)) {
      const entries = fs.readdirSync(skillsRoot, { withFileTypes: true });
      for (const entry of entries.filter((value) => value.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
        const result = validateSingleSkill(options.root, entry.name.toLowerCase());
        warnings.push(...result.warnings);
        errors.push(...result.errors);
      }
    }
  }

  for (const warning of Array.from(new Set(warnings))) {
    console.error(`warning: ${warning}`);
  }
  if (errors.length > 0) {
    for (const error of Array.from(new Set(errors))) {
      console.error(error);
    }
    throw new ValidationError(`skill validation failed with ${Array.from(new Set(errors)).length} error(s)`);
  }

  if (targetSlug) {
    console.log(`skill validation ok: ${targetSlug} (1 skill checked)`);
    return;
  }
  const checkedCount = fs.existsSync(resolveSkillsRoot(options.root, config))
    ? fs
        .readdirSync(resolveSkillsRoot(options.root, config), { withFileTypes: true })
        .filter((value) => value.isDirectory()).length
    : 0;
  console.log(`skill validation ok: ${checkedCount} skill${checkedCount === 1 ? "" : "s"} checked`);
}
