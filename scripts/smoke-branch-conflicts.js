#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { createOwnedFixture, finalizeFixture } = require("./qualification-fixture");
const { createSmokeCommands } = require("./qualification-smoke");
const { exerciseIdentityCollaboration } = require("./installed-identity-collaboration");
const { exerciseInstalledGraphRecovery } = require("./installed-graph-recovery");

const repoRoot = path.resolve(__dirname, "..");
let commands;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(output) {
  return JSON.parse(output);
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function mdkg(binPath, args, cwd, options = {}) {
  const result = commands.node(binPath, args, cwd, { allowFailure: options.allowFailure });
  return options.raw ? result : result.stdout.trim();
}

function git(args, cwd) {
  return commands.git(args, cwd);
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const pack = commands.npm(["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = pack.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);

  commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return { binPath, tarballPath };
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function taskDoc(id, title) {
  return [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${title}`,
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-06-09",
    "updated: 2026-06-09",
    "---",
    "",
    "# Overview",
    "",
    title,
    "",
    "# Acceptance Criteria",
    "",
    "# Files Affected",
    "",
    "# Implementation Notes",
    "",
    "# Test Plan",
    "",
    "# Links / Artifacts",
  ].join("\n");
}

function fileSnapshot(root) {
  const entries = {};
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git") {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (entry.isFile()) {
        const relativePath = path.relative(root, fullPath).split(path.sep).join("/");
        entries[relativePath] = crypto.createHash("sha256").update(fs.readFileSync(fullPath)).digest("hex");
      }
    }
  };
  walk(root);
  return entries;
}

function assertNoMutation(root, before, label) {
  const after = fileSnapshot(root);
  assert(JSON.stringify(after) === JSON.stringify(before), `${label} mutated files`);
}

function exerciseBranchConflicts(binPath, tempRoot) {
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(["init", "-q"], root);
  mdkg(binPath, ["init", "--agent"], root);
  mdkg(binPath, ["index"], root);
  git(["add", "."], root);
  git(["commit", "-m", "base mdkg init"], root);
  const base = git(["rev-parse", "HEAD"], root).stdout.trim();

  git(["checkout", "-q", "-b", "branch-a"], root);
  writeFile(path.join(root, ".mdkg", "work", "task-900-branch-a.md"), taskDoc("task-900", "branch A duplicate"));
  git(["add", ".mdkg/work/task-900-branch-a.md"], root);
  git(["commit", "-m", "branch a duplicate id"], root);

  git(["checkout", "-q", "-b", "branch-b", base], root);
  writeFile(path.join(root, ".mdkg", "work", "task-900-branch-b.md"), taskDoc("task-900", "branch B duplicate"));
  git(["add", ".mdkg/work/task-900-branch-b.md"], root);
  git(["commit", "-m", "branch b duplicate id"], root);

  git(["checkout", "-q", "branch-a"], root);
  git(["merge", "--no-edit", "branch-b"], root);

  const before = fileSnapshot(root);
  const validation = mdkg(binPath, ["validate", "--json"], root, { allowFailure: true, raw: true });
  assert(validation.status !== 0, "validate should fail on duplicate id merge state");
  const validationReceipt = parseJson(validation.stdout);
  assert(validationReceipt.ok === false, "validate receipt should be failing");
  assert(
    validationReceipt.errors.some((error) =>
      error.includes(".mdkg/work/task-900-branch-b.md: duplicate id task-900 in workspace root")
    ),
    "validate did not report stable duplicate-id path diagnostics"
  );
  assertNoMutation(root, before, "validate duplicate-id check");

  const first = parseJson(mdkg(binPath, ["fix", "plan", "--family", "ids", "--json"], root));
  const second = parseJson(mdkg(binPath, ["fix", "plan", "--family", "ids", "--json"], root));
  assert(first.plan_hash === second.plan_hash, "fix plan hash should be stable");
  assert(first.plan_id === second.plan_id, "fix plan id should be stable");
  assert(first.summary.apply_supported === true, "duplicate-id fix plan should be apply-capable");
  assert(first.proposed_changes.length === 1, "expected one duplicate-id repair proposal");
  const change = first.proposed_changes[0];
  assert(change.reason === "duplicate_id", "expected duplicate_id proposal");
  assert(change.after.candidate_id === "task-901", "unexpected candidate id");
  assert(change.evidence.branch_merge_suspected === true, "missing branch merge evidence");
  assert(change.after.reference_rewrite_plan.length >= 2, "missing reference rewrite path counts");
  assertNoMutation(root, before, "fix plan duplicate-id branch conflict check");

  const identity = exerciseIdentityCollaboration(binPath, tempRoot);
  const recovery = exerciseInstalledGraphRecovery(binPath, tempRoot, commands.environment);

  return {
    action: "smoke-branch-conflicts",
    ok: true,
    temp_root: tempRoot,
    plan_hash: first.plan_hash,
    identity,
    recovery,
  };
}

function createBranchFixture(env = process.env) {
  return createOwnedFixture({ base: env.MDKG_SMOKE_TMPDIR || undefined, prefix: "mdkg-branch-conflicts-" });
}

function main() {
  const fixture = createBranchFixture();
  let primaryFailure, receipt;
  try {
    commands = createSmokeCommands(fixture);
    const { binPath, tarballPath } = packAndInstall(fixture.root);
    const before = crypto.createHash("sha256").update(fs.readFileSync(tarballPath)).digest("hex");
    receipt = exerciseBranchConflicts(binPath, fixture.root);
    assert(crypto.createHash("sha256").update(fs.readFileSync(tarballPath)).digest("hex") === before, "smoke tarball changed during qualification");
    receipt.tarball_sha256 = before;
  } catch (error) { primaryFailure = error; }
  const cleanup = finalizeFixture(fixture, { error: primaryFailure });
  console.log(JSON.stringify({ ...receipt, cleanup }, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
module.exports = { createBranchFixture };
