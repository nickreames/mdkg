#!/usr/bin/env node

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

function git(args, cwd, options = {}) {
  return run(
    GIT_CMD,
    ["-c", "user.name=mdkg smoke", "-c", "user.email=mdkg-smoke@example.invalid", ...args],
    { cwd, allowFailure: options.allowFailure }
  );
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

function taskDoc(id, title, options = {}) {
  return [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${title}`,
    ...(options.epic ? [`epic: ${options.epic}`] : []),
    ...(options.parent ? [`parent: ${options.parent}`] : []),
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    `relates: ${options.relates || "[]"}`,
    `blocked_by: ${options.blockedBy || "[]"}`,
    `blocks: ${options.blocks || "[]"}`,
    `refs: ${options.refs || "[]"}`,
    "aliases: []",
    "created: 2026-06-09",
    "updated: 2026-06-09",
    "---",
    "",
    "# Overview",
    "",
    options.body || title,
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

function validateFailsOnDuplicate(binPath, root, id) {
  const validation = mdkg(binPath, ["validate", "--json"], root, { allowFailure: true, raw: true });
  assert(validation.status !== 0, `validate should fail for duplicate ${id}`);
  const receipt = parseJson(validation.stdout);
  assert(receipt.ok === false, "validation receipt should fail");
  assert(receipt.errors.some((error) => error.includes(`duplicate id ${id}`)), `validation did not report duplicate ${id}`);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-id-repair."));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(["init", "-q"], root);
  git(["branch", "-m", "main"], root);

  mdkg(binPath, ["init", "--agent"], root);
  mdkg(binPath, ["index"], root);
  writeFile(path.join(root, ".mdkg", "work", "task-700-main.md"), taskDoc("task-700", "main branch task"));
  writeFile(
    path.join(root, ".mdkg", "work", "task-710-main-ref.md"),
    taskDoc("task-710", "mainline reference to task 700", { blockedBy: "[task-700]" })
  );
  mdkg(binPath, ["index"], root);
  git(["add", "."], root);
  git(["commit", "-m", "base graph"], root);
  git(["branch", "base-mdkg"], root);

  writeFile(path.join(root, ".mdkg", "work", "task-700-incoming.md"), taskDoc("task-700", "incoming duplicate task"));
  writeFile(
    path.join(root, ".mdkg", "work", "task-702-incoming-ref.md"),
    taskDoc("task-702", "incoming reference to duplicate task", {
      epic: "task-700",
      parent: "task-700",
      relates: "[task-700]",
      blockedBy: "[task-700]",
      blocks: "[task-700]",
      refs: "[task-700]",
      body: "Incoming branch body mentions task-700.",
    })
  );
  validateFailsOnDuplicate(binPath, root, "task-700");
  const cleanPlan = parseJson(mdkg(binPath, ["fix", "ids", "--base-ref", "base-mdkg", "--target", "task-700", "--json"], root));
  assert(cleanPlan.summary.apply_supported === true, "clean duplicate plan should be apply-capable");
  assert(cleanPlan.proposed_changes[0].before.canonical_path === ".mdkg/work/task-700-main.md", "base ref did not preserve main path");
  assert(cleanPlan.proposed_changes[0].after.candidate_id === "task-701", "unexpected clean duplicate candidate");
  assert(
    cleanPlan.proposed_changes[0].after.safe_reference_rewrites.some((item) => item.path === ".mdkg/work/task-702-incoming-ref.md"),
    "incoming reference should be safe to rewrite"
  );
  const cleanApply = parseJson(mdkg(binPath, ["fix", "ids", "--base-ref", "base-mdkg", "--target", "task-700", "--apply", "--json"], root));
  assert(cleanApply.action === "fix.apply", "clean apply action mismatch");
  assert(cleanApply.touched_paths.includes(".mdkg/work/task-700-incoming.md"), "clean apply did not touch duplicate file");
  assert(cleanApply.touched_paths.includes(".mdkg/work/task-702-incoming-ref.md"), "clean apply did not touch incoming reference file");
  assert(fs.readFileSync(path.join(root, ".mdkg", "work", "task-700-incoming.md"), "utf8").includes("id: task-701"), "clean apply did not rewrite duplicate id");
  const incomingRef = fs.readFileSync(path.join(root, ".mdkg", "work", "task-702-incoming-ref.md"), "utf8");
  for (const expected of [
    "epic: task-701",
    "parent: task-701",
    "relates: [task-701]",
    "blocked_by: [task-701]",
    "blocks: [task-701]",
    "refs: [task-701]",
    "Incoming branch body mentions task-701.",
  ]) {
    assert(incomingRef.includes(expected), `clean apply did not rewrite incoming reference: ${expected}`);
  }
  assert(
    fs.readFileSync(path.join(root, ".mdkg", "work", "task-710-main-ref.md"), "utf8").includes("blocked_by: [task-700]"),
    "clean apply rewrote mainline reference unexpectedly"
  );
  assert(parseJson(mdkg(binPath, ["validate", "--json"], root)).ok === true, "clean repair validate failed");

  git(["add", "."], root);
  git(["commit", "-m", "clean duplicate repaired"], root);
  const base = git(["rev-parse", "HEAD"], root).stdout.trim();

  const conflictPath = path.join(root, ".mdkg", "work", "task-900.md");
  git(["checkout", "-q", "-b", "branch-a"], root);
  writeFile(conflictPath, taskDoc("task-900", "branch A same path task"));
  git(["add", ".mdkg/work/task-900.md"], root);
  git(["commit", "-m", "branch a task"], root);

  git(["checkout", "-q", "-b", "branch-b", base], root);
  writeFile(conflictPath, taskDoc("task-900", "branch B same path task"));
  git(["add", ".mdkg/work/task-900.md"], root);
  git(["commit", "-m", "branch b task"], root);

  git(["checkout", "-q", "branch-a"], root);
  const merge = git(["merge", "--no-edit", "branch-b"], root, { allowFailure: true });
  assert(merge.status !== 0, "merge should create an unresolved add/add conflict");
  assert(git(["ls-files", "-u", "--", ".mdkg/work/task-900.md"], root).stdout.includes(".mdkg/work/task-900.md"), "missing unresolved conflict stages");

  const stagePlan = parseJson(mdkg(binPath, ["fix", "ids", "--target", "task-900", "--json"], root));
  assert(stagePlan.summary.apply_supported === true, "stage conflict plan should be apply-capable");
  assert(stagePlan.proposed_changes[0].reason === "git_stage_duplicate_id", "expected git-stage duplicate finding");
  assert(stagePlan.proposed_changes[0].after.candidate_id === "task-901", "unexpected stage duplicate candidate");
  const stageApply = parseJson(mdkg(binPath, ["fix", "ids", "--target", "task-900", "--apply", "--json"], root));
  assert(stageApply.touched_paths.includes(".mdkg/work/task-900.md"), "stage apply missing canonical path");
  assert(stageApply.touched_paths.includes(".mdkg/work/task-901.md"), "stage apply missing incoming split path");
  assert(git(["ls-files", "-u", "--", ".mdkg/work/task-900.md"], root).stdout.trim() === "", "stage apply did not clear git conflict stages");
  assert(fs.readFileSync(path.join(root, ".mdkg", "work", "task-900.md"), "utf8").includes("branch A same path task"), "stage 2 canonical content was not preserved");
  assert(fs.readFileSync(path.join(root, ".mdkg", "work", "task-901.md"), "utf8").includes("id: task-901"), "stage 3 content was not rewritten");
  assert(parseJson(mdkg(binPath, ["validate", "--json"], root)).ok === true, "stage repair validate failed");

  console.log(
    JSON.stringify(
      {
        action: "smoke-id-repair",
        ok: true,
        temp_root: tempRoot,
        tarball: tarballPath,
        clean_plan_hash: cleanPlan.plan_hash,
        stage_plan_hash: stagePlan.plan_hash,
      },
      null,
      2
    )
  );
}

main();
