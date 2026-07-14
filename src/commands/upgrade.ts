import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { migrateConfig } from "../core/migrate";
import { CustomizationConfig, defaultCustomizationConfig, validateConfigSchema } from "../core/config";
import { atomicReplaceContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { configPath } from "../core/paths";
import { readPackageVersion } from "../core/version";
import {
  PROJECT_DB_CONFIG_SCHEMA_VERSION,
  PROJECT_DB_GITIGNORE_ENTRIES,
  PROJECT_DB_MIGRATIONS_DIR,
  PROJECT_DB_MIGRATION_TABLE,
  PROJECT_DB_RECEIPTS_DIR,
  PROJECT_DB_RELATIVE_DIR,
  PROJECT_DB_RUNTIME_FILE,
  PROJECT_DB_SCHEMA_DIR,
  PROJECT_DB_STATE_FILE,
} from "../core/project_db";
import { formatDate } from "../util/date";
import { NotFoundError } from "../util/errors";
import { DEFAULT_FRONTMATTER_KEY_ORDER, formatFrontmatter, FrontmatterValue, parseFrontmatter } from "../graph/frontmatter";
import { listWorkspaceDocFilesByAlias } from "../graph/workspace_files";
import { CANONICAL_MANIFEST_BASENAME, LEGACY_SPEC_BASENAME } from "../graph/agent_file_types";
import {
  createInitManifest,
  InitManifest,
  InitManifestFile,
  INIT_MANIFEST_FILE,
  loadLegacyInitManifests,
  readInitManifest,
  seedSourcePath,
  sha256File,
  writeInitManifest,
} from "./init_manifest";
import { refreshSkillsRegistry } from "./skill_support";
import { configuredSkillMirrorTargets, scaffoldMirrorRoots, syncSkillMirrors } from "./skill_mirror";

export type UpgradeCommandOptions = {
  root: string;
  dryRun?: boolean;
  apply?: boolean;
  json?: boolean;
  seedRoot?: string;
};

export type UpgradeChangeAction = "create" | "update" | "migrate" | "sync" | "conflict" | "skip";

export type UpgradeChange = {
  path: string;
  target_path?: string;
  category: string;
  action: UpgradeChangeAction;
  reason: string;
};

export type UpgradeSummary = {
  created: number;
  updated: number;
  migrated: number;
  synced: number;
  skipped: number;
  conflicted: number;
  unchanged: number;
};

export type UpgradeReceipt = {
  action: "upgrade";
  dry_run: boolean;
  version: string;
  safe_to_apply: boolean;
  summary: UpgradeSummary;
  will_write_paths: string[];
  preserved_customizations: UpgradeChange[];
  blocking_conflicts: UpgradeChange[];
  apply_side_effects: UpgradeChange[];
  changes: UpgradeChange[];
};

const DEFAULT_SEED_SUBDIR = path.resolve(__dirname, "..", "init");
const PROTECTED_CORE_DOCS = new Set([".mdkg/core/SOUL.md", ".mdkg/core/COLLABORATION.md", ".mdkg/core/HUMAN.md"]);
const CREATE_ONLY_PRESERVED = new Set([".mdkg/core/core.md"]);
const LOCAL_STATE_IGNORE_ENTRIES = [
  ".mdkg/state/",
  ".mdkg/subgraphs/",
  ".mdkg/archive/**/source/",
  ...PROJECT_DB_GITIGNORE_ENTRIES,
];

function seededInitEvent(nowIso: string): string {
  const event = {
    ts: nowIso,
    run_id: `upgrade-${nowIso.replace(/[^0-9]/g, "").slice(0, 14)}`,
    workspace: "root",
    agent: "mdkg",
    kind: "RUN_STARTED",
    status: "ok",
    refs: ["edd-4"],
    artifacts: [],
    notes: "upgrade ensured agent event log",
    redacted: true,
  };
  return `${JSON.stringify(event)}\n`;
}

function requireSeedAssets(seedRoot: string): void {
  for (const required of ["config.json", "README.md", "core", "templates"]) {
    if (!fs.existsSync(path.join(seedRoot, required))) {
      throw new NotFoundError(`upgrade assets missing ${required} at ${seedRoot} (try reinstalling mdkg)`);
    }
  }
}

function isAgentWorkspace(root: string, config: ReturnType<typeof validateConfigSchema>): boolean {
  return [
    path.join(root, ".mdkg", "skills"),
    path.join(root, ".mdkg", "work", "events", "events.jsonl"),
    ...configuredSkillMirrorTargets(config).map((target) => path.join(root, target)),
  ].some((candidate) => fs.existsSync(candidate));
}

function copyFile(root: string, src: string, dest: string): void {
  atomicReplaceContainedFile({ root, relativePath: repoRelativePath(root, dest) }, fs.readFileSync(src));
}

function writeFile(root: string, filePath: string, content: string): void {
  atomicReplaceContainedFile({ root, relativePath: repoRelativePath(root, filePath) }, content);
}

function repoRelativePath(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function renderFrontmatterDocument(frontmatter: Record<string, FrontmatterValue>, body: string): string {
  const frontmatterBlock = ["---", ...formatFrontmatter(frontmatter, DEFAULT_FRONTMATTER_KEY_ORDER), "---"].join("\n");
  return body.length > 0 ? `${frontmatterBlock}\n${body}` : frontmatterBlock;
}

function createSummary(): UpgradeSummary {
  return {
    created: 0,
    updated: 0,
    migrated: 0,
    synced: 0,
    skipped: 0,
    conflicted: 0,
    unchanged: 0,
  };
}

function record(summary: UpgradeSummary, changes: UpgradeChange[], change: UpgradeChange): void {
  changes.push(change);
  switch (change.action) {
    case "create":
      summary.created += 1;
      break;
    case "update":
      summary.updated += 1;
      break;
    case "migrate":
      summary.migrated += 1;
      break;
    case "sync":
      summary.synced += 1;
      break;
    case "conflict":
      summary.skipped += 1;
      summary.conflicted += 1;
      break;
    case "skip":
      summary.skipped += 1;
      break;
  }
}

function buildKnownHashes(manifests: Array<InitManifest | undefined>): Map<string, Set<string>> {
  const hashes = new Map<string, Set<string>>();
  for (const manifest of manifests) {
    if (!manifest) {
      continue;
    }
    for (const file of manifest.files) {
      if (!hashes.has(file.path)) {
        hashes.set(file.path, new Set());
      }
      hashes.get(file.path)?.add(file.sha256);
    }
  }
  return hashes;
}

function shouldIncludeFile(file: InitManifestFile, agentWorkspace: boolean): boolean {
  if (file.category === "agent_doc" || file.category === "startup_doc" || file.category === "default_skill") {
    return agentWorkspace;
  }
  return file.category !== "config";
}

function planSeedFile(options: {
  root: string;
  seedRoot: string;
  file: InitManifestFile;
  knownHashes: Map<string, Set<string>>;
  dryRun: boolean;
  summary: UpgradeSummary;
  changes: UpgradeChange[];
  managedCurrentFiles: InitManifestFile[];
}): boolean {
  const destPath = path.join(options.root, options.file.path);
  const srcPath = seedSourcePath(options.seedRoot, options.file);
  const currentHash = fs.existsSync(destPath) && fs.statSync(destPath).isFile() ? sha256File(destPath) : undefined;
  const nextHash = options.file.sha256;

  if (!currentHash) {
    record(options.summary, options.changes, {
      path: options.file.path,
      category: options.file.category,
      action: "create",
      reason: "missing managed init asset",
    });
    if (!options.dryRun) {
      copyFile(options.root, srcPath, destPath);
    }
    options.managedCurrentFiles.push(options.file);
    return true;
  }

  if (currentHash === nextHash) {
    options.summary.unchanged += 1;
    options.managedCurrentFiles.push(options.file);
    return false;
  }

  if (CREATE_ONLY_PRESERVED.has(options.file.path)) {
    options.summary.unchanged += 1;
    return false;
  }

  const known = options.knownHashes.get(options.file.path);
  if (known?.has(currentHash)) {
    record(options.summary, options.changes, {
      path: options.file.path,
      category: options.file.category,
      action: "update",
      reason: "matches a managed seed hash",
    });
    if (!options.dryRun) {
      copyFile(options.root, srcPath, destPath);
    }
    options.managedCurrentFiles.push(options.file);
    return true;
  }

  if (PROTECTED_CORE_DOCS.has(options.file.path)) {
    record(options.summary, options.changes, {
      path: options.file.path,
      category: options.file.category,
      action: "conflict",
      reason: "protected core document exists; local content preserved",
    });
    return false;
  }

  record(options.summary, options.changes, {
    path: options.file.path,
    category: options.file.category,
    action: "conflict",
    reason: "local changes detected; content preserved",
  });
  return false;
}

function migrateLegacyBundleImportsConfig(input: unknown): { config: unknown; changed: boolean } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { config: input, changed: false };
  }
  const raw = { ...(input as Record<string, unknown>) };
  if (raw.bundle_imports === undefined) {
    if (raw.subgraphs === undefined) {
      raw.subgraphs = {};
      return { config: raw, changed: true };
    }
    return { config: raw, changed: false };
  }
  if (raw.subgraphs !== undefined) {
    return { config: raw, changed: false };
  }

  const subgraphs: Record<string, unknown> = {};
  const legacy = raw.bundle_imports;
  if (legacy && typeof legacy === "object" && !Array.isArray(legacy)) {
    for (const [alias, value] of Object.entries(legacy as Record<string, unknown>)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        continue;
      }
      const entry = value as Record<string, unknown>;
      subgraphs[alias] = {
        enabled: entry.enabled ?? true,
        visibility: entry.visibility ?? "private",
        permissions: ["read"],
        max_stale_seconds: entry.max_stale_seconds ?? 3600,
        ...(entry.source_path ? { source_path: entry.source_path } : {}),
        ...(entry.source_repo ? { source_repo: entry.source_repo } : {}),
        sources: [
          {
            path: entry.path,
            enabled: true,
            expected_profile: entry.expected_profile ?? "private",
          },
        ],
      };
    }
  }
  raw.subgraphs = subgraphs;
  delete raw.bundle_imports;
  return { config: raw, changed: true };
}

