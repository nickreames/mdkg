import fs from "fs";
import path from "path";
import { Config, defaultCustomizationConfig, DEFAULT_INDEX_LIMITS } from "../core/config";
import {
  atomicReplaceContainedFile,
  containedPathExists,
  ensureContainedDirectory,
  forEachContainedDirectoryEntry,
  readContainedFile,
  withContainedPathSink,
  withContainedTreeSink,
} from "../core/filesystem_authority";
import { buildSkillIndexEntryForWorkspace, buildSkillsIndex, resolveSkillsRoot, SKILL_SLUG_RE, SkillsIndex } from "../graph/skills_indexer";
import { UsageError } from "../util/errors";
import { assertNoGitMetadataDestinations } from "../util/git_metadata";
import { normalizeContainedWorkspacePath, workspaceDocumentRootKey } from "../core/workspace_path";

const MANIFEST_FILE = ".mdkg-managed.json";
const MANAGED_ROOT_MARKERS = [
  path.join(".mdkg", "core", "SOUL.md"),
  path.join(".mdkg", "core", "COLLABORATION.md"),
  path.join(".mdkg", "core", "HUMAN.md"),
];
const ALLOWED_ROOT_ENTRIES = ["SKILL.md", "references", "assets", "scripts"];

type MirrorTarget = {
  boundaryRoot: string;
  configuredPath: string;
  relativeSkillsRoot: string;
  rootDir: string;
  skillsRoot: string;
  manifestPath: string;
};

type MirrorManifest = {
  managed_slugs: string[];
};

type SkillTree = Map<string, Buffer | null>;
type SkillMirrorSource = { slug: string; entries: SkillTree };
type InventoryBudget = { bytes: number; entries: number };

export type SyncSkillMirrorsOptions = {
  root: string;
  config: Config;
  force?: boolean;
  createRoots?: boolean;
};

export type SyncSkillMirrorsResult = {
  synced: number;
  pruned: number;
  targets: number;
};

export type PreflightSkillMirrorTargetsOptions = {
  root: string;
  slugs: string[];
  config?: Config;
  force?: boolean;
};

export function configuredSkillMirrorTargets(config?: Config): string[] {
  const configured = config?.customization.skill_mirrors.targets ?? defaultCustomizationConfig().skill_mirrors.targets;
  return configured.map(value => {
    const safe = normalizeContainedWorkspacePath(value, "skill mirror target");
    return safe.split(/[\\/]+/).filter(part => part && part !== ".").join("/");
  });
}

export function admitSkillMirrorTargets(root: string, config?: Config): string[] {
  const targets = configuredSkillMirrorTargets(config);
  // Admit the entire policy before filesystem observations or writes. Fold
  // component paths portably, including on case-sensitive Linux hosts.
  const overlaps = (left: string, right: string): boolean => left === right ||
    left.startsWith(`${right}/`) || right.startsWith(`${left}/`);
  const canonicalRoots = [".mdkg", ...Object.values(config?.workspaces ?? {}).map(ws =>
    workspaceDocumentRootKey(ws.path, ws.mdkg_dir))].map(value => value.toLowerCase());
  for (const [index, target] of targets.entries()) {
    const key = target.toLowerCase();
    if (!key || canonicalRoots.some(canonical => overlaps(key, canonical))) {
      throw new UsageError(`skill mirror target overlaps canonical graph storage: ${target || "."}`);
    }
    if (targets.slice(0, index).some(other => overlaps(key, other.toLowerCase()))) {
      throw new UsageError(`skill mirror targets overlap or alias each other: ${target}`);
    }
  }
  assertNoGitMetadataDestinations(root, targets);
  let entries = 0;
  const maxEntries = config?.index.limits.max_files ?? 20000;
  const maxDepth = config?.index.limits.max_depth ?? 64;
  // A managed stale slug can itself contain a repository. Reject it before
  // recursive pruning or replacement; do not follow directory symlinks.
  function inspect(relativePath: string, depth: number): void {
    if (++entries > maxEntries || depth > maxDepth) throw new UsageError("Git metadata destination inventory exceeds entry/depth limit");
    const input = { root, relativePath, pathSyntax: "native" as const };
    if (!containedPathExists(input)) return;
    const stat = withContainedPathSink({ ...input, operation: "read" }, ({ absolutePath }) => fs.lstatSync(absolutePath));
    if (!stat.isDirectory()) return;
    const names: string[] = [];
    forEachContainedDirectoryEntry(input, entry => {
      if (entries + names.length >= maxEntries) throw new UsageError("Git metadata destination inventory exceeds entry/depth limit");
      names.push(entry.name);
    });
    if (names.some(name => name.toLowerCase() === ".git") || ["HEAD", "objects", "config"].every(name => names.includes(name))) {
      throw new UsageError(`skill mirror contains native Git metadata: ${relativePath}`);
    }
    for (const name of names) inspect(path.join(relativePath, name), depth + 1);
  }
  let manifestBytes = 0;
  for (const target of targets) {
    inspect(target, 0);
    const relativePath = `${target}/${MANIFEST_FILE}`;
    if (containedPathExists({ root, relativePath })) {
      const bytes = readContainedFile({ root, relativePath,
        maxBytes: Math.min(config?.index.limits.max_file_bytes ?? DEFAULT_INDEX_LIMITS.max_file_bytes,
          (config?.index.limits.max_total_bytes ?? DEFAULT_INDEX_LIMITS.max_total_bytes) - manifestBytes) }, null);
      manifestBytes += bytes.length;
    }
  }
  return targets;
}

