import fs from "fs";
import path from "path";
import {
  atomicReplaceContainedFile,
  containedPathExists,
  ensureContainedDirectory,
  readContainedFile,
} from "../core/filesystem_authority";
import { loadConfig, validateConfigSchema } from "../core/config";
import { migrateConfig } from "../core/migrate";
import { NotFoundError, UsageError } from "../util/errors";
import { appendInstructions, instructionHash, instructionSection } from "./bootstrap_instructions";
import { formatDate } from "../util/date";
import { readPackageVersion } from "../core/version";
import { PROJECT_DB_GITIGNORE_ENTRIES } from "../core/project_db";
import { createInitManifest, INIT_MANIFEST_FILE, readInitManifest, sha256File, writeInitManifest } from "./init_manifest";
import { refreshSkillsRegistry, registryTemplate } from "./skill_support";
import { preflightSkillMirrorTargets, scaffoldMirrorRoots, syncSkillMirrors } from "./skill_mirror";
import { assertPublicSkillProjection } from "../core/public_skill_projection";
import { parseFrontmatter } from "../graph/frontmatter";
import { assertNoGraphConflictMarkers, assertNodeFormat, readGraphFormat, readNodeIdentity } from "../graph/identity";
import { readUpgradeJournal } from "./upgrade_transaction";
import { withMutationLock } from "../util/lock";

export type InitCommandOptions = {
  root: string;
  force?: boolean;
  agent?: boolean;
  graphOnly?: boolean;
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
const COLLABORATION_PIN_ID = "rule-7";
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
  const relativePath = displayPath(root, dest);
  if (containedPathExists({ root, relativePath }) && !force) {
    recordSkipped(root, dest, stats);
    return;
  }
  atomicReplaceContainedFile({ root, relativePath }, fs.readFileSync(src));
  recordCreated(root, dest, stats);
}

