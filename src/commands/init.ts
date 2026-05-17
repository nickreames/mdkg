import fs from "fs";
import path from "path";
import { loadConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import { NotFoundError } from "../util/errors";
import { formatDate } from "../util/date";
import { readPackageVersion } from "../core/version";
import { createInitManifest, INIT_MANIFEST_FILE, writeInitManifest } from "./init_manifest";
import { refreshSkillsRegistry, registryTemplate } from "./skill_support";
import { preflightSkillMirrorTargets, scaffoldMirrorRoots, syncSkillMirrors } from "./skill_mirror";

export type InitCommandOptions = {
  root: string;
  force?: boolean;
  agent?: boolean;
  updateGitignore?: boolean;
  updateNpmignore?: boolean;
  updateDockerignore?: boolean;
  noUpdateIgnores?: boolean;
  seedRoot?: string;
};

type CopyStats = {
  created: number;
  skipped: number;
  createdPaths: string[];
  skippedPaths: string[];
  ignoreFilesUpdated: string[];
  manifestWritten: boolean;
  registryRefreshed: boolean;
  mirrorTargets: number;
  mirroredSkills: number;
};

const DEFAULT_SEED_SUBDIR = path.resolve(__dirname, "..", "init");
const SOUL_PIN_ID = "rule-soul";
const HUMAN_PIN_ID = "rule-human";
const DEFAULT_CORE_LIST_HEADER = [
  "# mdkg verbose core list",
  "",
  "# One node ID per line. Lines starting with # are comments.",
  "# This list is included by `mdkg pack --verbose`.",
];

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function displayPath(root: string, filePath: string): string {
  const relPath = path.relative(root, filePath).split(path.sep).join("/");
  return relPath.length > 0 ? relPath : ".";
}

function recordCreated(root: string, dest: string, stats: CopyStats): void {
  stats.created += 1;
  stats.createdPaths.push(displayPath(root, dest));
}

function recordSkipped(root: string, dest: string, stats: CopyStats): void {
  stats.skipped += 1;
  stats.skippedPaths.push(displayPath(root, dest));
}

function copySeedFile(root: string, src: string, dest: string, force: boolean, stats: CopyStats): void {
  if (fs.existsSync(dest) && !force) {
    recordSkipped(root, dest, stats);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  recordCreated(root, dest, stats);
}

function copySeedDir(root: string, srcDir: string, destDir: string, force: boolean, stats: CopyStats): void {
  if (!fs.existsSync(srcDir)) {
    return;
  }
  const files = listFiles(srcDir);
  for (const filePath of files) {
    const relPath = path.relative(srcDir, filePath);
    const destPath = path.join(destDir, relPath);
    copySeedFile(root, filePath, destPath, force, stats);
  }
}

function appendIgnoreEntries(filePath: string, entries: string[]): boolean {
  const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const lines = raw.split(/\r?\n/);
  const existing = new Set(lines.map((line) => line.trim()).filter(Boolean));
  const additions = entries.filter((entry) => !existing.has(entry));
  if (additions.length === 0) {
    return false;
  }
  const suffix = raw.length === 0 || raw.endsWith("\n") ? "" : "\n";
  const updated = `${raw}${suffix}${additions.join("\n")}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, updated, "utf8");
  return true;
}

function writeFileIfMissing(
  root: string,
  filePath: string,
  content: string,
  force: boolean,
  stats: CopyStats
): void {
  if (fs.existsSync(filePath) && !force) {
    recordSkipped(root, filePath, stats);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  recordCreated(root, filePath, stats);
}

function soulTemplate(created: string): string {
  return [
    "---",
    `id: ${SOUL_PIN_ID}`,
    "type: rule",
    "title: agent soul and execution contract",
    "tags: [agent, constraints]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "refs: []",
    "aliases: [soul]",
    `created: ${created}`,
    `updated: ${created}`,
    "---",
    "",
    "# Purpose",
    "",
    "Define the canonical agent execution boundaries and memory contract for this repository.",
    "",
    "# Scope",
    "",
    "Applies to all orchestrators and coding-agent executions using mdkg in this repo.",
    "",
    "# Requirements",
    "",
    "- Ask for approval before destructive operations or policy-sensitive actions.",
    "- Prefer deterministic mdkg packs over ad-hoc context assembly.",
    "- Follow single-writer commit discipline and event-driven batching.",
    "- Never place secrets in mdkg docs or generated packs.",
    "",
    "# Notes",
    "",
    "Customize this file to encode repo-specific constraints, approval boundaries, and memory cadence.",
    "",
  ].join("\n");
}

function humanTemplate(created: string): string {
  return [
    "---",
    `id: ${HUMAN_PIN_ID}`,
    "type: rule",
    "title: human working profile and collaboration preferences",
    "tags: [human, collaboration, preferences]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "refs: []",
    "aliases: [human]",
    `created: ${created}`,
    `updated: ${created}`,
    "---",
    "",
    "# Purpose",
    "",
    "Capture stable collaboration preferences and boundaries so agents can work with less ambiguity.",
    "",
    "# Scope",
    "",
    "Applies to planning, implementation, and review interactions in this repository.",
    "",
    "# Requirements",
    "",
    "- Keep top goals, boundaries, and style preferences current.",
    "- Include ask-before-doing constraints for risky or high-impact actions.",
    "- Record preferred environment assumptions and validation commands.",
    "",
    "# Notes",
    "",
    "Suggested prompts:",
    "- What are your top 3 goals in this repo right now?",
    "- What should never happen without confirmation?",
    "- What coding/review style should the agent prefer?",
    "- What OS/runtime/test commands should be assumed?",
    "",
  ].join("\n");
}

function seededInitEvent(nowIso: string): string {
  const event = {
    ts: nowIso,
    run_id: `init-${nowIso.replace(/[^0-9]/g, "").slice(0, 14)}`,
    workspace: "root",
    agent: "mdkg",
    kind: "RUN_STARTED",
    status: "ok",
    refs: ["edd-4"],
    artifacts: [],
    notes: "init agent scaffold target initialized",
    redacted: true,
  };
  return `${JSON.stringify(event)}\n`;
}

function listSeedSkillSlugs(seedDefaultSkills: string): string[] {
  if (!fs.existsSync(seedDefaultSkills)) {
    return [];
  }
  return fs
    .readdirSync(seedDefaultSkills, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(seedDefaultSkills, entry.name, "SKILL.md")))
    .map((entry) => entry.name.toLowerCase())
    .sort();
}

function listExistingCanonicalSkillSlugs(root: string): string[] {
  const skillsDir = path.join(root, ".mdkg", "skills");
  if (!fs.existsSync(skillsDir)) {
    return [];
  }
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsDir, entry.name, "SKILL.md")))
    .map((entry) => entry.name.toLowerCase())
    .sort();
}

function preflightSeedConfig(seedConfig: string): void {
  const raw = JSON.parse(fs.readFileSync(seedConfig, "utf8"));
  validateConfigSchema(migrateConfig(raw).config);
}

function emitPartialInitFailure(root: string, stats: CopyStats, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  console.error("mdkg init failed after partial writes");
  console.error(`error: ${message}`);
  console.error(`created: ${stats.created}`);
  for (const created of stats.createdPaths) {
    console.error(`  created: ${created}`);
  }
  console.error(`skipped: ${stats.skipped}`);
  for (const skipped of stats.skippedPaths) {
    console.error(`  skipped: ${skipped}`);
  }
  console.error("recovery:");
  console.error("  inspect the created paths above");
  console.error("  rerun `mdkg init --agent` after resolving the reported error");
  console.error(`  root: ${root}`);
}

function parseCoreList(raw: string): { header: string[]; ids: string[] } {
  const lines = raw.split(/\r?\n/);
  const header: string[] = [];
  const ids: string[] = [];
  let seenFirstId = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const isComment = trimmed.startsWith("#");
    if (!seenFirstId && (trimmed.length === 0 || isComment)) {
      header.push(line);
      continue;
    }
    if (trimmed.length === 0 || isComment) {
      seenFirstId = true;
      continue;
    }
    seenFirstId = true;
    ids.push(trimmed.toLowerCase());
  }
  return { header, ids };
}

function ensureCorePins(coreListPath: string, requiredPins: string[]): void {
  const raw = fs.existsSync(coreListPath) ? fs.readFileSync(coreListPath, "utf8") : "";
  const { header, ids } = parseCoreList(raw);

  const seen = new Set<string>();
  const dedupedExisting: string[] = [];
  for (const id of ids) {
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    dedupedExisting.push(id);
  }

  const required = requiredPins.map((value) => value.toLowerCase());
  const filteredExisting = dedupedExisting.filter((value) => !required.includes(value));
  const finalIds = [...required, ...filteredExisting];

  const headerLines = header.length > 0 ? header : DEFAULT_CORE_LIST_HEADER;
  const normalizedHeader = headerLines.slice();
  while (normalizedHeader.length > 0 && normalizedHeader[normalizedHeader.length - 1].trim() === "") {
    normalizedHeader.pop();
  }

  const output = [...normalizedHeader, "", ...finalIds, ""].join("\n");
  fs.mkdirSync(path.dirname(coreListPath), { recursive: true });
  fs.writeFileSync(coreListPath, output, "utf8");
}

export function runInitCommand(options: InitCommandOptions): void {
  const root = path.resolve(options.root);
  const seedRoot = options.seedRoot ? path.resolve(options.seedRoot) : DEFAULT_SEED_SUBDIR;
  const createAgents = Boolean(options.agent);
  const createClaude = Boolean(options.agent);
  const createStartupDocs = Boolean(options.agent);
  const force = Boolean(options.force);

  const seedConfig = path.join(seedRoot, "config.json");
  const seedCore = path.join(seedRoot, "core");
  const seedTemplates = path.join(seedRoot, "templates");
  const seedAgents = path.join(seedRoot, "AGENTS.md");
  const seedClaude = path.join(seedRoot, "CLAUDE.md");
  const seedLlms = path.join(seedRoot, "llms.txt");
  const seedAgentStart = path.join(seedRoot, "AGENT_START.md");
  const seedCliMatrix = path.join(seedRoot, "CLI_COMMAND_MATRIX.md");
  const seedReadme = path.join(seedRoot, "README.md");
  const seedDefaultSkills = path.join(seedRoot, "skills", "default");
  const seedSoul = path.join(seedCore, "SOUL.md");
  const seedHuman = path.join(seedCore, "HUMAN.md");
  const seedManifest = createInitManifest(seedRoot, readPackageVersion(), {
    includeAgentDocs: Boolean(options.agent),
    includeStartupDocs: Boolean(options.agent),
    includeDefaultSkills: Boolean(options.agent),
  });

  if (!fs.existsSync(seedConfig) || !fs.existsSync(seedCore) || !fs.existsSync(seedTemplates)) {
    throw new NotFoundError(
      `init assets not found at ${seedRoot} (try reinstalling mdkg)`
    );
  }
  if (createAgents && !fs.existsSync(seedAgents)) {
    throw new NotFoundError(`init assets missing AGENTS.md at ${seedRoot}`);
  }
  if (createClaude && !fs.existsSync(seedClaude)) {
    throw new NotFoundError(`init assets missing CLAUDE.md at ${seedRoot}`);
  }
  if (createStartupDocs && !fs.existsSync(seedLlms)) {
    throw new NotFoundError(`init assets missing llms.txt at ${seedRoot}`);
  }
  if (createStartupDocs && !fs.existsSync(seedAgentStart)) {
    throw new NotFoundError(`init assets missing AGENT_START.md at ${seedRoot}`);
  }
  if (createStartupDocs && !fs.existsSync(seedCliMatrix)) {
    throw new NotFoundError(`init assets missing CLI_COMMAND_MATRIX.md at ${seedRoot}`);
  }
  if (!fs.existsSync(seedReadme)) {
    throw new NotFoundError(`init assets missing README.md at ${seedRoot}`);
  }
  if (options.agent && !fs.existsSync(seedDefaultSkills)) {
    throw new NotFoundError(`init assets missing default skills at ${seedRoot}`);
  }
  preflightSeedConfig(seedConfig);
  if (options.agent) {
    preflightSkillMirrorTargets({
      root,
      slugs: [...listSeedSkillSlugs(seedDefaultSkills), ...listExistingCanonicalSkillSlugs(root)],
      force,
    });
  }

  const stats: CopyStats = {
    created: 0,
    skipped: 0,
    createdPaths: [],
    skippedPaths: [],
    ignoreFilesUpdated: [],
    manifestWritten: false,
    registryRefreshed: false,
    mirrorTargets: 0,
    mirroredSkills: 0,
  };
  const mdkgDir = path.join(root, ".mdkg");
  try {
    fs.mkdirSync(mdkgDir, { recursive: true });
    fs.mkdirSync(path.join(mdkgDir, "work"), { recursive: true });
    fs.mkdirSync(path.join(mdkgDir, "design"), { recursive: true });

    copySeedFile(root, seedConfig, path.join(mdkgDir, "config.json"), force, stats);
    copySeedFile(root, seedReadme, path.join(mdkgDir, "README.md"), force, stats);
    copySeedDir(root, seedCore, path.join(mdkgDir, "core"), force, stats);
    copySeedDir(root, seedTemplates, path.join(mdkgDir, "templates"), force, stats);
    if (createAgents) {
      copySeedFile(root, seedAgents, path.join(root, "AGENTS.md"), force, stats);
    }
    if (createClaude) {
      copySeedFile(root, seedClaude, path.join(root, "CLAUDE.md"), force, stats);
    }
    if (createStartupDocs) {
      copySeedFile(root, seedLlms, path.join(root, "llms.txt"), force, stats);
      copySeedFile(root, seedAgentStart, path.join(root, "AGENT_START.md"), force, stats);
      copySeedFile(root, seedCliMatrix, path.join(root, "CLI_COMMAND_MATRIX.md"), force, stats);
    }

    if (options.agent) {
      const today = formatDate(new Date());
      const soulPath = path.join(mdkgDir, "core", "SOUL.md");
      const humanPath = path.join(mdkgDir, "core", "HUMAN.md");
      const skillsDir = path.join(mdkgDir, "skills");
      const registryPath = path.join(skillsDir, "registry.md");
      const eventsDir = path.join(mdkgDir, "work", "events");
      const eventsPath = path.join(eventsDir, "events.jsonl");
      fs.mkdirSync(skillsDir, { recursive: true });
      fs.mkdirSync(eventsDir, { recursive: true });
      copySeedDir(root, seedDefaultSkills, skillsDir, force, stats);
      if (!fs.existsSync(seedSoul)) {
        writeFileIfMissing(root, soulPath, soulTemplate(today), force, stats);
      }
      if (!fs.existsSync(seedHuman)) {
        writeFileIfMissing(root, humanPath, humanTemplate(today), force, stats);
      }
      writeFileIfMissing(root, registryPath, registryTemplate(), force, stats);
      if (!fs.existsSync(eventsPath) || force) {
        writeFileIfMissing(root, eventsPath, seededInitEvent(new Date().toISOString()), force, stats);
      }

      const coreListPath = path.join(mdkgDir, "core", "core.md");
      ensureCorePins(coreListPath, [SOUL_PIN_ID, HUMAN_PIN_ID]);

      scaffoldMirrorRoots(root);
      const config = loadConfig(root);
      refreshSkillsRegistry(root, config);
      stats.registryRefreshed = true;
      const mirrorResult = syncSkillMirrors({ root, config, createRoots: true, force });
      stats.mirrorTargets = mirrorResult.targets;
      stats.mirroredSkills = mirrorResult.synced;
    }

    writeInitManifest(path.join(mdkgDir, INIT_MANIFEST_FILE), seedManifest);
    stats.manifestWritten = true;
  } catch (err) {
    if (stats.created > 0 || stats.skipped > 0) {
      emitPartialInitFailure(root, stats, err);
    }
    throw err;
  }

  const noUpdateIgnores = Boolean(options.noUpdateIgnores);
  const shouldUpdateGitignore = Boolean(options.updateGitignore || !noUpdateIgnores);
  const shouldUpdateNpmignore = Boolean(options.updateNpmignore || !noUpdateIgnores);

  try {
    if (shouldUpdateGitignore) {
      if (appendIgnoreEntries(path.join(root, ".gitignore"), [
        ".mdkg/index/",
        ".mdkg/pack/",
        ".mdkg/archive/**/source/",
      ])) {
        stats.ignoreFilesUpdated.push(".gitignore");
      }
    }
    if (shouldUpdateNpmignore) {
      if (appendIgnoreEntries(path.join(root, ".npmignore"), [".mdkg/", ".mdkg/index/", ".mdkg/pack/"])) {
        stats.ignoreFilesUpdated.push(".npmignore");
      }
    }
    if (options.updateDockerignore) {
      if (appendIgnoreEntries(path.join(root, ".dockerignore"), [".mdkg/"])) {
        stats.ignoreFilesUpdated.push(".dockerignore");
      }
    }
  } catch (err) {
    if (stats.created > 0 || stats.skipped > 0) {
      emitPartialInitFailure(root, stats, err);
    }
    throw err;
  }

  console.log(
    `mdkg init complete: ${stats.created} file(s) created, ${stats.skipped} skipped`
  );
  if (stats.manifestWritten) {
    console.log("managed manifest: .mdkg/init-manifest.json");
  }
  if (stats.ignoreFilesUpdated.length > 0) {
    console.log(`ignore files updated: ${stats.ignoreFilesUpdated.join(", ")}`);
  }
  if (options.agent) {
    console.log("agent bootstrap: AGENT_START.md, AGENTS.md, CLAUDE.md, llms.txt, CLI_COMMAND_MATRIX.md");
    console.log("agent core pins: rule-soul, rule-human");
    console.log("agent event log: .mdkg/work/events/events.jsonl");
    console.log(`skill mirrors: ${stats.mirroredSkills} sync operation(s) across ${stats.mirrorTargets} target(s)`);
    if (stats.registryRefreshed) {
      console.log("skill registry: .mdkg/skills/registry.md");
    }
  }
  console.log("next:");
  if (createStartupDocs) {
    console.log("  read AGENT_START.md");
  }
  console.log('  mdkg new task "..." --status todo --priority 1');
  console.log('  mdkg search "..."');
  console.log("  mdkg show <id>");
  console.log("  mdkg next");
  console.log("  mdkg pack <id>");
  console.log("  mdkg validate");
}