function resolveMirrorTargets(root: string, config?: Config): MirrorTarget[] {
  return admitSkillMirrorTargets(root, config).map((configuredPath) => {
    const skillsRoot = path.join(root, configuredPath);
    return {
      boundaryRoot: root,
      configuredPath,
      relativeSkillsRoot: configuredPath.split(/[\\/]/).join("/"),
      rootDir: path.dirname(skillsRoot),
      skillsRoot,
      manifestPath: path.join(skillsRoot, MANIFEST_FILE),
    };
  });
}

function readManifest(target: MirrorTarget, config?: Config): Set<string> {
  const relativeManifest = `${target.relativeSkillsRoot}/${MANIFEST_FILE}`;
  if (!containedPathExists({ root: target.boundaryRoot, relativePath: relativeManifest })) {
    return new Set();
  }
  // Authority/resource refusal must not be mistaken for malformed optional
  // metadata. Preserve the existing empty-set treatment only for bounded JSON.
  const raw = readContainedFile({ root: target.boundaryRoot, relativePath: relativeManifest,
    maxBytes: Math.min(config?.index.limits.max_file_bytes ?? DEFAULT_INDEX_LIMITS.max_file_bytes,
      config?.index.limits.max_total_bytes ?? DEFAULT_INDEX_LIMITS.max_total_bytes) });
  try {
    const parsed = JSON.parse(raw) as MirrorManifest;
    if (!Array.isArray(parsed.managed_slugs)) {
      return new Set();
    }
    const slugs = parsed.managed_slugs.map((value) => String(value).trim().toLowerCase());
    if (slugs.some((slug) => !SKILL_SLUG_RE.test(slug))) {
      return new Set();
    }
    return new Set(slugs);
  } catch {
    return new Set();
  }
}

function writeManifest(target: MirrorTarget, managed: Iterable<string>): void {
  const payload: MirrorManifest = {
    managed_slugs: Array.from(new Set(Array.from(managed).map((value) => value.toLowerCase()))).sort(),
  };
  ensureContainedDirectory({ root: target.boundaryRoot, relativePath: target.relativeSkillsRoot });
  atomicReplaceContainedFile(
    { root: target.boundaryRoot, relativePath: `${target.relativeSkillsRoot}/${MANIFEST_FILE}` },
    `${JSON.stringify(payload, null, 2)}\n`
  );
}

function shouldCreateMirrorRoots(root: string, config?: Config): boolean {
  if (MANAGED_ROOT_MARKERS.some((relPath) => fs.existsSync(path.join(root, relPath)))) {
    return true;
  }
  return resolveMirrorTargets(root, config).some((target) => fs.existsSync(target.rootDir) || fs.existsSync(target.skillsRoot));
}

