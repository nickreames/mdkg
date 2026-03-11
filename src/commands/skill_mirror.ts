import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { buildSkillsIndex, resolveSkillsRoot, SkillsIndex } from "../graph/skills_indexer";
import { UsageError } from "../util/errors";

const MIRROR_PRODUCTS = ["agents", "claude"] as const;
const MANIFEST_FILE = ".mdkg-managed.json";
const MANAGED_ROOT_MARKERS = [
  path.join(".mdkg", "core", "SOUL.md"),
  path.join(".mdkg", "core", "HUMAN.md"),
];
const ALLOWED_ROOT_ENTRIES = ["SKILL.md", "references", "assets", "scripts"];

type MirrorProduct = (typeof MIRROR_PRODUCTS)[number];

type MirrorTarget = {
  product: MirrorProduct;
  rootDir: string;
  skillsRoot: string;
  manifestPath: string;
};

type MirrorManifest = {
  managed_slugs: string[];
};

type SkillMirrorSource = {
  slug: string;
  sourceDir: string;
  docPath: string;
};

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

function resolveMirrorTargets(root: string): MirrorTarget[] {
  return MIRROR_PRODUCTS.map((product) => {
    const rootDir = path.join(root, `.${product}`);
    const skillsRoot = path.join(rootDir, "skills");
    return {
      product,
      rootDir,
      skillsRoot,
      manifestPath: path.join(skillsRoot, MANIFEST_FILE),
    };
  });
}

function readManifest(target: MirrorTarget): Set<string> {
  if (!fs.existsSync(target.manifestPath)) {
    return new Set();
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(target.manifestPath, "utf8")) as MirrorManifest;
    if (!Array.isArray(parsed.managed_slugs)) {
      return new Set();
    }
    return new Set(
      parsed.managed_slugs
        .map((value) => String(value).trim().toLowerCase())
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
}

function writeManifest(target: MirrorTarget, managed: Iterable<string>): void {
  const payload: MirrorManifest = {
    managed_slugs: Array.from(new Set(Array.from(managed).map((value) => value.toLowerCase()))).sort(),
  };
  fs.mkdirSync(target.skillsRoot, { recursive: true });
  fs.writeFileSync(target.manifestPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function shouldCreateMirrorRoots(root: string): boolean {
  if (MANAGED_ROOT_MARKERS.some((relPath) => fs.existsSync(path.join(root, relPath)))) {
    return true;
  }
  return resolveMirrorTargets(root).some((target) => fs.existsSync(target.rootDir) || fs.existsSync(target.skillsRoot));
}

function listAllowedEntries(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const entries: string[] = [];
  const queue: string[] = [dirPath];
  while (queue.length > 0) {
    const current = queue.shift() as string;
    const dirEntries = fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of dirEntries) {
      const fullPath = path.join(current, entry.name);
      const relPath = path.relative(dirPath, fullPath).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        entries.push(`${relPath}/`);
        queue.push(fullPath);
      } else if (entry.isFile()) {
        entries.push(relPath);
      }
    }
  }
  return entries.sort();
}

function resolveSkillDocPath(skillDir: string): string {
  const canonicalPath = path.join(skillDir, "SKILL.md");
  const compatPath = path.join(skillDir, "SKILLS.md");
  if (fs.existsSync(canonicalPath) && fs.existsSync(compatPath)) {
    throw new UsageError(`${skillDir}: both SKILL.md and SKILLS.md exist; fix the canonical skill first`);
  }
  if (fs.existsSync(canonicalPath)) {
    return canonicalPath;
  }
  if (fs.existsSync(compatPath)) {
    return compatPath;
  }
  throw new UsageError(`${skillDir}: missing SKILL.md or SKILLS.md`);
}

function loadCanonicalSources(root: string, config: Config): SkillMirrorSource[] {
  const index = buildSkillsIndex(root, config);
  return Object.values(index.skills)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((entry) => {
      const docPath = path.resolve(root, entry.path);
      return {
        slug: entry.slug,
        sourceDir: path.dirname(docPath),
        docPath,
      };
    });
}

function copyDir(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function materializeSkillMirror(source: SkillMirrorSource, destDir: string): void {
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(source.docPath, path.join(destDir, "SKILL.md"));
  for (const entry of ["references", "assets", "scripts"]) {
    const srcPath = path.join(source.sourceDir, entry);
    if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, path.join(destDir, entry));
    }
  }
}

