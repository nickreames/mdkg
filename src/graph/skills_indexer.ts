import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { forEachContainedDirectoryEntry, readContainedFile } from "../core/filesystem_authority";
import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { absoluteWorkspaceDocumentOwner } from "./workspace_ownership";

export const SKILLS_INDEX_RELATIVE_PATH = ".mdkg/index/skills.json";

export const SKILL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

export type SkillDocCandidate = {
  slug: string;
  filePath: string;
};

export function listSkillMarkdownFiles(dir: string, owns: (file: string) => boolean = () => true,
  maxEntries?: number): SkillDocCandidate[] {
  if (!owns(dir)) return [];
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files: SkillDocCandidate[] = [];
  let count = 0;
  const visit = (entry: fs.Dirent) => {
    if (maxEntries !== undefined && ++count > maxEntries) throw new Error(`${dir}: skill discovery exceeds entry limit`);
    if (!entry.isDirectory()) {
      return;
    }
    const slug = entry.name.toLowerCase();
    const skillDir = path.join(dir, entry.name);
    if (!owns(skillDir)) return;
    const canonicalPath = path.join(skillDir, "SKILL.md");
    const compatPath = path.join(skillDir, "SKILLS.md");
    const canonicalExists = owns(canonicalPath) && fs.existsSync(canonicalPath);
    const compatExists = owns(compatPath) && fs.existsSync(compatPath);
    if (canonicalExists && compatExists) {
      throw new Error(`${skillDir}: both SKILL.md and SKILLS.md exist`);
    }
    if (canonicalExists) {
      files.push({ slug, filePath: canonicalPath });
      return;
    }
    if (compatExists) {
      files.push({ slug, filePath: compatPath });
    }
  };
  if (maxEntries === undefined) fs.readdirSync(dir, { withFileTypes: true }).forEach(visit);
  else forEachContainedDirectoryEntry({ root: dir, relativePath: "." }, visit);
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

function hasDirectory(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    return false;
  }
  const stat = fs.lstatSync(dirPath);
  return !stat.isSymbolicLink() && stat.isDirectory();
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

export function buildSkillIndexEntryForWorkspace(
  root: string,
  workspace: string,
  slug: string,
  filePath: string,
  readDocument?: (filePath: string) => string
): SkillIndexEntry {
  if (!SKILL_SLUG_RE.test(slug)) {
    throw new Error(`${filePath}: skill slug must be kebab-case`);
  }

  const relativePath = path.relative(root, filePath).split(path.sep).join("/");
  const content = readDocument ? readDocument(filePath) : readContainedFile({ root, relativePath });
  const { frontmatter } = parseFrontmatter(content, filePath);
  const name = requireString(frontmatter, "name", filePath);
  const description = requireString(frontmatter, "description", filePath);
  const version = optionalString(frontmatter, "version", filePath);
  const tags = toLowercaseList(optionalList(frontmatter, "tags", filePath));
  const authors = toLowercaseList(optionalList(frontmatter, "authors", filePath));
  const links = optionalList(frontmatter, "links", filePath);
  const skillDir = path.dirname(filePath);

  return {
    slug,
    id: `skill:${slug}`,
    qid: `${workspace}:skill:${slug}`,
    ws: workspace,
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
  };
}

export function buildSkillIndexEntry(root: string, slug: string, filePath: string): SkillIndexEntry {
  return buildSkillIndexEntryForWorkspace(root, "root", slug, filePath);
}

export function buildSkillsIndex(root: string, config: Config,
  options: { maxEntries?: number; readDocument?: (filePath: string) => string } = {}): SkillsIndex {
  const skillsRoot = resolveSkillsRoot(root, config);
  const owner = absoluteWorkspaceDocumentOwner(root, config);
  const files = listSkillMarkdownFiles(skillsRoot, (file) => owner(file) === "root", options.maxEntries);
  const skills: Record<string, SkillIndexEntry> = {};

  for (const file of files) {
    const { slug, filePath } = file;
    if (skills[slug]) {
      throw new Error(`${filePath}: duplicate skill slug ${slug}`);
    }
    skills[slug] = buildSkillIndexEntryForWorkspace(root, "root", slug, filePath, options.readDocument);
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