// Retain bytes, not source paths: no source is reopened after mirror mutation
// begins. The existing index limits also bound resource files, total bytes,
// entries (including empty directories), and depth across all selected skills.
function inventoryEntry(root: string, relativePath: string, key: string, entries: SkillTree,
  config: Config, budget: InventoryBudget, depth: number, fileOnly = false): void {
  if (++budget.entries > config.index.limits.max_files || depth > config.index.limits.max_depth) {
    throw new UsageError(`${relativePath}: skill resource inventory exceeds entry/depth limit`);
  }
  const input = { root, relativePath, pathSyntax: "native" as const };
  const stat = withContainedPathSink({ ...input, operation: "read" }, ({ absolutePath }) => fs.lstatSync(absolutePath));
  if (stat.isDirectory() && !fileOnly) {
    entries.set(key, null);
    forEachContainedDirectoryEntry(input, (entry) => {
      inventoryEntry(root, path.join(relativePath, entry.name), path.join(key, entry.name), entries, config, budget, depth + 1);
    });
  } else {
    const bytes = readContainedFile({ ...input,
      maxBytes: Math.min(config.index.limits.max_file_bytes, config.index.limits.max_total_bytes - budget.bytes) }, null);
    budget.bytes += bytes.length;
    entries.set(key, bytes);
  }
}

type PendingSkillSource = { slug: string; filePath: string; content: string; withScripts?: boolean };

function loadCanonicalSources(root: string, config: Config, pending?: PendingSkillSource): SkillMirrorSource[] {
  const budget = { bytes: 0, entries: 0 };
  const documents = new Map<string, SkillTree>();
  // Discovery and parsing must consume the same bounded snapshot as projection,
  // rather than parsing an unbounded document before enforcing resource limits.
  containedPathExists({ root, relativePath: path.relative(root, resolveSkillsRoot(root, config)), pathSyntax: "native" });
  const readDocument = (filePath: string) => {
      const entries: SkillTree = new Map();
      const relativePath = path.relative(root, filePath);
      if (pending && path.resolve(filePath) === path.resolve(pending.filePath)) {
        const bytes = Buffer.from(pending.content, "utf8");
        if (++budget.entries > config.index.limits.max_files) throw new UsageError("skill resource inventory exceeds entry/depth limit");
        if (bytes.length > Math.min(config.index.limits.max_file_bytes, config.index.limits.max_total_bytes - budget.bytes)) throw new UsageError("skill resource exceeds byte limit");
        budget.bytes += bytes.length; entries.set("SKILL.md", bytes);
      } else inventoryEntry(root, relativePath, "SKILL.md", entries, config, budget, 0, true);
      documents.set(relativePath, entries);
      return (entries.get("SKILL.md") as Buffer).toString("utf8");
  };
  const index = buildSkillsIndex(root, config, { maxEntries: config.index.limits.max_files, readDocument });
  if (pending && !index.skills[pending.slug]) {
    index.skills[pending.slug] = buildSkillIndexEntryForWorkspace(root, "root", pending.slug, pending.filePath, readDocument);
  }
  return Object.values(index.skills).sort((a, b) => a.slug.localeCompare(b.slug)).map((entry) => {
    const entries = documents.get(entry.path) as SkillTree;
    for (const name of ALLOWED_ROOT_ENTRIES.slice(1)) {
      const relativePath = path.join(path.dirname(entry.path), name);
      const input = { root, relativePath, pathSyntax: "native" as const };
      const required = pending?.slug === entry.slug && (name === "references" || name === "assets" || name === "scripts" && pending.withScripts);
      if (!containedPathExists(input)) {
        if (required) {
          if (++budget.entries > config.index.limits.max_files) throw new UsageError("skill resource inventory exceeds entry/depth limit");
          entries.set(name, null);
        }
        continue;
      }
      const stat = withContainedPathSink({ ...input, operation: "read" }, ({ absolutePath }) => fs.lstatSync(absolutePath));
      // Historical regular files at resource-directory names are not projected.
      // Links and special files are never silently accepted.
      if (stat.isFile()) {
        if (required) throw new UsageError(`${relativePath}: pending skill resource must be a directory`);
        continue;
      }
      inventoryEntry(root, relativePath, name, entries, config, budget, 0);
    }
    return { slug: entry.slug, entries };
  });
}