function migrateProjectDbConfig(input: unknown): { config: unknown; changed: boolean } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { config: input, changed: false };
  }
  const raw = { ...(input as Record<string, unknown>) };
  if (raw.db !== undefined) {
    return { config: raw, changed: false };
  }
  raw.db = {
    enabled: false,
    schema_version: PROJECT_DB_CONFIG_SCHEMA_VERSION,
    root_path: PROJECT_DB_RELATIVE_DIR,
    schema_path: PROJECT_DB_SCHEMA_DIR,
    migrations_path: PROJECT_DB_MIGRATIONS_DIR,
    runtime_path: PROJECT_DB_RUNTIME_FILE,
    state_path: PROJECT_DB_STATE_FILE,
    receipts_path: PROJECT_DB_RECEIPTS_DIR,
    migration_table: PROJECT_DB_MIGRATION_TABLE,
  };
  return { config: raw, changed: true };
}

function migrateCustomizationConfig(input: unknown): { config: unknown; changed: boolean } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { config: input, changed: false };
  }
  const raw = { ...(input as Record<string, unknown>) };
  if (raw.customization !== undefined) {
    return { config: raw, changed: false };
  }
  raw.customization = defaultCustomizationConfig();
  return { config: raw, changed: true };
}

function migrateConfigIfNeeded(root: string, dryRun: boolean, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const cfgPath = configPath(root);
  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const migrated = migrateConfig(raw);
  const bundleConfig = migrateLegacyBundleImportsConfig(migrated.config);
  const nextConfig = migrateProjectDbConfig(bundleConfig.config);
  const customizationConfig = migrateCustomizationConfig(nextConfig.config);
  validateConfigSchema(customizationConfig.config);
  if (migrated.from === migrated.to && !bundleConfig.changed && !nextConfig.changed && !customizationConfig.changed) {
    summary.unchanged += 1;
    return;
  }
  const reasons: string[] = [];
  if (bundleConfig.changed) {
    reasons.push("config subgraphs migration");
  }
  if (nextConfig.changed) {
    reasons.push("project db config defaults");
  }
  if (customizationConfig.changed) {
    reasons.push("customization overlay defaults");
  }
  if (migrated.from !== migrated.to) {
    reasons.push(`schema_version ${migrated.from} -> ${migrated.to}`);
  }
  record(summary, changes, {
    path: ".mdkg/config.json",
    category: "config",
    action: "migrate",
    reason: reasons.join(" and "),
  });
  if (!dryRun) {
    writeFile(root, cfgPath, `${JSON.stringify(customizationConfig.config, null, 2)}\n`);
  }
}

