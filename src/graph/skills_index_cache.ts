import fs from "fs";
import path from "path";
import { configPath } from "../core/paths";
import { Config } from "../core/config";
import {
  buildSkillsIndex,
  resolveSkillsIndexPath,
  resolveSkillsRoot,
  SkillsIndex,
} from "./skills_indexer";

export type LoadSkillsIndexOptions = {
  root: string;
  config: Config;
  useCache?: boolean;
  allowReindex?: boolean;
};

export type LoadSkillsIndexResult = {
  index: SkillsIndex;
  rebuilt: boolean;
  stale: boolean;
};

function mtimeMs(filePath: string): number {
  return fs.statSync(filePath).mtimeMs;
}

function listFilesAndDirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items: string[] = [dir];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(...listFilesAndDirectories(fullPath));
      continue;
    }
    if (entry.isFile()) {
      items.push(fullPath);
    }
  }
  return items;
}

function isSkillsIndexStale(root: string, config: Config): boolean {
  const indexPath = resolveSkillsIndexPath(root);
  if (!fs.existsSync(indexPath)) {
    return true;
  }

  const indexMtime = mtimeMs(indexPath);
  const cfgPath = configPath(root);
  if (fs.existsSync(cfgPath) && mtimeMs(cfgPath) > indexMtime) {
    return true;
  }

  const skillsRoot = resolveSkillsRoot(root, config);
  for (const item of listFilesAndDirectories(skillsRoot)) {
    if (mtimeMs(item) > indexMtime) {
      return true;
    }
  }
  return false;
}

function readSkillsIndex(indexPath: string): SkillsIndex {
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    return JSON.parse(raw) as SkillsIndex;
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`failed to read skills index: ${message}`);
  }
}

export function writeSkillsIndex(indexPath: string, index: SkillsIndex): void {
  const sortedSkills: SkillsIndex["skills"] = {};
  for (const slug of Object.keys(index.skills).sort()) {
    sortedSkills[slug] = index.skills[slug];
  }
  const sortedIndex: SkillsIndex = {
    ...index,
    skills: sortedSkills,
  };
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, JSON.stringify(sortedIndex, null, 2), "utf8");
}

export function loadSkillsIndex(options: LoadSkillsIndexOptions): LoadSkillsIndexResult {
  const useCache = options.useCache ?? true;
  const allowReindex = options.allowReindex ?? options.config.index.auto_reindex;
  const indexPath = resolveSkillsIndexPath(options.root);

  if (!useCache) {
    const index = buildSkillsIndex(options.root, options.config);
    return { index, rebuilt: true, stale: false };
  }

  const stale = isSkillsIndexStale(options.root, options.config);
  if (fs.existsSync(indexPath) && !stale) {
    return { index: readSkillsIndex(indexPath), rebuilt: false, stale: false };
  }

  if (allowReindex) {
    const index = buildSkillsIndex(options.root, options.config);
    writeSkillsIndex(indexPath, index);
    return { index, rebuilt: true, stale };
  }

  if (fs.existsSync(indexPath)) {
    return { index: readSkillsIndex(indexPath), rebuilt: false, stale: true };
  }

  throw new Error("skills index missing and auto-reindex is disabled");
}