// The authoring command will preserve resources and add required empty
// directories. Admit that exact prospective source before any of those writes.
export function preflightPendingSkillMirrors(root: string, config: Config, pending: PendingSkillSource, force = false): void {
  const sources = loadCanonicalSources(root, config, pending);
  preflightSkillMirrorTargets({ root, config, slugs: sources.map(source => source.slug), force });
}

function materializeSkillMirror(root: string, source: SkillMirrorSource, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  // Destination ancestry/tree was validated by the caller. Prune only this
  // managed skill, retaining directories and byte-identical files in place.
  const prune = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const key = path.join(prefix, entry.name), absolute = path.join(dir, entry.name);
      const expected = source.entries.get(key);
      if (expected === undefined || entry.isDirectory() !== (expected === null)) {
        fs.rmSync(absolute, { recursive: true, force: true });
      } else if (entry.isDirectory()) prune(absolute, key);
    }
  };
  prune(destDir, "");
  for (const [key, bytes] of [...source.entries].sort(([a], [b]) => a.localeCompare(b))) {
    const relativePath = path.relative(root, path.join(destDir, key));
    const input = { root, relativePath, pathSyntax: "native" as const };
    if (bytes === null) { ensureContainedDirectory(input); continue; }
    let mode: number | undefined;
    if (containedPathExists(input)) {
      const stat = fs.lstatSync(path.join(root, relativePath));
      mode = stat.mode & 0o777;
      if (!stat.isFile()) throw new UsageError(`${relativePath}: managed mirror target must be a regular file`);
      if (stat.size === bytes.length && readContainedFile({ ...input, maxBytes: bytes.length }, null).equals(bytes)) continue;
    }
    ensureContainedDirectory({ root, relativePath: path.dirname(relativePath), pathSyntax: "native" });
    atomicReplaceContainedFile({ ...input, mode }, bytes);
    // O_CREAT applies the current umask even to an explicit mode. Preserve the
    // existing mirror's permissions after replacing its inode, as in-place
    // updates did, without modifying a hard-linked peer.
    if (mode !== undefined) withContainedPathSink({ ...input, operation: "replace" }, ({ absolutePath }) => fs.chmodSync(absolutePath, mode));
  }
}

function isManagedSkillTreeInSync(root: string, source: SkillMirrorSource, destDir: string, config: Config,
  budget: InventoryBudget): boolean {
  const actual: SkillTree = new Map();
  let unexpected = false;
  forEachContainedDirectoryEntry({ root, relativePath: path.relative(root, destDir), pathSyntax: "native" }, (entry) => {
    if (!ALLOWED_ROOT_ENTRIES.includes(entry.name)) { unexpected = true; return; }
    inventoryEntry(root, path.relative(root, path.join(destDir, entry.name)), entry.name, actual, config, budget, 0);
  });
  if (unexpected || source.entries.size !== actual.size) return false;
  for (const [key, bytes] of source.entries) {
    const current = actual.get(key);
    if (bytes === null ? current !== null : !Buffer.isBuffer(current) || !bytes.equals(current)) return false;
  }
  return true;
}

export function syncSkillMirrors(options: SyncSkillMirrorsOptions): SyncSkillMirrorsResult {
  const createRoots = Boolean(options.createRoots);
  const force = Boolean(options.force);
  const targets = resolveMirrorTargets(options.root, options.config).filter((target) =>
    createRoots || fs.existsSync(target.skillsRoot) || fs.existsSync(target.rootDir));
  if (targets.length === 0) return { synced: 0, pruned: 0, targets: 0 };
  const sources = loadCanonicalSources(options.root, options.config);
  preflightSkillMirrorTargets({ root: options.root, config: options.config,
    slugs: sources.map(source => source.slug), force });
  let synced = 0;
  let pruned = 0;
  let touchedTargets = 0;

  for (const target of targets) {
    const shouldManageTarget = createRoots || fs.existsSync(target.skillsRoot) || fs.existsSync(target.rootDir);
    if (!shouldManageTarget) {
      continue;
    }
    touchedTargets += 1;
    ensureContainedDirectory({ root: options.root, relativePath: target.relativeSkillsRoot });
    withContainedTreeSink(
      { root: options.root, relativePath: target.relativeSkillsRoot, operation: "replace" },
      () => {
        const managed = readManifest(target, options.config);

        for (const source of sources) {
          const destDir = path.join(target.skillsRoot, source.slug);
          const exists = fs.existsSync(destDir);
          if (exists && !managed.has(source.slug) && !force) {
            throw new UsageError(
              `${path.relative(options.root, destDir)} already exists and is not mdkg-managed; rerun \`mdkg skill sync --force\` to replace it`
            );
          }
          materializeSkillMirror(options.root, source, destDir);
          managed.add(source.slug);
          synced += 1;
        }

        for (const slug of Array.from(managed)) {
          if (sources.some((source) => source.slug === slug)) {
            continue;
          }
          const destDir = path.join(target.skillsRoot, slug);
          if (fs.existsSync(destDir)) {
            fs.rmSync(destDir, { recursive: true, force: true });
            pruned += 1;
          }
          managed.delete(slug);
        }

        writeManifest(target, managed);
      }
    );
  }

  return { synced, pruned, targets: touchedTargets };
}