function sameStringArray(left: string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function hasOperatorCustomization(customization: CustomizationConfig): boolean {
  const defaults = defaultCustomizationConfig();
  return (
    customization.standards.profile !== defaults.standards.profile ||
    customization.standards.refs.length > 0 ||
    customization.core_docs.custom_paths.length > 0 ||
    !sameStringArray(customization.skill_mirrors.targets, defaults.skill_mirrors.targets)
  );
}

function reportPreservedCustomizationOverlay(root: string, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const config = validateConfigSchema(migrateConfig(JSON.parse(fs.readFileSync(configPath(root), "utf8"))).config);
  if (!hasOperatorCustomization(config.customization)) {
    summary.unchanged += 1;
    return;
  }
  record(summary, changes, {
    path: ".mdkg/config.json",
    category: "customization_overlay",
    action: "skip",
    reason: "operator customization overlay is preserved; upgrade does not replace organization standards, custom core docs, or configured skill mirror targets",
  });
}

function migrateClosedGoalActiveNodes(root: string, dryRun: boolean, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const config = validateConfigSchema(migrateConfig(JSON.parse(fs.readFileSync(configPath(root), "utf8"))).config);
  const filesByAlias = listWorkspaceDocFilesByAlias(root, config);
  let planned = 0;
  for (const files of Object.values(filesByAlias)) {
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, "utf8");
      let parsed: ReturnType<typeof parseFrontmatter>;
      try {
        parsed = parseFrontmatter(content, filePath);
      } catch {
        continue;
      }
      const frontmatter = { ...parsed.frontmatter };
      if (frontmatter.type !== "goal") {
        continue;
      }
      const status = typeof frontmatter.status === "string" ? frontmatter.status : "";
      const goalState = typeof frontmatter.goal_state === "string" ? frontmatter.goal_state : "";
      const activeNode = typeof frontmatter.active_node === "string" ? frontmatter.active_node : undefined;
      if (!activeNode || (status !== "done" && goalState !== "achieved")) {
        continue;
      }
      const relativePath = path.relative(root, filePath).split(path.sep).join("/");
      const lastActiveNode = typeof frontmatter.last_active_node === "string" ? frontmatter.last_active_node : undefined;
      if (lastActiveNode && lastActiveNode !== activeNode) {
        planned += 1;
        record(summary, changes, {
          path: relativePath,
          category: "goal_lifecycle",
          action: "conflict",
          reason: `closed goal has active_node ${activeNode} but different last_active_node ${lastActiveNode}; local content preserved`,
        });
        continue;
      }
      planned += 1;
      record(summary, changes, {
        path: relativePath,
        category: "goal_lifecycle",
        action: "migrate",
        reason: "move closed goal active_node to last_active_node",
      });
      if (!dryRun) {
        if (!lastActiveNode) {
          frontmatter.last_active_node = activeNode;
        }
        delete frontmatter.active_node;
        writeFile(root, filePath, renderFrontmatterDocument(frontmatter, parsed.body.length > 0 ? parsed.body : ""));
      }
    }
  }
  if (planned === 0) {
    summary.unchanged += 1;
  }
}

