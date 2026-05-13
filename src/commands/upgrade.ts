import fs from "fs";
import path from "path";
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

export type UpgradeChangeAction = "create" | "update" | "migrate" | "sync" | "conflict";

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
  summary: UpgradeSummary;
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

function ensureAgentRuntimeFiles(root: string, dryRun: boolean, summary: UpgradeSummary, changes: UpgradeChange[]): void {
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  if (!fs.existsSync(eventsPath)) {
    record(summary, changes, {
      path: ".mdkg/work/events/events.jsonl",
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

function emitHumanReceipt(receipt: UpgradeReceipt): void {
  const mode = receipt.dry_run ? "dry-run" : "apply";
  console.log(
    `mdkg upgrade ${mode}: ${receipt.summary.created} create, ${receipt.summary.updated} update, ${receipt.summary.migrated} migrate, ${receipt.summary.synced} sync, ${receipt.summary.conflicted} conflict`
  );
  if (receipt.changes.length === 0) {
    console.log("no upgrade changes pending");
  } else {
    for (const change of receipt.changes) {
      console.log(`  ${change.action}: ${change.path} (${change.reason})`);
    }
  }
  if (receipt.dry_run && receipt.changes.some((change) => change.action !== "conflict")) {
    console.log("next: mdkg upgrade --apply");
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

  if (!dryRun) {
    const appliedManifest: InitManifest = {
      ...currentManifest,
      files: managedCurrentFiles.sort((a, b) => a.path.localeCompare(b.path)),
    };
    writeInitManifest(path.join(root, ".mdkg", INIT_MANIFEST_FILE), appliedManifest);
    if (agentWorkspace) {
      const config = validateConfigSchema(migrateConfig(JSON.parse(fs.readFileSync(configPath(root), "utf8"))).config);
      refreshSkillsRegistry(root, config);
      scaffoldMirrorRoots(root);
      const result = syncSkillMirrors({ root, config, createRoots: true });
      record(summary, changes, {
        path: ".agents/skills,.claude/skills",
        category: "skill_mirror",
        action: "sync",
        reason: `${result.synced} mirrored skill(s), ${result.pruned} stale mirror(s) pruned`,
      });
    }
  }

  const receipt: UpgradeReceipt = {
    action: "upgrade",
    dry_run: dryRun,
    version,
    summary,
    changes,
  };

  if (options.json) {
    console.log(`${JSON.stringify(receipt, null, 2)}`);
  } else {
    emitHumanReceipt(receipt);
  }
  return receipt;
}