export function preflightSkillMirrorTargets(options: PreflightSkillMirrorTargetsOptions): void {
  const targets = resolveMirrorTargets(options.root, options.config);
  if (options.force) {
    return;
  }
  const slugs = Array.from(new Set(options.slugs.map((value) => value.trim().toLowerCase()).filter(Boolean)));
  if (slugs.length === 0) {
    return;
  }
  for (const target of targets) {
    if (!fs.existsSync(target.rootDir) && !fs.existsSync(target.skillsRoot)) {
      continue;
    }
    const managed = readManifest(target, options.config);
    for (const slug of slugs) {
      const destDir = path.join(target.skillsRoot, slug);
      if (fs.existsSync(destDir) && !managed.has(slug)) {
        throw new UsageError(
          `${path.relative(options.root, destDir)} already exists and is not mdkg-managed; rerun \`mdkg init --agent --force\` or \`mdkg skill sync --force\` to replace it`
        );
      }
    }
  }
}

export function shouldMaintainSkillMirrors(root: string, config?: Config): boolean {
  return shouldCreateMirrorRoots(root, config);
}

export function auditSkillMirrors(root: string, config: Config): string[] {
  const targets = resolveMirrorTargets(root, config);
  const shouldAudit = targets.length > 0 && shouldCreateMirrorRoots(root, config);
  if (!shouldAudit) {
    return [];
  }

  const warnings: string[] = [];
  const sources = loadCanonicalSources(root, config);
  const sourceBySlug = new Map(sources.map((source) => [source.slug, source]));

  for (const target of targets) {
    const budget = { bytes: 0, entries: 0 };
    if (!fs.existsSync(target.skillsRoot)) {
      warnings.push(`${path.relative(root, target.skillsRoot)}: mirror root missing; run \`mdkg skill sync\``);
      continue;
    }

    const managed = readManifest(target, config);
    if (!fs.existsSync(target.manifestPath)) {
      warnings.push(`${path.relative(root, target.manifestPath)}: mirror manifest missing; run \`mdkg skill sync\``);
    }

    for (const source of sources) {
      const destDir = path.join(target.skillsRoot, source.slug);
      if (!fs.existsSync(destDir)) {
        warnings.push(`${path.relative(root, destDir)}: missing mirrored skill; run \`mdkg skill sync\``);
        continue;
      }
      if (!managed.has(source.slug)) {
        warnings.push(`${path.relative(root, destDir)}: conflicting unmanaged mirror; rerun \`mdkg skill sync --force\` to replace it`);
        continue;
      }
      if (!isManagedSkillTreeInSync(root, source, destDir, config, budget)) {
        warnings.push(`${path.relative(root, destDir)}: mirrored skill drift detected; run \`mdkg skill sync\``);
      }
    }

    for (const slug of managed) {
      if (!sourceBySlug.has(slug)) {
        warnings.push(`${path.relative(root, path.join(target.skillsRoot, slug))}: stale mirrored skill; run \`mdkg skill sync\``);
      }
    }
  }

  return warnings;
}

export function scaffoldMirrorRoots(root: string, config?: Config): void {
  for (const target of resolveMirrorTargets(root, config)) {
    ensureContainedDirectory({ root, relativePath: target.relativeSkillsRoot });
    if (!containedPathExists({ root, relativePath: `${target.relativeSkillsRoot}/${MANIFEST_FILE}` })) {
      writeManifest(target, []);
    }
  }
}
