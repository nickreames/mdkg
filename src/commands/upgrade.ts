import fs from "fs";
import path from "path";
import { observeGit } from "../util/git_observation";
import { IDENTITY_CONFIG_SCHEMA_VERSION, identityWriterConfig, migrateConfig } from "../core/migrate";
import { CustomizationConfig, defaultCustomizationConfig, validateConfigSchema } from "../core/config";

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

import { NotFoundError, UsageError } from "../util/errors";
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
} from "./init_manifest";
import { configuredSkillMirrorTargets } from "./skill_mirror";
import { appendInstructions, instructionHash, instructionSection, instructionSeed, replaceInstructions } from "./bootstrap_instructions";
import { UpgradePlan, continueUpgrade, readUpgradeJournal, UPGRADE_JOURNAL, digest } from "./upgrade_transaction";
import { planUpgradeProjections } from "./upgrade_projections";
import { canonicalJson, GRAPH_FORMAT_PATH, readGraphFormat } from "../graph/identity";
import { assertUpgradeIdentities, bindUpgradeGraphDirectories } from "./upgrade_identity";

export type UpgradeCommandOptions = {
  root: string;
  dryRun?: boolean;
  apply?: boolean;
  json?: boolean;
  seedRoot?: string;
  planHash?: string;
  only?: string[];
  resume?: boolean;
  recover?: boolean;
  /** In-process fault injection; never exposed as a CLI/environment switch. */
  afterWrite?: (path: string, index: number) => void;
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
  plan_hash: string;
  journal_path: string;
  operation_hashes: Array<{path: string; before: string | null; after: string | null}>;
  recovery_state?: string;
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

function copyFile(plan: UpgradePlan, src: string, dest: string): void {
  plan.write(repoRelativePath(plan.root, dest), fs.readFileSync(src));
}

function writeFile(plan: UpgradePlan, filePath: string, content: string): void {
  plan.write(repoRelativePath(plan.root, filePath), content);
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
  plan: UpgradePlan;
  knownSections: Map<string, Set<string>>;
  summary: UpgradeSummary;
  changes: UpgradeChange[];
  managedCurrentFiles: InitManifestFile[];
}): boolean {
  const destPath = path.join(options.root, options.file.path);
  const srcPath = seedSourcePath(options.seedRoot, options.file);
  const current = options.plan.read(options.file.path);
  const currentHash = current ? digest(current) : undefined;
  if (options.file.category === "agent_doc") {
    const seed = fs.readFileSync(srcPath, "utf8");
    const raw = current?.toString("utf8") ?? "";
    let section: ReturnType<typeof instructionSection>;
    try { section = instructionSection(raw); } catch (error) {
      record(options.summary, options.changes, { path: options.file.path, category: "agent_doc", action: "conflict", reason: (error as Error).message });
      return false;
    }
    const seedSection = instructionSeed(seed);
    const sectionKnown = section && (section.text.replace(/\r\n/g, "\n") === seedSection.replace(/\r\n/g, "\n") ||
      options.knownSections.get(options.file.path)?.has(instructionHash(section.text)));
    if (section && !sectionKnown) {
      record(options.summary, options.changes, { path: options.file.path, category: "agent_doc", action: "conflict", reason: "modified managed instruction section; surrounding user content preserved" });
      return false;
    }
    // An unmarked wrapper is replaced only with whole-file seed proof. Otherwise
    // append a managed section while preserving all original user bytes.
    const next = section ? replaceInstructions(raw, seed) :
      appendInstructions(currentHash && options.knownHashes.get(options.file.path)?.has(currentHash) ? "" : raw, seed);
    const installed = { ...options.file, sha256: instructionHash(next),
      managed_section_sha256: instructionHash(instructionSection(next)!.text) };
    options.managedCurrentFiles.push(installed);
    if (next === raw) { options.summary.unchanged++; return false; }
    options.plan.write(options.file.path, next);
    record(options.summary, options.changes, { path: options.file.path, category: "agent_doc",
      action: current ? "update" : "create", reason: section ? "replace verified managed section only" : "install bounded instructions; preserve unowned bytes" });
    return true;
  }
  const nextHash = options.file.sha256;

  if (!currentHash) {
    record(options.summary, options.changes, {
      path: options.file.path,
      category: options.file.category,
      action: "create",
      reason: "missing managed init asset",
    });
    copyFile(options.plan, srcPath, destPath);
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
    copyFile(options.plan, srcPath, destPath);
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

function migrateConfigIfNeeded(root: string, plan: UpgradePlan, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const cfgPath = configPath(root);
  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const migrated = migrateConfig(raw);
  const bundleConfig = migrateLegacyBundleImportsConfig(migrated.config);
  const nextConfig = migrateProjectDbConfig(bundleConfig.config);
  const customizationConfig = migrateCustomizationConfig(nextConfig.config);
  const needsWriterFence = readGraphFormat(root).format_version === 2 &&
    validateConfigSchema(customizationConfig.config).schema_version !== IDENTITY_CONFIG_SCHEMA_VERSION;
  const finalConfig = needsWriterFence ? identityWriterConfig(customizationConfig.config) : customizationConfig.config;
  validateConfigSchema(finalConfig);
  if (migrated.from === migrated.to && !bundleConfig.changed && !nextConfig.changed && !customizationConfig.changed && !needsWriterFence) {
    summary.unchanged += 1;
    return;
  }
  const reasons: string[] = [];
  if (needsWriterFence) reasons.push("explicit compatible-writer fence for adopted v2 graph");
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
  writeFile(plan, cfgPath, `${JSON.stringify(finalConfig, null, 2)}\n`);
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
  const missingDefaults = defaultCustomizationConfig().skill_mirrors.targets.filter(target =>
    !configuredSkillMirrorTargets(config).includes(target));
  record(summary, changes, {
    path: ".mdkg/config.json",
    category: "customization_overlay",
    action: "skip",
    reason: "operator customization overlay is preserved; upgrade does not replace organization standards, custom core docs, or configured skill mirror targets" +
      (missingDefaults.length ? `; native defaults missing: ${missingDefaults.join(", ")}; explicitly review adding them to customization.skill_mirrors.targets before mdkg skill sync` : ""),
  });
}

function migrateClosedGoalActiveNodes(root: string, plan: UpgradePlan, summary: UpgradeSummary, changes: UpgradeChange[]): void {
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
      {
        if (!lastActiveNode) {
          frontmatter.last_active_node = activeNode;
        }
        delete frontmatter.active_node;
        writeFile(plan, filePath, renderFrontmatterDocument(frontmatter, parsed.body.length > 0 ? parsed.body : ""));
      }
    }
  }
  if (planned === 0) {
    summary.unchanged += 1;
  }
}