function collectExpectedSkillTree(source: SkillMirrorSource): Map<string, string> {
  const expected = new Map<string, string>();
  expected.set("SKILL.md", fs.readFileSync(source.docPath, "utf8"));
  for (const entry of ["references", "assets", "scripts"]) {
    const srcPath = path.join(source.sourceDir, entry);
    if (!fs.existsSync(srcPath) || !fs.statSync(srcPath).isDirectory()) {
      continue;
    }
    expected.set(`${entry}/`, "dir");
    for (const relPath of listAllowedEntries(srcPath)) {
      const absolute = path.join(srcPath, relPath.replace(/\/$/, ""));
      expected.set(`${entry}/${relPath}`, relPath.endsWith("/") ? "dir" : fs.readFileSync(absolute, "utf8"));
    }
  }
  return expected;
}

function collectActualSkillTree(destDir: string): { entries: Map<string, string>; hasUnexpectedRootEntry: boolean } {
  const entries = new Map<string, string>();
  if (!fs.existsSync(destDir)) {
    return { entries, hasUnexpectedRootEntry: false };
  }

  const rootEntries = fs.readdirSync(destDir, { withFileTypes: true });
  let hasUnexpectedRootEntry = false;
  for (const entry of rootEntries) {
    if (!ALLOWED_ROOT_ENTRIES.includes(entry.name)) {
      hasUnexpectedRootEntry = true;
      continue;
    }
    const fullPath = path.join(destDir, entry.name);
    if (entry.isFile()) {
      entries.set(entry.name, fs.readFileSync(fullPath, "utf8"));
      continue;
    }
    if (!entry.isDirectory()) {
      hasUnexpectedRootEntry = true;
      continue;
    }
    entries.set(`${entry.name}/`, "dir");
    for (const relPath of listAllowedEntries(fullPath)) {
      const absolute = path.join(fullPath, relPath.replace(/\/$/, ""));
      entries.set(`${entry.name}/${relPath}`, relPath.endsWith("/") ? "dir" : fs.readFileSync(absolute, "utf8"));
    }
  }

  return { entries, hasUnexpectedRootEntry };
}

function isManagedSkillTreeInSync(source: SkillMirrorSource, destDir: string): boolean {
  const expected = collectExpectedSkillTree(source);
  const actual = collectActualSkillTree(destDir);
  if (actual.hasUnexpectedRootEntry) {
    return false;
  }
  if (expected.size !== actual.entries.size) {
    return false;
  }
  for (const [relPath, content] of expected.entries()) {
    if (!actual.entries.has(relPath) || actual.entries.get(relPath) !== content) {
      return false;
    }
  }
  return true;
}

export function syncSkillMirrors(options: SyncSkillMirrorsOptions): SyncSkillMirrorsResult {
  const sources = loadCanonicalSources(options.root, options.config);
  const createRoots = Boolean(options.createRoots);
  const force = Boolean(options.force);
  const targets = resolveMirrorTargets(options.root);
  let synced = 0;
  let pruned = 0;
  let touchedTargets = 0;

  for (const target of targets) {
    const shouldManageTarget = createRoots || fs.existsSync(target.skillsRoot) || fs.existsSync(target.rootDir);
    if (!shouldManageTarget) {
      continue;
    }
    touchedTargets += 1;
    fs.mkdirSync(target.skillsRoot, { recursive: true });
    const managed = readManifest(target);

    for (const source of sources) {
      const destDir = path.join(target.skillsRoot, source.slug);
      const exists = fs.existsSync(destDir);
      if (exists && !managed.has(source.slug) && !force) {
        throw new UsageError(
          `${path.relative(options.root, destDir)} already exists and is not mdkg-managed; rerun \`mdkg skill sync --force\` to replace it`
        );
      }
      materializeSkillMirror(source, destDir);
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

  return { synced, pruned, targets: touchedTargets };
}

export function shouldMaintainSkillMirrors(root: string): boolean {
  return shouldCreateMirrorRoots(root);
}

export function auditSkillMirrors(root: string, config: Config): string[] {
  const shouldAudit = shouldCreateMirrorRoots(root);
  if (!shouldAudit) {
    return [];
  }

  const warnings: string[] = [];
  const sources = loadCanonicalSources(root, config);
  const sourceBySlug = new Map(sources.map((source) => [source.slug, source]));

  for (const target of resolveMirrorTargets(root)) {
    if (!fs.existsSync(target.skillsRoot)) {
      warnings.push(`${path.relative(root, target.skillsRoot)}: mirror root missing; run \`mdkg skill sync\``);
      continue;
    }

    const managed = readManifest(target);
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
      if (!isManagedSkillTreeInSync(source, destDir)) {
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

export function scaffoldMirrorRoots(root: string): void {
  for (const target of resolveMirrorTargets(root)) {
    fs.mkdirSync(target.skillsRoot, { recursive: true });
    if (!fs.existsSync(target.manifestPath)) {
      writeManifest(target, []);
    }
  }
}