function migrateLegacySpecManifests(root: string, dryRun: boolean, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const config = validateConfigSchema(migrateConfig(JSON.parse(fs.readFileSync(configPath(root), "utf8"))).config);
  const filesByAlias = listWorkspaceDocFilesByAlias(root, config);
  let planned = 0;
  for (const files of Object.values(filesByAlias)) {
    for (const filePath of files) {
      if (path.basename(filePath) !== LEGACY_SPEC_BASENAME) {
        continue;
      }
      const content = fs.readFileSync(filePath, "utf8");
      let parsed: ReturnType<typeof parseFrontmatter>;
      try {
        parsed = parseFrontmatter(content, filePath);
      } catch {
        continue;
      }
      if (parsed.frontmatter.type !== "spec") {
        continue;
      }

      planned += 1;
      const targetPath = path.join(path.dirname(filePath), CANONICAL_MANIFEST_BASENAME);
      const relativePath = repoRelativePath(root, filePath);
      const relativeTargetPath = repoRelativePath(root, targetPath);
      if (fs.existsSync(targetPath)) {
        record(summary, changes, {
          path: relativePath,
          target_path: relativeTargetPath,
          category: "manifest_migration",
          action: "conflict",
          reason: "sibling MANIFEST.md already exists; legacy SPEC.md content preserved",
        });
        continue;
      }

      record(summary, changes, {
        path: relativePath,
        target_path: relativeTargetPath,
        category: "manifest_migration",
        action: "migrate",
        reason: "rename legacy SPEC.md to MANIFEST.md and normalize type: spec to type: manifest",
      });
      if (!dryRun) {
        const frontmatter = { ...parsed.frontmatter, type: "manifest" };
        atomicReplaceContainedFile(
          { root, relativePath: repoRelativePath(root, filePath) },
          renderFrontmatterDocument(frontmatter, parsed.body)
        );
        withContainedPathSink(
          { root, relativePath: repoRelativePath(root, targetPath), operation: "create", createParents: true },
          ({ absolutePath: safeTarget }) =>
            withContainedPathSink(
              { root, relativePath: repoRelativePath(root, filePath), operation: "delete" },
              ({ absolutePath: safeSource }) => fs.renameSync(safeSource, safeTarget)
            )
        );
      }
    }
  }
  if (planned === 0) {
    summary.unchanged += 1;
  }
}

