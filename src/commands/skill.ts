import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import {
  buildSkillIndexEntry,
  buildSkillsIndex,
  resolveSkillsIndexPath,
  resolveSkillsRoot,
  SKILL_SLUG_RE,
} from "../graph/skills_indexer";
import { writeSkillsIndex } from "../graph/skills_index_cache";
import { UsageError, ValidationError, NotFoundError } from "../util/errors";
import { runListCommand } from "./list";
import { runSearchCommand } from "./search";
import { runShowCommand } from "./show";
import {
  ensureSkillsRegistry,
  refreshSkillsRegistry,
  renderSkillTemplate,
} from "./skill_support";

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
};

export type SkillListCommandOptions = {
  root: string;
  tags?: string[];
  tagsMode?: "any" | "all";
  noCache?: boolean;
  noReindex?: boolean;
};

export type SkillShowCommandOptions = {
  root: string;
  slug: string;
  metaOnly?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

export type SkillSearchCommandOptions = {
  root: string;
  query: string;
  tags?: string[];
  tagsMode?: "any" | "all";
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

  console.log(`skill created: root:skill:${slug} (${path.relative(root, canonicalPath)})`);
}

export function runSkillListCommand(options: SkillListCommandOptions): void {
  runListCommand({
    root: options.root,
    type: "skill",
    tags: options.tags,
    tagsMode: options.tagsMode,
    noCache: options.noCache,
    noReindex: options.noReindex,
  });
}

export function runSkillShowCommand(options: SkillShowCommandOptions): void {
  runShowCommand({
    root: options.root,
    id: `skill:${normalizeSlug(options.slug)}`,
    metaOnly: options.metaOnly,
    noCache: options.noCache,
    noReindex: options.noReindex,
  });
}

export function runSkillSearchCommand(options: SkillSearchCommandOptions): void {
  runSearchCommand({
    root: options.root,
    query: options.query,
    type: "skill",
    tags: options.tags,
    tagsMode: options.tagsMode,
    noCache: options.noCache,
    noReindex: options.noReindex,
  });
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
    console.log(`skill validation ok: ${targetSlug}`);
    return;
  }
  console.log("skill validation ok");
}