function migrateLegacySpecManifests(root: string, plan: UpgradePlan, summary: UpgradeSummary, changes: UpgradeChange[]): void {
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
      {
        const frontmatter = { ...parsed.frontmatter, type: "manifest" };
        plan.write(relativeTargetPath, renderFrontmatterDocument(frontmatter, parsed.body));
        plan.write(relativePath, null);
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
  try {
    const result = observeGit(root, ["check-ignore", "--quiet", "--", relativePath], { allowedFailures: [1, 128] });
    if (result.status === 0) return true;
    if (result.status === 1) return false;
  } catch {
    // This fallback only chooses missing-event guidance; upgrade never restores
    // deleted history. Preserve non-Git/no-Git installations without claiming a
    // successful Git observation or using repository-configured helpers.
  }
  return isIgnoredBySimpleGitignore(root, relativePath);
}

function ensureAgentRuntimeFiles(root: string, plan: UpgradePlan, summary: UpgradeSummary, changes: UpgradeChange[]): void {
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
      path: relEventsPath, category: "event_log", action: "skip",
      reason: "missing event history is not reconstructed by upgrade; use mdkg event enable explicitly",
    });
  } else {
    summary.unchanged += 1;
  }
}

function ensureArchiveIgnorePolicy(root: string, plan: UpgradePlan, summary: UpgradeSummary, changes: UpgradeChange[]): void {
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
  {
    const suffix = raw.length === 0 || raw.endsWith("\n") ? "" : "\n";
    writeFile(plan, ignorePath, `${raw}${suffix}${additions.join("\n")}\n`);
  }
}