function isIgnoredBySimpleGitignore(root: string, relativePath: string): boolean {
  const ignorePath = path.join(root, ".gitignore");
  if (!fs.existsSync(ignorePath)) {
    return false;
  }
  const normalized = relativePath.replace(/\\/g, "/");
  const lines = fs.readFileSync(ignorePath, "utf8").split(/\r?\n/);
  let ignored = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const negated = line.startsWith("!");
    const pattern = negated ? line.slice(1) : line;
    const normalizedPattern = pattern.replace(/\\/g, "/").replace(/^\/+/, "");
    const matches =
      normalizedPattern === normalized ||
      (normalizedPattern.endsWith("/") && normalized.startsWith(normalizedPattern)) ||
      (normalizedPattern.endsWith("/*") && normalized.startsWith(normalizedPattern.slice(0, -1)));
    if (matches) {
      ignored = !negated;
    }
  }
  return ignored;
}

function isGitIgnored(root: string, relativePath: string): boolean {
  const result = spawnSync("git", ["check-ignore", "--quiet", "--", relativePath], {
    cwd: root,
    stdio: "ignore",
  });
  if (result.status === 0) {
    return true;
  }
  if (result.status === 1) {
    return false;
  }
  return isIgnoredBySimpleGitignore(root, relativePath);
}

function ensureAgentRuntimeFiles(root: string, dryRun: boolean, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  const relEventsPath = ".mdkg/work/events/events.jsonl";
  if (!fs.existsSync(eventsPath)) {
    if (isGitIgnored(root, relEventsPath)) {
      record(summary, changes, {
        path: relEventsPath,
        category: "event_log",
        action: "skip",
        reason: "event log path is ignored; run `mdkg event enable` if local event provenance should be restored",
      });
      return;
    }
    record(summary, changes, {
      path: relEventsPath,
      category: "event_log",
      action: "create",
      reason: "agent workspace is missing event log",
    });
    if (!dryRun) {
      writeFile(root, eventsPath, seededInitEvent(new Date().toISOString()));
    }
  } else {
    summary.unchanged += 1;
  }
}

