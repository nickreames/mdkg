import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { migrateConfig } from "../core/migrate";
import { validateConfigSchema } from "../core/config";
import { configPath } from "../core/paths";
import { readPackageVersion } from "../core/version";
import { formatDate } from "../util/date";
import { NotFoundError } from "../util/errors";
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
import { scaffoldMirrorRoots, syncSkillMirrors } from "./skill_mirror";

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
const PROTECTED_CORE_DOCS = new Set([".mdkg/core/SOUL.md", ".mdkg/core/HUMAN.md"]);
const CREATE_ONLY_PRESERVED = new Set([".mdkg/core/core.md"]);

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

function isAgentWorkspace(root: string): boolean {
  return [
    path.join(root, ".mdkg", "skills"),
    path.join(root, ".agents", "skills"),
    path.join(root, ".claude", "skills"),
    path.join(root, ".mdkg", "work", "events", "events.jsonl"),
  ].some((candidate) => fs.existsSync(candidate));
}

function copyFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
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
  if (file.category === "default_skill") {
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
      copyFile(srcPath, destPath);
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

  if (PROTECTED_CORE_DOCS.has(options.file.path)) {
    record(options.summary, options.changes, {
      path: options.file.path,
      category: options.file.category,
      action: "conflict",
      reason: "protected core document exists; local content preserved",
    });
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
      copyFile(srcPath, destPath);
    }
    options.managedCurrentFiles.push(options.file);
    return true;
  }

  record(options.summary, options.changes, {
    path: options.file.path,
    category: options.file.category,
    action: "conflict",
    reason: "local changes detected; content preserved",
  });
  return false;
}

function migrateConfigIfNeeded(root: string, dryRun: boolean, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const cfgPath = configPath(root);
  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const migrated = migrateConfig(raw);
  validateConfigSchema(migrated.config);
  if (migrated.from === migrated.to) {
    summary.unchanged += 1;
    return;
  }
  record(summary, changes, {
    path: ".mdkg/config.json",
    category: "config",
    action: "migrate",
    reason: `config schema_version ${migrated.from} -> ${migrated.to}`,
  });
  if (!dryRun) {
    writeFile(cfgPath, `${JSON.stringify(migrated.config, null, 2)}\n`);
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
      writeFile(eventsPath, seededInitEvent(new Date().toISOString()));
    }
  } else {
    summary.unchanged += 1;
  }
}

function isWritableChange(change: UpgradeChange): boolean {
  return change.action === "create" || change.action === "update" || change.action === "migrate" || change.action === "sync";
}

function buildApplySideEffects(options: {
  existingManifest: InitManifest | undefined;
  agentWorkspace: boolean;
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
    effects.push(
      {
        path: ".mdkg/skills/registry.md",
        category: "skill_registry",
        action: "update",
        reason: "refreshes canonical skill registry after apply",
      },
      {
        path: ".agents/skills,.claude/skills",
        category: "skill_mirror",
        action: "sync",
        reason: "syncs managed skill mirrors after apply",
      }
    );
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
      console.log(`  ${change.action}: ${change.path} (${change.reason})`);
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
  const agentWorkspace = isAgentWorkspace(root);
  const managedCurrentFiles: InitManifestFile[] = [];

  migrateConfigIfNeeded(root, dryRun, summary, changes);

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

  const applySideEffects = buildApplySideEffects({
    existingManifest,
    agentWorkspace,
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
      scaffoldMirrorRoots(root);
      syncSkillMirrors({ root, config, createRoots: true });
    }
  }

  const preservedCustomizations = changes.filter((change) => change.action === "conflict");
  const blockingConflicts: UpgradeChange[] = [];
  const willWritePaths = changes.filter(isWritableChange).map((change) => change.path);
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