function copyInstructionFile(root: string, src: string, relativePath: string, stats: CopyStats): void {
  const before = containedPathExists({ root, relativePath }) ? readContainedFile({ root, relativePath }) : "";
  const after = appendInstructions(before, fs.readFileSync(src, "utf8"));
  if (after === before) {
    recordSkipped(root, path.join(root, relativePath), stats);
    return;
  }
  atomicReplaceContainedFile({ root, relativePath }, after);
  recordCreated(root, path.join(root, relativePath), stats);
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

/** Bootstrap may restore guidance, but it is not identity migration or repair. */
function preflightInitIdentity(root: string, seedCore: string, agent: boolean, force: boolean): void {
  const format = readGraphFormat(root);
  const journal = readUpgradeJournal(root);
  if (journal && !["completed", "recovered"].includes(journal.state)) {
    throw new UsageError("unfinished upgrade; inspect its journal and use mdkg upgrade --resume or --recover with the reviewed plan hash before init");
  }
  if (format.format_version === 2 && force) {
    throw new UsageError("init --force cannot replace adopted graph configuration or node identities; use reviewed upgrade/reconciliation and rerun init without --force");
  }
  const candidates = new Map(listFiles(seedCore).map(file => [
    `.mdkg/core/${path.relative(seedCore, file).split(path.sep).join("/")}`,
    fs.readFileSync(file, "utf8"),
  ]));
  if (agent) {
    const today = formatDate(new Date());
    for (const [name, content] of [
      ["SOUL.md", soulTemplate(today)], ["COLLABORATION.md", collaborationTemplate(today)], ["HUMAN.md", humanTemplate(today)],
    ]) if (!candidates.has(`.mdkg/core/${name}`)) candidates.set(`.mdkg/core/${name}`, content);
  }
  for (const [relativePath, seed] of candidates) {
    // core.md is a pin list, not an authored node. Other core assets without
    // frontmatter are guidance, and do not acquire identity during init.
    const existing = containedPathExists({ root, relativePath }) ? readContainedFile({ root, relativePath }) : undefined;
    for (const content of [existing, ...(existing === undefined || force ? [seed] : [])]) {
      if (content === undefined) continue;
      assertNoGraphConflictMarkers(content, relativePath);
      if (!/^---\s*\r?\n/.test(content)) continue;
      const frontmatter = parseFrontmatter(content, relativePath).frontmatter;
      if (frontmatter.id === undefined && frontmatter.graph_id === undefined && frontmatter.node_id === undefined) continue;
      assertNodeFormat(format, readNodeIdentity(frontmatter, relativePath), relativePath);
      if (format.format_version === 2 && (existing === undefined || force)) {
        throw new UsageError(`${relativePath}: init cannot create or replace adopted node identity; restore exact reviewed node evidence or use reviewed graph reconciliation, then rerun init without --force`);
      }
    }
  }
}

function appendIgnoreEntries(root: string, filePath: string, entries: string[]): boolean {
  const relativePath = displayPath(root, filePath);
  const raw = containedPathExists({ root, relativePath })
    ? readContainedFile({ root, relativePath })
    : "";
  const lines = raw.split(/\r?\n/);
  const existing = new Set(lines.map((line) => line.trim()).filter(Boolean));
  const additions = entries.filter((entry) => !existing.has(entry));
  if (additions.length === 0) {
    return false;
  }
  const suffix = raw.length === 0 || raw.endsWith("\n") ? "" : "\n";
  const updated = `${raw}${suffix}${additions.join("\n")}\n`;
  atomicReplaceContainedFile({ root, relativePath }, updated);
  return true;
}

function writeFileIfMissing(
  root: string,
  filePath: string,
  content: string,
  force: boolean,
  stats: CopyStats
): void {
  const relativePath = displayPath(root, filePath);
  if (containedPathExists({ root, relativePath }) && !force) {
    recordSkipped(root, filePath, stats);
    return;
  }
  atomicReplaceContainedFile({ root, relativePath }, content);
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

function collaborationTemplate(created: string): string {
  return [
    "---",
    `id: ${COLLABORATION_PIN_ID}`,
    "type: rule",
    "title: collaboration profile and operator preferences",
    "tags: [collaboration, preferences, operator]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: [rule-human]",
    "refs: [dec-53]",
    "aliases: [collaboration, operator-profile]",
    `created: ${created}`,
    `updated: ${created}`,
    "---",
    "",
    "# Purpose",
    "",
    "Capture stable collaboration preferences, operating boundaries, and repo-specific human expectations so agents can work with less ambiguity.",
    "",
    "# Scope",
    "",
    "Applies to planning, implementation, review, release, and handoff interactions in this repository.",
    "",
    "# Compatibility",
    "",
    "`COLLABORATION.md` is canonical. `HUMAN.md` remains a one-release legacy alias for repos and agent prompts that still reference it; read `COLLABORATION.md` first and then use `HUMAN.md` only for compatibility notes not yet migrated.",
    "",
    "# Requirements",
    "",
    "- Keep top goals, boundaries, and style preferences current.",
    "- Include ask-before-doing constraints for risky or high-impact actions.",
    "- Record preferred environment assumptions and validation commands.",
    "- Preview `mdkg upgrade` and review changes before applying with its exact --plan-hash and the same --only selection, if any; preserve local operator customizations.",
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
  console.error("  rerun `mdkg init` after resolving the reported error (compact agent setup is the default)");
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

function ensureCorePins(root: string, coreListPath: string, requiredPins: string[]): void {
  const relativePath = displayPath(root, coreListPath);
  const raw = containedPathExists({ root, relativePath })
    ? readContainedFile({ root, relativePath })
    : "";
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
  atomicReplaceContainedFile({ root, relativePath }, output);
}

function refreshManifestHash(root: string, manifest: ReturnType<typeof createInitManifest>, relPath: string): void {
  const entry = manifest.files.find((file) => file.path === relPath);
  if (!entry) {
    return;
  }
  const targetPath = path.join(root, relPath);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    entry.sha256 = sha256File(targetPath);
  }
}

function ensureCreatedCoreManifestEntry(
  root: string,
  manifest: ReturnType<typeof createInitManifest>,
  relPath: string,
  stats: CopyStats
): void {
  if (manifest.files.some((file) => file.path === relPath) || !stats.createdPaths.includes(relPath)) {
    return;
  }
  const targetPath = path.join(root, relPath);
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    return;
  }
  manifest.files.push({
    path: relPath,
    category: "core",
    sha256: sha256File(targetPath),
  });
  manifest.files.sort((a, b) => a.path.localeCompare(b.path));
}

function initialize(options: InitCommandOptions, locked: boolean): void {
  if (options.graphOnly && options.agent) throw new UsageError("--graph-only and --agent cannot be combined");
  const agent = !options.graphOnly && options.agent !== false;
  const root = path.resolve(options.root);
  const seedRoot = options.seedRoot ? path.resolve(options.seedRoot) : DEFAULT_SEED_SUBDIR;
  const createAgents = agent;
  const createClaude = agent;
  const createStartupDocs = agent;
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
  const seedSkillPolicy = path.join(seedRoot, "skills", "public-seed-policy.json");
  const seedSoul = path.join(seedCore, "SOUL.md");
  const seedCollaboration = path.join(seedCore, "COLLABORATION.md");
  const seedHuman = path.join(seedCore, "HUMAN.md");
  const seedManifest = createInitManifest(seedRoot, readPackageVersion(), {
    includeAgentDocs: agent,
    includeStartupDocs: agent,
    includeDefaultSkills: agent,
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
  if (agent && !fs.existsSync(seedDefaultSkills)) {
    throw new NotFoundError(`init assets missing default skills at ${seedRoot}`);
  }
  if (agent && !options.seedRoot && !fs.existsSync(seedSkillPolicy)) {
    throw new NotFoundError(`init assets missing public skill policy at ${seedRoot}`);
  }
  preflightSeedConfig(seedConfig);
  preflightInitIdentity(root, seedCore, agent, force);
  const previousManifestPath = path.join(root, ".mdkg", INIT_MANIFEST_FILE);
  if (containedPathExists({ root, relativePath: `.mdkg/${INIT_MANIFEST_FILE}` })) {
    readContainedFile({ root, relativePath: `.mdkg/${INIT_MANIFEST_FILE}` });
  }
  const previousManifest = readInitManifest(previousManifestPath);
  if (agent) {
    for (const relativePath of ["AGENTS.md", "CLAUDE.md"]) {
      if (containedPathExists({ root, relativePath })) instructionSection(readContainedFile({ root, relativePath }));
    }
  }
  const existingCanonicalSkills = agent ? listExistingCanonicalSkillSlugs(root) : [];
  if (agent) {
    if (fs.existsSync(seedSkillPolicy)) {
      assertPublicSkillProjection({
        policyPath: seedSkillPolicy,
        publicRoot: seedDefaultSkills,
      });
    }
    preflightSkillMirrorTargets({
      root,
      slugs: [...listSeedSkillSlugs(seedDefaultSkills), ...existingCanonicalSkills],
      force,
    });
  }

  // Refuse incompatible input before creating a lock directory. Re-run the
  // complete preflight under the shared writer lock before the first write.
  if (!locked) {
    const config = !force && containedPathExists({ root, relativePath: ".mdkg/config.json" })
      ? loadConfig(root)
      : validateConfigSchema(migrateConfig(JSON.parse(fs.readFileSync(seedConfig, "utf8"))).config);
    return withMutationLock(root, config.index.lock_timeout_ms, () => initialize(options, true));
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
    ensureContainedDirectory({ root, relativePath: ".mdkg" });
    ensureContainedDirectory({ root, relativePath: ".mdkg/work" });
    ensureContainedDirectory({ root, relativePath: ".mdkg/design" });

    copySeedFile(root, seedConfig, path.join(mdkgDir, "config.json"), force, stats);
    copySeedFile(root, seedReadme, path.join(mdkgDir, "README.md"), force, stats);
    copySeedDir(root, seedCore, path.join(mdkgDir, "core"), force, stats);
    copySeedDir(root, seedTemplates, path.join(mdkgDir, "templates"), force, stats);
    if (createAgents) {
      copyInstructionFile(root, seedAgents, "AGENTS.md", stats);
    }
    if (createClaude) {
      copyInstructionFile(root, seedClaude, "CLAUDE.md", stats);
    }
    if (createStartupDocs) {
      copySeedFile(root, seedLlms, path.join(mdkgDir, "llms.txt"), force, stats);
      copySeedFile(root, seedAgentStart, path.join(mdkgDir, "AGENT_START.md"), force, stats);
      copySeedFile(root, seedCliMatrix, path.join(mdkgDir, "CLI_COMMAND_MATRIX.md"), force, stats);
    }

    if (agent) {
      const today = formatDate(new Date());
      const soulPath = path.join(mdkgDir, "core", "SOUL.md");
      const collaborationPath = path.join(mdkgDir, "core", "COLLABORATION.md");
      const humanPath = path.join(mdkgDir, "core", "HUMAN.md");
      const skillsDir = path.join(mdkgDir, "skills");
      const registryPath = path.join(skillsDir, "registry.md");
      const eventsDir = path.join(mdkgDir, "work", "events");
      const eventsPath = path.join(eventsDir, "events.jsonl");
      ensureContainedDirectory({ root, relativePath: ".mdkg/skills" });
      ensureContainedDirectory({ root, relativePath: ".mdkg/work/events" });
      copySeedDir(root, seedDefaultSkills, skillsDir, force, stats);
      if (fs.existsSync(seedSkillPolicy) && existingCanonicalSkills.length === 0) {
        assertPublicSkillProjection({
          policyPath: seedSkillPolicy,
          publicRoot: seedDefaultSkills,
          freshInitRoot: skillsDir,
        });
      }
      if (!fs.existsSync(seedSoul)) {
        writeFileIfMissing(root, soulPath, soulTemplate(today), force, stats);
      }
      if (!fs.existsSync(seedCollaboration)) {
        writeFileIfMissing(root, collaborationPath, collaborationTemplate(today), force, stats);
      }
      if (!fs.existsSync(seedHuman)) {
        writeFileIfMissing(root, humanPath, humanTemplate(today), force, stats);
      }
      writeFileIfMissing(root, registryPath, registryTemplate(), force, stats);
      if (!fs.existsSync(eventsPath) || force) {
        writeFileIfMissing(root, eventsPath, seededInitEvent(new Date().toISOString()), force, stats);
      }

      const coreListPath = path.join(mdkgDir, "core", "core.md");
      ensureCorePins(root, coreListPath, [SOUL_PIN_ID, COLLABORATION_PIN_ID, HUMAN_PIN_ID]);
      refreshManifestHash(root, seedManifest, ".mdkg/core/core.md");
      ensureCreatedCoreManifestEntry(root, seedManifest, ".mdkg/core/SOUL.md", stats);
      ensureCreatedCoreManifestEntry(root, seedManifest, ".mdkg/core/COLLABORATION.md", stats);
      ensureCreatedCoreManifestEntry(root, seedManifest, ".mdkg/core/HUMAN.md", stats);

      const config = loadConfig(root);
      scaffoldMirrorRoots(root, config);
      refreshSkillsRegistry(root, config);
      stats.registryRefreshed = true;
      const mirrorResult = syncSkillMirrors({ root, config, createRoots: true, force });
      stats.mirrorTargets = mirrorResult.targets;
      stats.mirroredSkills = mirrorResult.synced;
    }

    // Record only the actual managed section, never ownership of surrounding text.
    seedManifest.files = seedManifest.files.filter((file) => {
      if (file.category !== "agent_doc") return true;
      const section = instructionSection(readContainedFile({ root, relativePath: file.path }));
      if (!section) return false;
      const seedSection = instructionSection(appendInstructions("", fs.readFileSync(file.path === "AGENTS.md" ? seedAgents : seedClaude, "utf8")));
      if (section.text.replace(/\r\n/g, "\n") !== seedSection?.text) return false;
      file.sha256 = sha256File(path.join(root, file.path));
      file.managed_section_sha256 = instructionHash(section.text);
      return true;
    });
    // Repeated init is not an upgrade: preserve old provenance for assets that
    // were skipped instead of claiming the newly installed package owns them.
    const installed = new Map((previousManifest?.files ?? []).map(file => [file.path, file]));
    for (const file of seedManifest.files) {
      if (containedPathExists({ root, relativePath: file.path }) && sha256File(path.join(root, file.path)) === file.sha256) {
        installed.set(file.path, file);
      }
    }
    seedManifest.files = [...installed.values()].sort((a, b) => a.path.localeCompare(b.path));
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
      if (appendIgnoreEntries(root, path.join(root, ".gitignore"), [
        ".mdkg/index/*.json",
        ".mdkg/index/*.tmp",
        ".mdkg/index/*.lock",
        ".mdkg/index/write.lock/",
        ".mdkg/index/*.sqlite-wal",
        ".mdkg/index/*.sqlite-shm",
        ".mdkg/index/*.sqlite-journal",
        ...PROJECT_DB_GITIGNORE_ENTRIES,
        ".mdkg/state/",
        ".mdkg/pack/",
        ".mdkg/subgraphs/",
        ".mdkg/archive/**/source/",
      ])) {
        stats.ignoreFilesUpdated.push(".gitignore");
      }
    }
    if (shouldUpdateNpmignore) {
      if (appendIgnoreEntries(root, path.join(root, ".npmignore"), [".mdkg/", ".mdkg/index/", ".mdkg/pack/"])) {
        stats.ignoreFilesUpdated.push(".npmignore");
      }
    }
    if (options.updateDockerignore) {
      if (appendIgnoreEntries(root, path.join(root, ".dockerignore"), [".mdkg/"])) {
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
  if (agent) {
    console.log("agent bootstrap: AGENTS.md, CLAUDE.md; guidance: .mdkg/AGENT_START.md, .mdkg/llms.txt, .mdkg/CLI_COMMAND_MATRIX.md");
    console.log("agent core pins: rule-soul, rule-7, rule-human");
    console.log("agent event log: .mdkg/work/events/events.jsonl");
    console.log(`skill mirrors: ${stats.mirroredSkills} sync operation(s) across ${stats.mirrorTargets} target(s)`);
    if (stats.registryRefreshed) {
      console.log("skill registry: .mdkg/skills/registry.md");
    }
  }
  console.log("next:");
  if (createStartupDocs) {
    console.log("  read .mdkg/AGENT_START.md");
  }
  console.log('  mdkg new task "..." --status todo --priority 1');
  console.log('  mdkg search "..."');
  console.log("  mdkg show <id>");
  console.log("  mdkg next");
  console.log("  mdkg pack <id>");
  console.log("  mdkg validate");
}

export function runInitCommand(options: InitCommandOptions): void {
  initialize(options, false);
}