function isWritableChange(change: UpgradeChange): boolean {
  return change.action === "create" || change.action === "update" || change.action === "migrate" || change.action === "sync";
}

function writablePathForChange(change: UpgradeChange): string {
  return change.target_path ?? change.path;
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
      console.log(`next: mdkg upgrade --apply --plan-hash ${receipt.plan_hash} (repeat the reviewed --only selection, if any)`);
    } else {
      console.log("next: resolve blocking conflicts, then run mdkg upgrade again and review the new plan before applying");
    }
  }
}

export function runUpgradeCommand(options: UpgradeCommandOptions): UpgradeReceipt {
  const root = path.resolve(options.root);
  const seedRoot = options.seedRoot ? path.resolve(options.seedRoot) : DEFAULT_SEED_SUBDIR;
  const dryRun = !options.apply && !options.resume && !options.recover;
  if ((options.dryRun && !dryRun) || (options.resume && options.recover) || ((options.resume || options.recover) && options.only?.length)) {
    throw new UsageError("choose preview, apply, resume, or recover; recovery cannot select a partial operation");
  }
  const version = readPackageVersion();
  const graphFormat = readGraphFormat(root);
  const plan = new UpgradePlan(root);
  plan.read(GRAPH_FORMAT_PATH); // Bind exact bytes, including absence, not only the parsed version.
  const initialConfig = validateConfigSchema(migrateConfig(JSON.parse(plan.read(".mdkg/config.json")!.toString("utf8"))).config);
  const emit = (receipt: UpgradeReceipt): UpgradeReceipt => {
    if (options.json) console.log(JSON.stringify(receipt, null, 2));
    else emitHumanReceipt(receipt);
    return receipt;
  };
  if (options.resume || options.recover) {
    const journal = continueUpgrade(root, options.recover ? "recover" : "resume", options.planHash, initialConfig.index.lock_timeout_ms, journal => {
      const currentFormat = readGraphFormat(root);
      const recovering = options.recover || journal.state === "recovered";
      const operations = new Map(journal.operations.map(op => [op.path, op]));
      if (operations.has(GRAPH_FORMAT_PATH)) throw new UsageError("scaffold recovery cannot modify the graph format manifest; use reviewed identity migration");
      const overlay = (side: "before" | "after") => (file: string): Buffer | null => {
        const op = operations.get(file);
        return op ? op[side] === null ? null : Buffer.from(op[side], "base64") : plan.read(file);
      };
      const original = overlay("before"), candidate = recovering ? original : overlay("after");
      const configFor = (read: typeof original) => validateConfigSchema(migrateConfig(JSON.parse(read(".mdkg/config.json")!.toString("utf8"))).config);
      const originalConfig = configFor(original), candidateConfig = configFor(overlay("after"));
      if (canonicalJson(originalConfig.workspaces) !== canonicalJson(candidateConfig.workspaces)) {
        throw new UsageError("scaffold recovery cannot change graph workspace ownership");
      }
      // Recovery validates the original graph, not an intentionally interrupted
      // intermediate graph. Plan binding is enforced by continueUpgrade; even
      // approved operations cannot restore identity-free bytes into a v2 graph.
      assertUpgradeIdentities(root, originalConfig, currentFormat, operations.keys(), original, candidate);
    });
    return emit({ action: "upgrade", dry_run: false, version, safe_to_apply: true, summary: createSummary(),
      will_write_paths: journal.operations.map(op => op.path), preserved_customizations: [], blocking_conflicts: [],
      apply_side_effects: [], changes: [], plan_hash: journal.plan_hash, journal_path: UPGRADE_JOURNAL,
      operation_hashes: journal.operations.map(op => ({ path: op.path, before: op.before === null ? null : digest(Buffer.from(op.before, "base64")),
        after: op.after === null ? null : digest(Buffer.from(op.after, "base64")) })), recovery_state: journal.state });
  }
  const journal = readUpgradeJournal(root);
  if (journal && !["completed", "recovered"].includes(journal.state)) {
    throw new UsageError(`unfinished upgrade ${journal.plan_hash}; review journal and explicitly --resume or --recover --plan-hash ${journal.plan_hash}`);
  }
  requireSeedAssets(seedRoot);
  const currentManifest = createInitManifest(seedRoot, version);
  plan.read(`.mdkg/${INIT_MANIFEST_FILE}`);
  const existingManifest = readInitManifest(path.join(root, ".mdkg", INIT_MANIFEST_FILE));
  const manifests = [existingManifest, ...loadLegacyInitManifests(seedRoot)];
  const knownHashes = buildKnownHashes(manifests);
  const knownSections = new Map<string, Set<string>>();
  for (const manifest of manifests) for (const file of manifest?.files ?? []) {
    if (file.managed_section_sha256) {
      if (!knownSections.has(file.path)) knownSections.set(file.path, new Set());
      knownSections.get(file.path)!.add(file.managed_section_sha256);
    }
  }
  const summary = createSummary();
  const changes: UpgradeChange[] = [];
  const agentWorkspace = isAgentWorkspace(root, initialConfig);
  const managedCurrentFiles: InitManifestFile[] = [];
  const only = options.only ? new Set(options.only) : undefined;
  if (only?.size === 0) throw new UsageError("--only requires one or more exact upgrade paths");
  const selected = (change: UpgradeChange): boolean => !only || only.has(change.path) || Boolean(change.target_path && only.has(change.target_path));

  // Bind graph migration discovery as well as destination bytes to the preview.
  bindUpgradeGraphDirectories(plan, initialConfig);
  const graphFiles = listWorkspaceDocFilesByAlias(root, initialConfig);
  for (const files of Object.values(graphFiles)) for (const file of files) {
    const relative = repoRelativePath(root, file);
    plan.read(relative);
    let parent = path.posix.dirname(relative);
    while (parent !== ".") { plan.list(parent); parent = path.posix.dirname(parent); }
  }
  plan.read(".gitignore");
  migrateConfigIfNeeded(root, plan, summary, changes);
  reportPreservedCustomizationOverlay(root, summary, changes);
  migrateClosedGoalActiveNodes(root, plan, summary, changes);
  migrateLegacySpecManifests(root, plan, summary, changes);
  for (const file of currentManifest.files) {
    if (!shouldIncludeFile(file, agentWorkspace)) continue;
    planSeedFile({ root, seedRoot, file, knownHashes, knownSections, plan, summary, changes, managedCurrentFiles });
  }
  if (agentWorkspace) {
    ensureAgentRuntimeFiles(root, plan, summary, changes);
    if (plan.read("CLAUDE.md")) {
      record(summary, changes, { path: "CLAUDE.md", category: "legacy_preserved", action: "skip",
        reason: "existing legacy instructions preserved byte-for-byte; fresh init generates AGENTS.md only; retirement requires a separately reviewed migration" });
    }
    for (const name of ["AGENT_START.md", "CLI_COMMAND_MATRIX.md", "llms.txt"]) {
      const raw = plan.read(name);
      if (!raw) continue;
      if (knownHashes.get(name)?.has(digest(raw))) {
        const destination = `.mdkg/${name}`;
        if (plan.value(destination)) {
          const redirect = `# mdkg compatibility entrypoint\n\nRead [${name}](${destination}).\n\nThis verified legacy path is retained for compatibility.\n`;
          plan.write(name, redirect);
          if (plan.operations.has(name)) record(summary, changes, { path: name, category: "legacy_redirect", action: "update", reason: "verified legacy seed; preserve old link with a compatibility redirect" });
          managedCurrentFiles.push({ path: name, category: "startup_doc", sha256: digest(redirect) });
        }
      } else record(summary, changes, { path: name, category: "legacy_preserved", action: "skip", reason: "unknown or customized root document/public discovery asset preserved; not adopted by filename" });
    }
  }
  ensureArchiveIgnorePolicy(root, plan, summary, changes);

  if (only) {
    const recognized = new Set(changes.flatMap(change => [change.path, ...(change.target_path ? [change.target_path] : [])]));
    for (const item of only) if (!recognized.has(item)) throw new UsageError(`--only path is not a pending upgrade unit: ${item}`);
    for (const change of changes) if (!selected(change)) {
      plan.operations.delete(change.path);
      if (change.target_path) plan.operations.delete(change.target_path);
    }
    // A redirect cannot point at a destination excluded by a subset plan.
    for (const change of changes.filter(change => change.category === "legacy_redirect" && selected(change))) {
      if (!plan.value(`.mdkg/${change.path}`)) throw new UsageError(`include .mdkg/${change.path} with its compatibility redirect`);
    }
  }
  const directPaths = new Set(plan.operations.keys());
  const applySideEffects = agentWorkspace && (!only || [...directPaths].some(file => file.startsWith(".mdkg/skills/")))
    ? planUpgradeProjections(plan, initialConfig, knownHashes) : [];
  for (const effect of applySideEffects) record(summary, changes, effect);

  const appliedFiles = new Map((existingManifest?.files ?? []).map(file => [file.path, file]));
  for (const file of managedCurrentFiles) {
    const actual = plan.value(file.path);
    if (actual && digest(actual) === file.sha256) appliedFiles.set(file.path, file);
  }
  const manifest: InitManifest = { ...currentManifest, files: [...appliedFiles.values()].sort((a, b) => a.path.localeCompare(b.path)) };
  plan.write(`.mdkg/${INIT_MANIFEST_FILE}`, JSON.stringify(manifest, null, 2) + "\n");
  if (plan.operations.has(`.mdkg/${INIT_MANIFEST_FILE}`)) {
    const effect: UpgradeChange = { path: `.mdkg/${INIT_MANIFEST_FILE}`, category: "init_manifest", action: existingManifest ? "update" : "create", reason: "record only verified installed managed units" };
    applySideEffects.push(effect); record(summary, changes, effect);
  }
  const blockingConflicts = changes.filter(change => change.action === "conflict" && (selected(change) || applySideEffects.includes(change)));
  try {
    assertUpgradeIdentities(root, initialConfig, graphFormat, plan.operations.keys(),
      file => plan.read(file), file => plan.value(file));
  } catch (error) {
    const conflict: UpgradeChange = { path: GRAPH_FORMAT_PATH, category: "graph_identity", action: "conflict",
      reason: error instanceof Error ? error.message : String(error) };
    record(summary, changes, conflict);
    // Graph invariants apply to the final subset; --only cannot exclude them.
    blockingConflicts.push(conflict);
  }
  const planHash = plan.hash({ version, only: only ? [...only].sort() : null, seed: currentManifest, conflicts: blockingConflicts });
  const receipt: UpgradeReceipt = { action: "upgrade", dry_run: dryRun, version, safe_to_apply: blockingConflicts.length === 0,
    summary, will_write_paths: [...plan.operations.keys()], preserved_customizations: changes.filter(change => change.action === "conflict" || change.category === "customization_overlay" || change.category === "legacy_preserved"),
    blocking_conflicts: blockingConflicts, apply_side_effects: applySideEffects, changes, plan_hash: planHash, journal_path: UPGRADE_JOURNAL,
    operation_hashes: [...plan.operations.values()].map(op => ({ path: op.path, before: op.before === null ? null : digest(Buffer.from(op.before, "base64")), after: op.after === null ? null : digest(Buffer.from(op.after, "base64")) })) };
  if (!dryRun && receipt.safe_to_apply && plan.operations.size) {
    if (!options.planHash || options.planHash !== planHash) throw new UsageError("review mdkg upgrade first, then supply its exact --plan-hash and --only selection; stale plans are refused");
    plan.apply(planHash, initialConfig.index.lock_timeout_ms, options.afterWrite);
    receipt.recovery_state = "completed";
  }
  return emit(receipt);
}