function ensureArchiveIgnorePolicy(root: string, dryRun: boolean, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const ignorePath = path.join(root, ".gitignore");
  const raw = fs.existsSync(ignorePath) ? fs.readFileSync(ignorePath, "utf8") : "";
  const lines = raw.split(/\r?\n/);
  const existing = new Set(lines.map((line) => line.trim()).filter(Boolean));
  const additions = LOCAL_STATE_IGNORE_ENTRIES.filter((entry) => !existing.has(entry));
  if (additions.length === 0) {
    summary.unchanged += 1;
    return;
  }
  record(summary, changes, {
    path: ".gitignore",
    category: "ignore_policy",
    action: fs.existsSync(ignorePath) ? "update" : "create",
    reason: "ignore local mdkg state, project DB runtime files, and raw archive source copies while keeping authored graph records commit-eligible",
  });
  if (!dryRun) {
    const suffix = raw.length === 0 || raw.endsWith("\n") ? "" : "\n";
    writeFile(root, ignorePath, `${raw}${suffix}${additions.join("\n")}\n`);
  }
}

function isWritableChange(change: UpgradeChange): boolean {
  return change.action === "create" || change.action === "update" || change.action === "migrate" || change.action === "sync";
}

function writablePathForChange(change: UpgradeChange): string {
  return change.target_path ?? change.path;
}

function buildApplySideEffects(options: {
  existingManifest: InitManifest | undefined;
  agentWorkspace: boolean;
  mirrorTargets: string[];
  changes: UpgradeChange[];
}): UpgradeChange[] {
  const hasDirectWrites = options.changes.some(isWritableChange);
  if (!hasDirectWrites && options.existingManifest) {
    return [];
  }
  const effects: UpgradeChange[] = [
    {
      path: ".mdkg/init-manifest.json",
      category: "init_manifest",
      action: options.existingManifest ? "update" : "create",
      reason: "records managed init asset fingerprints after apply",
    },
  ];
  if (options.agentWorkspace) {
    effects.push({
      path: ".mdkg/skills/registry.md",
      category: "skill_registry",
      action: "update",
      reason: "refreshes canonical skill registry after apply",
    });
    if (options.mirrorTargets.length > 0) {
      effects.push({
        path: options.mirrorTargets.join(","),
        category: "skill_mirror",
        action: "sync",
        reason: "syncs configured managed skill mirrors after apply",
      });
    }
  }
  return effects;
}

function emitHumanReceipt(receipt: UpgradeReceipt): void {
  const mode = receipt.dry_run ? "dry-run" : "apply";
  console.log(
    `mdkg upgrade ${mode}: ${receipt.summary.created} create, ${receipt.summary.updated} update, ${receipt.summary.migrated} migrate, ${receipt.summary.synced} sync, ${receipt.summary.conflicted} conflict`
  );
  console.log(`safe to apply: ${receipt.safe_to_apply ? "yes" : "no"}`);
  if (receipt.will_write_paths.length > 0) {
    console.log(`will write: ${receipt.will_write_paths.join(", ")}`);
  }
  if (receipt.preserved_customizations.length > 0) {
    console.log(`preserved customizations: ${receipt.preserved_customizations.length}`);
  }
  if (receipt.blocking_conflicts.length > 0) {
    console.log(`blocking conflicts: ${receipt.blocking_conflicts.length}`);
  }
  if (receipt.changes.length === 0) {
    console.log("no upgrade changes pending");
  } else {
    for (const change of receipt.changes) {
      const target = change.target_path ? ` -> ${change.target_path}` : "";
      console.log(`  ${change.action}: ${change.path}${target} (${change.reason})`);
    }
  }
  if (receipt.apply_side_effects.length > 0) {
    for (const effect of receipt.apply_side_effects) {
      console.log(`  apply-side-effect: ${effect.path} (${effect.reason})`);
    }
  }
  if (receipt.dry_run && receipt.will_write_paths.length > 0) {
    if (receipt.safe_to_apply) {
      console.log("next: mdkg upgrade --apply (writes only safe managed paths; preserves customized files)");
    } else {
      console.log("next: resolve blocking conflicts before running mdkg upgrade --apply");
    }
  }
}

