#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
const GIT_CMD = process.env.GIT || (process.platform === "win32" ? "git.exe" : "git");

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
    ...extra,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || repoRoot}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return result;
}

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
  const result = run(binPath, args, { cwd, allowFailure: options.allowFailure });
  return options.raw ? result : result.stdout.trim();
}

function git(args, cwd) {
  return run(GIT_CMD, ["-c", "user.name=mdkg smoke", "-c", "user.email=mdkg-smoke@example.invalid", ...args], { cwd });
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const pack = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = pack.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);

  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
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

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-branch-conflicts."));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
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

  console.log(
    JSON.stringify(
      {
        action: "smoke-branch-conflicts",
        ok: true,
        temp_root: tempRoot,
        tarball: tarballPath,
        plan_hash: first.plan_hash,
      },
      null,
      2
    )
  );
}

main();
