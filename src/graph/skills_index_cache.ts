import fs from "fs";
import path from "path";
import { configPath } from "../core/paths";
import { writeCacheFile } from "./cache_output";
import { Config } from "../core/config";
import { withContainedPathSink } from "../core/filesystem_authority";
import {
  buildSkillsIndex,
  resolveSkillsIndexPath,
  resolveSkillsRoot,
  SkillsIndex,
  currentSkillCacheSources,
} from "./skills_indexer";
import { readJsonCacheFingerprint, readJsonCacheText, skillCacheFingerprint } from "./json_cache_fingerprint";
import { cacheSourceStats } from "./cache_sources";

export type LoadSkillsIndexOptions = {
  root: string;
  config: Config;
  useCache?: boolean;
  allowReindex?: boolean;
  persistReindex?: boolean;
};

export type LoadSkillsIndexResult = {
  index: SkillsIndex;
  rebuilt: boolean;
  stale: boolean;
};

function mtimeMs(filePath: string): number {
  return fs.statSync(filePath).mtimeMs;
}

export function isSkillsIndexStale(root: string, config: Config): boolean {
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
  for (const item of cacheSourceStats(root, skillsRoot, config.index.limits)) {
    if (item.mtimeMs > indexMtime) {
      return true;
    }
  }
  const fingerprint = readJsonCacheFingerprint(root, indexPath, "skills");
  return !fingerprint || fingerprint !== skillCacheFingerprint(config, currentSkillCacheSources(root, config));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readSkillsIndex(root: string, indexPath: string): SkillsIndex {
  try {
    const parsed = JSON.parse(readJsonCacheText(root, indexPath)) as unknown;
    if (!isRecord(parsed) || !isRecord(parsed.meta) || !isRecord(parsed.skills)) {
      throw new Error("skills index cache has an invalid shape");
    }
    return parsed as unknown as SkillsIndex;
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    throw new Error(`failed to read skills index: ${message}`);
  }
}

function validateCachedSkillPaths(root: string, config: Config, cached: SkillsIndex): SkillsIndex {
  const skillsRoot = resolveSkillsRoot(root, config);
  for (const [slug, skill] of Object.entries(cached.skills)) {
    if (skill.slug !== slug || skill.id !== `skill:${slug}` || skill.qid !== `${skill.ws}:skill:${slug}`) {
      throw new Error(`invalid cached skill identity: ${slug}`);
    }
    const absolutePath = path.resolve(root, skill.path);
    const relativeSkillsPath = path.relative(skillsRoot, absolutePath);
    if (path.isAbsolute(skill.path) || relativeSkillsPath.startsWith("..") || path.isAbsolute(relativeSkillsPath)) {
      throw new Error(`cached skill path escapes skills root: ${slug}`);
    }
    const normalized = path.relative(root, absolutePath).split(path.sep).join("/");
    withContainedPathSink({ root, relativePath: normalized, operation: "read" }, () => undefined);
  }
  return cached;
}

export function writeSkillsIndex(root: string, indexPath: string, index: SkillsIndex): void {
  const sortedSkills: SkillsIndex["skills"] = {};
  for (const slug of Object.keys(index.skills).sort()) {
    sortedSkills[slug] = index.skills[slug];
  }
  const sortedIndex: SkillsIndex = {
    ...index,
    skills: sortedSkills,
  };
  writeCacheFile(root, indexPath, JSON.stringify(sortedIndex, null, 2));
}

export function loadSkillsIndex(options: LoadSkillsIndexOptions): LoadSkillsIndexResult {
  const useCache = options.useCache ?? true;
  const allowReindex = options.allowReindex ?? options.config.index.auto_reindex;
  const persistReindex = options.persistReindex ?? true;
  const indexPath = resolveSkillsIndexPath(options.root);

  if (!useCache) {
    const index = buildSkillsIndex(options.root, options.config);
    return { index, rebuilt: true, stale: false };
  }

  const stale = isSkillsIndexStale(options.root, options.config);
  if (fs.existsSync(indexPath) && !stale) {
    return {
      index: validateCachedSkillPaths(options.root, options.config, readSkillsIndex(options.root, indexPath)),
      rebuilt: false,
      stale: false,
    };
  }

  if (allowReindex) {
    const index = buildSkillsIndex(options.root, options.config);
    if (persistReindex) {
      writeSkillsIndex(options.root, indexPath, index);
    }
    return { index, rebuilt: true, stale };
  }

  if (fs.existsSync(indexPath)) {
    return {
      index: validateCachedSkillPaths(options.root, options.config, readSkillsIndex(options.root, indexPath)),
      rebuilt: false,
      stale: true,
    };
  }

  throw new Error("skills index missing and auto-reindex is disabled");
}