export function runUpgradeCommand(options: UpgradeCommandOptions): UpgradeReceipt {
  const root = path.resolve(options.root);
  const seedRoot = options.seedRoot ? path.resolve(options.seedRoot) : DEFAULT_SEED_SUBDIR;
  const dryRun = !options.apply;
  const version = readPackageVersion();
  requireSeedAssets(seedRoot);

  const currentManifest = createInitManifest(seedRoot, version);
  const existingManifest = readInitManifest(path.join(root, ".mdkg", INIT_MANIFEST_FILE));
  const legacyManifests = loadLegacyInitManifests(seedRoot);
  const knownHashes = buildKnownHashes([existingManifest, ...legacyManifests]);
  const summary = createSummary();
  const changes: UpgradeChange[] = [];
  const initialConfig = validateConfigSchema(migrateConfig(JSON.parse(fs.readFileSync(configPath(root), "utf8"))).config);
  const agentWorkspace = isAgentWorkspace(root, initialConfig);
  const managedCurrentFiles: InitManifestFile[] = [];

  migrateConfigIfNeeded(root, dryRun, summary, changes);
  reportPreservedCustomizationOverlay(root, summary, changes);
  migrateClosedGoalActiveNodes(root, dryRun, summary, changes);
  migrateLegacySpecManifests(root, dryRun, summary, changes);

  for (const file of currentManifest.files) {
    if (!shouldIncludeFile(file, agentWorkspace)) {
      continue;
    }
    planSeedFile({
      root,
      seedRoot,
      file,
      knownHashes,
      dryRun,
      summary,
      changes,
      managedCurrentFiles,
    });
  }

  if (agentWorkspace) {
    ensureAgentRuntimeFiles(root, dryRun, summary, changes);
  }
  ensureArchiveIgnorePolicy(root, dryRun, summary, changes);

  const applySideEffects = buildApplySideEffects({
    existingManifest,
    agentWorkspace,
    mirrorTargets: configuredSkillMirrorTargets(initialConfig),
    changes,
  });
  for (const effect of applySideEffects) {
    record(summary, changes, effect);
  }

  if (!dryRun) {
    const appliedManifest: InitManifest = {
      ...currentManifest,
      files: managedCurrentFiles.sort((a, b) => a.path.localeCompare(b.path)),
    };
    if (applySideEffects.length > 0) {
      writeInitManifest(path.join(root, ".mdkg", INIT_MANIFEST_FILE), appliedManifest);
    }
    if (agentWorkspace && applySideEffects.length > 0) {
      const config = validateConfigSchema(migrateConfig(JSON.parse(fs.readFileSync(configPath(root), "utf8"))).config);
      refreshSkillsRegistry(root, config);
      scaffoldMirrorRoots(root, config);
      syncSkillMirrors({ root, config, createRoots: true });
    }
  }

  const preservedCustomizations = changes.filter(
    (change) => change.action === "conflict" || change.category === "customization_overlay"
  );
  const blockingConflicts = changes.filter(
    (change) => change.action === "conflict" && change.category === "manifest_migration"
  );
  const willWritePaths = changes.filter(isWritableChange).map(writablePathForChange);
  const receipt: UpgradeReceipt = {
    action: "upgrade",
    dry_run: dryRun,
    version,
    safe_to_apply: blockingConflicts.length === 0,
    summary,
    will_write_paths: Array.from(new Set(willWritePaths)),
    preserved_customizations: preservedCustomizations,
    blocking_conflicts: blockingConflicts,
    apply_side_effects: applySideEffects,
    changes,
  };

  if (options.json) {
    console.log(`${JSON.stringify(receipt, null, 2)}`);
  } else {
    emitHumanReceipt(receipt);
  }
  return receipt;
}
