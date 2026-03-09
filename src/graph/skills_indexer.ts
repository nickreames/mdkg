import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { FrontmatterValue, parseFrontmatter } from "./frontmatter";

export const SKILLS_INDEX_RELATIVE_PATH = ".mdkg/index/skills.json";

const SKILL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type SkillIndexEntry = {
  slug: string;
  id: string;
  qid: string;
  ws: string;
  type: "skill";
  name: string;
  description: string;
  tags: string[];
  version?: string;
  authors: string[];
  links: string[];
  path: string;
  has_scripts: boolean;
  has_references: boolean;
  ochatr: Record<string, FrontmatterValue>;
};

export type SkillsIndex = {
  meta: {
    tool: string;
    schema_version: number;
    generated_at: string;
    root: string;
    skills_root: string;
    skill_count: number;
  };
  skills: Record<string, SkillIndexEntry>;
};

type SkillDocCandidate = {
  slug: string;
  filePath: string;
};

function listSkillMarkdownFiles(dir: string): SkillDocCandidate[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: SkillDocCandidate[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const slug = entry.name.toLowerCase();
    const skillDir = path.join(dir, entry.name);
    const canonicalPath = path.join(skillDir, "SKILL.md");
    const compatPath = path.join(skillDir, "SKILLS.md");
    if (fs.existsSync(canonicalPath) && fs.existsSync(compatPath)) {
      throw new Error(`${skillDir}: both SKILL.md and SKILLS.md exist`);
    }
    if (fs.existsSync(canonicalPath)) {
      files.push({ slug, filePath: canonicalPath });
      continue;
    }
    if (fs.existsSync(compatPath)) {
      files.push({ slug, filePath: compatPath });
    }
  }
  files.sort((a, b) => a.slug.localeCompare(b.slug));
  return files;
}

function requireString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string {
  const value = frontmatter[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${filePath}: ${key} is required and must be a non-empty string`);
  }
  return value;
}

function optionalString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string | undefined {
  const value = frontmatter[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${filePath}: ${key} must be a non-empty string when set`);
  }
  return value;
}

function optionalList(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string[] {
  const value = frontmatter[key];
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${filePath}: ${key} must be a list`);
  }
  return value;
}

function toLowercaseList(values: string[]): string[] {
  return values.map((value) => value.toLowerCase());
}

function extractOchatr(frontmatter: Record<string, FrontmatterValue>): Record<string, FrontmatterValue> {
  const keys = Object.keys(frontmatter)
    .filter((key) => key.startsWith("ochatr_"))
    .sort();

  const extracted: Record<string, FrontmatterValue> = {};
  for (const key of keys) {
    extracted[key] = frontmatter[key];
  }
  return extracted;
}

function hasDirectory(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    return false;
  }
  return fs.statSync(dirPath).isDirectory();
}

function rootWorkspaceMdkgPath(root: string, config: Config): string {
  const rootWs = config.workspaces.root;
  if (rootWs && rootWs.enabled) {
    return path.resolve(root, rootWs.path, rootWs.mdkg_dir);
  }
  return path.resolve(root, ".mdkg");
}

export function resolveSkillsRoot(root: string, config: Config): string {
  return path.join(rootWorkspaceMdkgPath(root, config), "skills");
}

export function resolveSkillsIndexPath(root: string): string {
  return path.resolve(root, SKILLS_INDEX_RELATIVE_PATH);
}

export function buildSkillsIndex(root: string, config: Config): SkillsIndex {
  const skillsRoot = resolveSkillsRoot(root, config);
  const files = listSkillMarkdownFiles(skillsRoot);
  const skills: Record<string, SkillIndexEntry> = {};

  for (const file of files) {
    const { slug, filePath } = file;
    if (!SKILL_SLUG_RE.test(slug)) {
      throw new Error(`${filePath}: skill slug must be kebab-case`);
    }
    if (skills[slug]) {
      throw new Error(`${filePath}: duplicate skill slug ${slug}`);
    }

    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter } = parseFrontmatter(content, filePath);
    const name = requireString(frontmatter, "name", filePath);
    const description = requireString(frontmatter, "description", filePath);
    const version = optionalString(frontmatter, "version", filePath);
    const tags = toLowercaseList(optionalList(frontmatter, "tags", filePath));
    const authors = toLowercaseList(optionalList(frontmatter, "authors", filePath));
    const links = optionalList(frontmatter, "links", filePath);
    const skillDir = path.dirname(filePath);

    skills[slug] = {
      slug,
      id: `skill:${slug}`,
      qid: `root:skill:${slug}`,
      ws: "root",
      type: "skill",
      name,
      description,
      tags,
      version,
      authors,
      links,
      path: path.relative(root, filePath),
      has_scripts: hasDirectory(path.join(skillDir, "scripts")),
      has_references: hasDirectory(path.join(skillDir, "references")),
      ochatr: extractOchatr(frontmatter),
    };
  }

  const sortedSkills: Record<string, SkillIndexEntry> = {};
  for (const slug of Object.keys(skills).sort()) {
    sortedSkills[slug] = skills[slug];
  }

  return {
    meta: {
      tool: config.tool,
      schema_version: config.schema_version,
      generated_at: new Date().toISOString(),
      root,
      skills_root: path.relative(root, skillsRoot),
      skill_count: Object.keys(sortedSkills).length,
    },
    skills: sortedSkills,
  };
}
