import fs from "fs";
import path from "path";
import { NotFoundError } from "../util/errors";
import { formatDate } from "../util/date";

export type InitCommandOptions = {
  root: string;
  force?: boolean;
  omni?: boolean;
  updateGitignore?: boolean;
  updateNpmignore?: boolean;
  updateDockerignore?: boolean;
  noUpdateIgnores?: boolean;
  createAgents?: boolean;
  createClaude?: boolean;
  createLlm?: boolean;
  seedRoot?: string;
};

type CopyStats = {
  created: number;
  skipped: number;
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

function copySeedFile(src: string, dest: string, force: boolean, stats: CopyStats): void {
  if (fs.existsSync(dest) && !force) {
    stats.skipped += 1;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  stats.created += 1;
}

function copySeedDir(srcDir: string, destDir: string, force: boolean, stats: CopyStats): void {
  if (!fs.existsSync(srcDir)) {
    return;
  }
  const files = listFiles(srcDir);
  for (const filePath of files) {
    const relPath = path.relative(srcDir, filePath);
    const destPath = path.join(destDir, relPath);
    copySeedFile(filePath, destPath, force, stats);
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
  filePath: string,
  content: string,
  force: boolean,
  stats: CopyStats
): void {
  if (fs.existsSync(filePath) && !force) {
    stats.skipped += 1;
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  stats.created += 1;
}

function soulTemplate(created: string): string {
  return [
    "---",
    `id: ${SOUL_PIN_ID}`,
    "type: rule",
    "title: agent soul and execution contract",
    "tags: [omni, agent, constraints]",
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

function registryTemplate(): string {
  return [
    "# Skills Registry",
    "",
    "This directory stores Agent Skills packages used by mdkg tooling and orchestrators.",
    "",
    "## Conventions",
    "",
    "- One folder per skill slug.",
    "- Use `SKILL.md` as the canonical skill entrypoint.",
    "- Keep procedures deterministic and avoid embedding secrets.",
    "",
    "## Suggested Next Skills",
    "",
    "- deterministic-pack-generation",
    "- test-and-verify-loop",
    "- release-readiness-audit",
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
    notes: "init omni scaffold target initialized",
    redacted: true,
  };
  return `${JSON.stringify(event)}\n`;
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
  const createAgents = Boolean(options.createAgents || options.createLlm);
  const createClaude = Boolean(options.createClaude || options.createLlm);
  const force = Boolean(options.force);

  const seedConfig = path.join(seedRoot, "config.json");
  const seedCore = path.join(seedRoot, "core");
  const seedTemplates = path.join(seedRoot, "templates");
  const seedAgents = path.join(seedRoot, "AGENTS.md");
  const seedClaude = path.join(seedRoot, "CLAUDE.md");
  const seedReadme = path.join(seedRoot, "README.md");

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
  if (!fs.existsSync(seedReadme)) {
    throw new NotFoundError(`init assets missing README.md at ${seedRoot}`);
  }

  const mdkgDir = path.join(root, ".mdkg");
  fs.mkdirSync(mdkgDir, { recursive: true });
  fs.mkdirSync(path.join(mdkgDir, "work"), { recursive: true });
  fs.mkdirSync(path.join(mdkgDir, "design"), { recursive: true });

  const stats: CopyStats = { created: 0, skipped: 0 };
  copySeedFile(seedConfig, path.join(mdkgDir, "config.json"), force, stats);
  copySeedFile(seedReadme, path.join(mdkgDir, "README.md"), force, stats);
  copySeedDir(seedCore, path.join(mdkgDir, "core"), force, stats);
  copySeedDir(seedTemplates, path.join(mdkgDir, "templates"), force, stats);
  if (createAgents) {
    copySeedFile(seedAgents, path.join(root, "AGENTS.md"), force, stats);
  }
  if (createClaude) {
    copySeedFile(seedClaude, path.join(root, "CLAUDE.md"), force, stats);
  }

  if (options.omni) {
    const today = formatDate(new Date());
    const soulPath = path.join(mdkgDir, "core", "SOUL.md");
    const humanPath = path.join(mdkgDir, "core", "HUMAN.md");
    const skillsDir = path.join(mdkgDir, "skills");
    const registryPath = path.join(skillsDir, "registry.md");
    const eventsDir = path.join(mdkgDir, "work", "events");
    const eventsPath = path.join(eventsDir, "events.jsonl");
    fs.mkdirSync(skillsDir, { recursive: true });
    fs.mkdirSync(eventsDir, { recursive: true });
    writeFileIfMissing(soulPath, soulTemplate(today), force, stats);
    writeFileIfMissing(humanPath, humanTemplate(today), force, stats);
    writeFileIfMissing(registryPath, registryTemplate(), force, stats);
    if (!fs.existsSync(eventsPath) || force) {
      writeFileIfMissing(eventsPath, seededInitEvent(new Date().toISOString()), force, stats);
    }

    const coreListPath = path.join(mdkgDir, "core", "core.md");
    ensureCorePins(coreListPath, [SOUL_PIN_ID, HUMAN_PIN_ID]);
  }

  const noUpdateIgnores = Boolean(options.noUpdateIgnores);
  const shouldUpdateGitignore = Boolean(options.updateGitignore || !noUpdateIgnores);
  const shouldUpdateNpmignore = Boolean(options.updateNpmignore || !noUpdateIgnores);

  if (shouldUpdateGitignore) {
    appendIgnoreEntries(path.join(root, ".gitignore"), [
      ".mdkg/index/",
      ".mdkg/pack/",
      ".mdkg/work/events/*.jsonl",
    ]);
  }
  if (shouldUpdateNpmignore) {
    appendIgnoreEntries(path.join(root, ".npmignore"), [".mdkg/", ".mdkg/index/", ".mdkg/pack/"]);
  }
  if (options.updateDockerignore) {
    appendIgnoreEntries(path.join(root, ".dockerignore"), [".mdkg/"]);
  }

  console.log(
    `mdkg init complete: ${stats.created} file(s) created, ${stats.skipped} skipped`
  );
  console.log("next:");
  console.log("  mdkg index");
  console.log('  mdkg new task "..." --status todo --priority 1');
  console.log("  mdkg list --status todo");
  console.log("  mdkg pack <id> --verbose");
  console.log("  mdkg validate");
}
