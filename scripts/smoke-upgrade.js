#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { preparePublishedBaseline, verifyBaseline } = require("./published-upgrade-baseline");
const { exerciseInstalledUpgradeRecovery } = require("./installed-upgrade-recovery");
const { createOwnedFixture, finalizeFixture } = require("./qualification-fixture");
const { createSmokeCommands } = require("./qualification-smoke");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
let commands;

function output(result) {
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`,
  };
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected path to exist: ${filePath}`);
  }
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing ${expected}`);
  }
}

function assertSpikeTemplate(root, label) {
  const templatePath = path.join(root, ".mdkg", "templates", "default", "spike.md");
  assertExists(templatePath);
  const content = fs.readFileSync(templatePath, "utf8");
  for (const expected of [
    "type: spike",
    "# Research Question",
    "# Search Plan",
    "# Follow-Up Nodes To Create",
    "# Skill Candidates",
    "# Evidence And Sources",
  ]) {
    assertIncludes(content, expected, `${label} spike template`);
  }
}

function assertManifestTemplate(root, label) {
  const templatePath = path.join(root, ".mdkg", "templates", "default", "manifest.md");
  assertExists(templatePath);
  const content = fs.readFileSync(templatePath, "utf8");
  for (const expected of [
    "type: manifest",
    "spec_kind: capability",
    "# Work Contracts",
  ]) {
    assertIncludes(content, expected, `${label} manifest template`);
  }
}

function initGit(root) {
  fs.mkdirSync(root, { recursive: true });
  commands.git(["init", "-q"], root);
}

function mdkg(binPath, args, cwd) {
  return output(commands.node(binPath, args, cwd));
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = commands.npm(["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir]).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  if (!tarballName) {
    throw new Error("unable to determine npm pack output tarball");
  }
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  const install = output(commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  }));
  assertIncludes(install.combined, `mdkg ${packageVersion} installed.`, "postinstall");

  const binPath = process.platform === "win32"
    ? path.join(prefix, "mdkg.cmd")
    : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function applyReviewedUpgrade(binPath, root) {
  const preview = parseJson(mdkg(binPath, ["upgrade", "--json"], root).stdout);
  if (!preview.safe_to_apply) throw new Error("refusing conflicting upgrade: " + JSON.stringify(preview.blocking_conflicts));
  return mdkg(binPath, ["upgrade", "--apply", "--plan-hash", preview.plan_hash, "--json"], root);
}

function parseJson(output) {
  return JSON.parse(output);
}

function assertSpecCount(binPath, root, expected, label) {
  const specs = parseJson(mdkg(binPath, ["spec", "list", "--json"], root).stdout);
  if (specs.count !== expected) {
    throw new Error(`${label} expected ${expected} SPEC records, got ${JSON.stringify(specs, null, 2)}`);
  }
}

function assertNoPendingUpgrade(binPath, root) {
  const receipt = parseJson(mdkg(binPath, ["upgrade", "--json"], root).stdout);
  if (!receipt.dry_run || receipt.will_write_paths.length !== 0 || !receipt.safe_to_apply) {
    throw new Error(`expected no pending upgrade changes, got ${JSON.stringify(receipt, null, 2)}`);
  }
}

function exerciseUpgrade(binPath, tempRoot) {
  const root = path.join(tempRoot, "legacy-style-workspace");
  initGit(root);
  mdkg(binPath, ["init", "--agent"], root);
  fs.rmSync(path.join(root, "AGENTS.md"), { force: true });
  fs.rmSync(path.join(root, "CLAUDE.md"), { force: true });
  fs.rmSync(path.join(root, ".mdkg", "init-manifest.json"), { force: true });

  const dryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], root).stdout);
  if (!dryRun.dry_run) {
    throw new Error("upgrade --dry-run did not report dry_run=true");
  }
  if (dryRun.safe_to_apply !== true) {
    throw new Error("upgrade dry-run did not report safe_to_apply=true for safe managed changes");
  }
  if (!dryRun.changes.some((change) => change.action === "create" && change.path === "AGENTS.md")) {
    throw new Error("upgrade dry-run did not plan missing AGENTS.md creation");
  }
  if (!dryRun.will_write_paths.includes(".mdkg/init-manifest.json")) {
    throw new Error("upgrade dry-run did not expose init manifest apply side effect");
  }

  const apply = parseJson(applyReviewedUpgrade(binPath, root).stdout);
  if (apply.dry_run) {
    throw new Error("upgrade --apply reported dry_run=true");
  }
  if (!apply.apply_side_effects.some((change) => change.category === "init_manifest")) {
    throw new Error("upgrade --apply did not report init manifest side effect");
  }
  assertExists(path.join(root, "AGENTS.md"));
  if (fs.existsSync(path.join(root, "CLAUDE.md"))) throw new Error("upgrade recreated retired fresh CLAUDE wrapper");
  assertExists(path.join(root, ".mdkg", "init-manifest.json"));
  mdkg(binPath, ["validate"], root);
  assertNoPendingUpgrade(binPath, root);

  const customRoot = path.join(tempRoot, "custom-workspace");
  initGit(customRoot);
  mdkg(binPath, ["init", "--agent"], customRoot);
  const customContent = "# Custom agent start\n";
  fs.writeFileSync(path.join(customRoot, "AGENT_START.md"), customContent, "utf8");
  const customReceipt = parseJson(applyReviewedUpgrade(binPath, customRoot).stdout);
  if (customReceipt.safe_to_apply !== true) {
    throw new Error("custom upgrade with preserved files should be safe to apply");
  }
  if (!customReceipt.changes.some((change) => change.action === "skip" && change.path === "AGENT_START.md")) {
    throw new Error("custom root AGENT_START.md was not reported as preserved");
  }
  if (!customReceipt.preserved_customizations.some((change) => change.path === "AGENT_START.md")) {
    throw new Error("custom AGENT_START.md was not reported as a preserved customization");
  }
  if (fs.readFileSync(path.join(customRoot, "AGENT_START.md"), "utf8") !== customContent) {
    throw new Error("custom AGENT_START.md was overwritten");
  }

  const oldTemplateRoot = path.join(tempRoot, "old-template-workspace");
  initGit(oldTemplateRoot);
  mdkg(binPath, ["init", "--graph-only"], oldTemplateRoot);
  mdkg(binPath, ["new", "task", "Old Template Workspace", "--status", "todo", "--priority", "1"], oldTemplateRoot);
  for (const name of ["manifest", "spec", "work", "work_order", "receipt", "feedback", "dispute", "proposal", "spike", "loop"]) {
    fs.rmSync(path.join(oldTemplateRoot, ".mdkg", "templates", "default", `${name}.md`), { force: true });
  }
  fs.rmSync(path.join(oldTemplateRoot, ".mdkg", "templates", "loops", "security-audit.loop.md"), { force: true });
  const doctor = mdkg(binPath, ["doctor"], oldTemplateRoot).stdout;
  assertIncludes(doctor, "warn: local-templates", "old-template doctor");
  const validate = mdkg(binPath, ["validate"], oldTemplateRoot).combined;
  assertIncludes(validate, "bundled template schema fallback", "old-template validate");
  mdkg(binPath, ["show", "task-1", "--meta"], oldTemplateRoot);
  assertSpecCount(binPath, oldTemplateRoot, 0, "old-template workspace");
  const oldTemplateDryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], oldTemplateRoot).stdout);
  for (const relativePath of [
    ".mdkg/templates/default/manifest.md",
    ".mdkg/templates/default/spec.md",
    ".mdkg/templates/default/spike.md",
    ".mdkg/templates/default/loop.md",
    ".mdkg/templates/loops/security-audit.loop.md",
    ".mdkg/templates/default/work.md",
    ".mdkg/templates/default/work_order.md",
    ".mdkg/templates/default/receipt.md",
  ]) {
    if (!oldTemplateDryRun.will_write_paths.includes(relativePath)) {
      throw new Error(`old-template upgrade did not plan to vendor missing template ${relativePath}`);
    }
  }
  const oldTemplateApply = parseJson(applyReviewedUpgrade(binPath, oldTemplateRoot).stdout);
  if (
    !oldTemplateApply.changes.some(
      (change) => change.action === "create" && change.path === ".mdkg/templates/default/spike.md"
    )
  ) {
    throw new Error("old-template upgrade did not write missing spike template");
  }
  if (
    !oldTemplateApply.changes.some(
      (change) => change.action === "create" && change.path === ".mdkg/templates/default/loop.md"
    )
  ) {
    throw new Error("old-template upgrade did not write missing loop template");
  }
  if (
    !oldTemplateApply.changes.some(
      (change) => change.action === "create" && change.path === ".mdkg/templates/loops/security-audit.loop.md"
    )
  ) {
    throw new Error("old-template upgrade did not write missing seeded security audit loop");
  }
  assertSpikeTemplate(oldTemplateRoot, "old-template upgrade");
  assertManifestTemplate(oldTemplateRoot, "old-template upgrade");
  mdkg(binPath, ["validate"], oldTemplateRoot);

  const legacySpecRoot = path.join(tempRoot, "legacy-spec-workspace");
  initGit(legacySpecRoot);
  mdkg(binPath, ["init", "--agent"], legacySpecRoot);
  const createdLegacyManifest = parseJson(
    mdkg(
      binPath,
      ["new", "manifest", "Legacy Upgrade Capability", "--id", "agent.legacy-upgrade", "--json"],
      legacySpecRoot
    ).stdout
  );
  const legacyManifestPath = path.join(legacySpecRoot, createdLegacyManifest.node.path);
  const legacySpecPath = path.join(path.dirname(legacyManifestPath), "SPEC.md");
  fs.renameSync(legacyManifestPath, legacySpecPath);
  fs.writeFileSync(
    legacySpecPath,
    fs.readFileSync(legacySpecPath, "utf8").replace(/^type: manifest$/m, "type: spec"),
    "utf8"
  );
  const legacySpecDryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], legacySpecRoot).stdout);
  const legacySpecMigration = legacySpecDryRun.changes.find(
    (change) => change.action === "migrate" && change.category === "manifest_migration"
  );
  if (!legacySpecMigration || legacySpecMigration.target_path !== createdLegacyManifest.node.path) {
    throw new Error(`legacy SPEC migration was not planned: ${JSON.stringify(legacySpecDryRun, null, 2)}`);
  }
  if (!legacySpecDryRun.will_write_paths.includes(createdLegacyManifest.node.path)) {
    throw new Error("legacy SPEC migration target missing from will_write_paths");
  }
  const legacySpecApply = parseJson(applyReviewedUpgrade(binPath, legacySpecRoot).stdout);
  if (
    !legacySpecApply.changes.some(
      (change) => change.action === "migrate" && change.category === "manifest_migration"
    )
  ) {
    throw new Error("legacy SPEC migration was not applied");
  }
  if (fs.existsSync(legacySpecPath)) {
    throw new Error("legacy SPEC.md still exists after upgrade apply");
  }
  assertExists(legacyManifestPath);
  assertIncludes(fs.readFileSync(legacyManifestPath, "utf8"), "type: manifest", "legacy SPEC migrated manifest");
  mdkg(binPath, ["manifest", "validate", "agent.legacy-upgrade", "--json"], legacySpecRoot);
  mdkg(binPath, ["validate", "--json"], legacySpecRoot);

  const siblingConflictRoot = path.join(tempRoot, "sibling-conflict-workspace");
  initGit(siblingConflictRoot);
  mdkg(binPath, ["init", "--agent"], siblingConflictRoot);
  const createdConflictManifest = parseJson(
    mdkg(
      binPath,
      ["new", "manifest", "Sibling Conflict Capability", "--id", "agent.sibling-conflict", "--json"],
      siblingConflictRoot
    ).stdout
  );
  const conflictManifestPath = path.join(siblingConflictRoot, createdConflictManifest.node.path);
  const conflictSpecPath = path.join(path.dirname(conflictManifestPath), "SPEC.md");
  fs.writeFileSync(
    conflictSpecPath,
    fs.readFileSync(conflictManifestPath, "utf8").replace(/^type: manifest$/m, "type: spec"),
    "utf8"
  );
  const conflictDryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], siblingConflictRoot).stdout);
  if (conflictDryRun.safe_to_apply !== false) {
    throw new Error("sibling MANIFEST/SPEC conflict should make upgrade unsafe to apply");
  }
  if (
    !conflictDryRun.blocking_conflicts.some(
      (change) => change.action === "conflict" && change.category === "manifest_migration"
    )
  ) {
    throw new Error("sibling MANIFEST/SPEC conflict did not appear in blocking_conflicts");
  }
  if (!fs.existsSync(conflictManifestPath) || !fs.existsSync(conflictSpecPath)) {
    throw new Error("sibling conflict dry-run should not remove either manifest file");
  }

  const customTemplateRoot = path.join(tempRoot, "custom-spike-template-workspace");
  initGit(customTemplateRoot);
  mdkg(binPath, ["init"], customTemplateRoot);
  const customSpikeTemplate = "---\nid: {{id}}\ntype: spike\n---\n# Custom Spike\n";
  const customSpikePath = path.join(customTemplateRoot, ".mdkg", "templates", "default", "spike.md");
  fs.writeFileSync(customSpikePath, customSpikeTemplate, "utf8");
  const customSpikeUpgrade = parseJson(mdkg(binPath, ["upgrade", "--json"], customTemplateRoot).stdout);
  if (customSpikeUpgrade.safe_to_apply) throw new Error("customized requested template must block application");
  if (!customSpikeUpgrade.changes.some((change) => change.action === "conflict" && change.path === ".mdkg/templates/default/spike.md")) {
    throw new Error("custom spike template was not reported as a conflict");
  }
  if (!customSpikeUpgrade.preserved_customizations.some((change) => change.path === ".mdkg/templates/default/spike.md")) {
    throw new Error("custom spike template was not reported as preserved");
  }
  if (fs.readFileSync(customSpikePath, "utf8") !== customSpikeTemplate) {
    throw new Error("custom spike template was overwritten");
  }
  mdkg(binPath, ["validate"], customTemplateRoot);

  const ignoredEventsRoot = path.join(tempRoot, "ignored-events-workspace");
  initGit(ignoredEventsRoot);
  mdkg(binPath, ["init", "--agent"], ignoredEventsRoot);
  fs.rmSync(path.join(ignoredEventsRoot, ".mdkg", "work", "events", "events.jsonl"), { force: true });
  fs.writeFileSync(path.join(ignoredEventsRoot, ".gitignore"), ".mdkg/work/events/\n", "utf8");
  const ignoredEventsDryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], ignoredEventsRoot).stdout);
  if (
    !ignoredEventsDryRun.changes.some(
      (change) => change.action === "skip" && change.path === ".mdkg/work/events/events.jsonl"
    )
  ) {
    throw new Error("ignored event log was not reported as skipped");
  }
  if (ignoredEventsDryRun.will_write_paths.includes(".mdkg/work/events/events.jsonl")) {
    throw new Error("ignored event log should not be in will_write_paths");
  }
}

async function exercisePublishedUpgrade(binPath, tempRoot, customizedSkills = false) {
  const baseline = await preparePublishedBaseline(tempRoot);
  const prefix = path.join(tempRoot, "published-prefix");
  commands.npm(["install", "-g", baseline.path, "--prefix", prefix, "--offline", "--no-audit", "--no-fund"], {
    cwd: tempRoot, env: { MDKG_SMOKE_BASELINE_TARBALL: baseline.path },
  });
  verifyBaseline(fs.readFileSync(baseline.path));
  const oldBin = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  if (mdkg(oldBin, ["--version"], tempRoot).stdout !== "0.5.2") throw new Error("published baseline version mismatch");
  const root = path.join(tempRoot, "actual-published-upgrade"); initGit(root);
  mdkg(oldBin, ["init", "--agent"], root);
  const task = parseJson(mdkg(oldBin, ["new", "task", "Published user task", "--json"], root).stdout).node;
  const historical = fs.readFileSync(path.join(root, task.path));
  const authored = "# User-owned project document\r\nPreserve these bytes.\r\n";
  for (const file of ["README.md", "LICENSE"]) fs.writeFileSync(path.join(root, file), authored);
  const customInstructions = "\n# User instructions\nDo not publish without approval.\n";
  const protectedInstructions = {};
  for (const file of ["AGENTS.md", "CLAUDE.md"]) {
    fs.appendFileSync(path.join(root, file), customInstructions);
    protectedInstructions[file] = fs.readFileSync(path.join(root, file), "utf8");
  }
  const customSkill = ".mdkg/skills/select-work-and-ground-context/SKILL.md";
  if (customizedSkills) fs.appendFileSync(path.join(root, customSkill), "\nUser-owned project grounding convention.\n");
  const skillBytes = fs.readFileSync(path.join(root, customSkill));
  const indexPath = path.join(root, ".git/index");
  commands.git(["add", "--", "README.md"], root);
  const staging = fs.readFileSync(indexPath);
  const digest = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
  const snapshot = () => {
    const files = {}; const walk = dir => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name); if (e.isDirectory()) walk(p); else files[path.relative(root, p)] = digest(p);
    } }; walk(root); return files;
  };
  const before = snapshot();
  let preview = parseJson(mdkg(binPath, ["upgrade", "--json"], root).stdout), selection = [];
  if (JSON.stringify(snapshot()) !== JSON.stringify(before)) throw new Error("published upgrade preview changed workspace bytes");
  if (customizedSkills) {
    if (preview.safe_to_apply || preview.blocking_conflicts.length !== 1 || preview.blocking_conflicts[0].path !== customSkill) throw new Error("custom canonical skill requires explicit preservation review");
    const blocked = commands.node(binPath, ["upgrade", "--apply", "--plan-hash", preview.plan_hash, "--json"], root, { allowFailure: true });
    if (blocked.status === 0 || JSON.stringify(snapshot()) !== JSON.stringify(before)) throw new Error("conflicting upgrade did not refuse without writes");
    // Explicit fixture decision: retain the custom skill, select every other
    // pending direct managed unit, and review its required native projections.
    const direct = preview.changes.filter(c => ["create", "update", "migrate"].includes(c.action) && !["init_manifest", "skill_mirror", "skill_registry"].includes(c.category));
    selection = ["--only", direct.map(c => c.path).join(",")];
    preview = parseJson(mdkg(binPath, ["upgrade", ...selection, "--json"], root).stdout);
    if (JSON.stringify(snapshot()) !== JSON.stringify(before)) throw new Error("selected upgrade preview changed bytes");
  }
  if (!preview.safe_to_apply) throw new Error("published upgrade requires explicit disposition: " + JSON.stringify(preview.blocking_conflicts));
  const applied = parseJson(mdkg(binPath, ["upgrade", ...selection, "--apply", "--plan-hash", preview.plan_hash, "--json"], root).stdout);
  for (const file of ["README.md", "LICENSE"]) if (fs.readFileSync(path.join(root, file), "utf8") !== authored) throw new Error("user project document changed: " + file);
  for (const file of Object.keys(protectedInstructions)) {
    if (!fs.readFileSync(path.join(root, file), "utf8").startsWith(protectedInstructions[file])) throw new Error("custom root instructions not preserved: " + file);
  }
  if (customizedSkills && !fs.readFileSync(path.join(root, customSkill)).equals(skillBytes)) throw new Error("custom canonical skill changed");
  for (const mirror of [".agents", ".claude"]) {
    if (!fs.readFileSync(path.join(root, mirror, "skills/select-work-and-ground-context/SKILL.md")).equals(fs.readFileSync(path.join(root, customSkill)))) throw new Error("native mirror differs from canonical skill");
  }
  for (const file of [".mdkg/AGENT_START.md", ".mdkg/CLI_COMMAND_MATRIX.md", ".mdkg/llms.txt"]) assertExists(path.join(root, file));
  if (!fs.readFileSync(path.join(root, task.path)).equals(historical)) throw new Error("published user task was rewritten during scaffold upgrade");
  if (!fs.readFileSync(indexPath).equals(staging)) throw new Error("upgrade changed Git staging");
  mdkg(binPath, ["validate", "--json"], root);
  const repeatBefore = snapshot(), repeat = parseJson(mdkg(binPath, ["upgrade", "--json"], root).stdout);
  if (repeat.will_write_paths.length) throw new Error("published upgrade has unexpected pending writes: " + JSON.stringify(repeat));
  if (customizedSkills ? (repeat.safe_to_apply || repeat.blocking_conflicts.length !== 1 || repeat.blocking_conflicts[0].path !== customSkill) : !repeat.safe_to_apply) throw new Error("repeated upgrade lost preservation disposition");
  if (JSON.stringify(snapshot()) !== JSON.stringify(repeatBefore)) throw new Error("repeated preview changed bytes");
  if (!customizedSkills) mdkg(binPath, ["upgrade", "--apply", "--plan-hash", repeat.plan_hash, "--json"], root);
  if (JSON.stringify(snapshot()) !== JSON.stringify(repeatBefore)) throw new Error("repeated no-op apply changed bytes");
  return { baseline, task: task.id, applied_paths: applied.will_write_paths, user_bytes_preserved: true,
    customized_both_entrypoints: true, canonical_skill_mirrors_equal: true,
    custom_skill_preservation_decision: customizedSkills ? "explicit --only excluding custom canonical skill; conflict retained" : "not applicable",
    git_index_unchanged: true, repeated_preview_noop: true, repeated_apply_noop: !customizedSkills };
}

function createUpgradeFixture(env = process.env) {
  // Let the shared helper canonicalize its internal OS default. An explicit
  // operator override remains subject to physical-path admission, not rewriting.
  return createOwnedFixture({ base: env.MDKG_SMOKE_TMPDIR || undefined, prefix: "mdkg-upgrade-smoke-" });
}

async function runSmoke() {
  let tempRoot;
  let fixture;
  let primaryFailure;
  try {
    fixture = createUpgradeFixture();
    tempRoot = fixture.root;
    commands = createSmokeCommands(fixture);
    const binPath = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseUpgrade(binPath, tempRoot);
    console.log(JSON.stringify({ action: "current-upgrade-qualified", runtime: process.version,
      cases: ["missing-managed-files", "custom-root-guidance", "old-template-fallback", "legacy-spec-migration",
        "manifest-spec-sibling-conflict", "custom-spike-template", "ignored-event-log"], final_acceptance: false }));
    const published = await exercisePublishedUpgrade(binPath, tempRoot);
    console.log(JSON.stringify({ action: "published-upgrade-qualified", runtime: process.version, ...published }));
    const customRoot = path.join(tempRoot, "customized-published"); fs.mkdirSync(customRoot);
    const customized = await exercisePublishedUpgrade(binPath, customRoot, true);
    console.log(JSON.stringify({ action: "published-customized-upgrade-qualified", runtime: process.version, ...customized }));
    const oldBin = process.platform === "win32" ? path.join(tempRoot, "published-prefix/mdkg.cmd") : path.join(tempRoot, "published-prefix/bin/mdkg");
    const recovery = exerciseInstalledUpgradeRecovery(binPath, oldBin, tempRoot, commands.environment);
    console.log(JSON.stringify({ action: "installed-upgrade-recovery-qualified", ...recovery }));
    console.log(`version=${version}`);
  } catch (error) {
    primaryFailure = error;
  }
  if (fixture && process.env.MDKG_KEEP_SMOKE_TMP !== "1") finalizeFixture(fixture, { error: primaryFailure });
  else if (primaryFailure) throw primaryFailure;
  console.log("upgrade smoke passed");
}

if (require.main === module) runSmoke().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { createUpgradeFixture };
