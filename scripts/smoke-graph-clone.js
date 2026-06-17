#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const packageRoot = path.resolve(__dirname, "..");
const NPM_CMD = process.env.NPM_CMD || "npm";
const GIT_CMD = process.env.GIT_CMD || "git";
const TEMP_BASE = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();

function npmEnv(npmCache) {
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || packageRoot,
    encoding: "utf8",
    env: { ...process.env, ...(options.env || {}) },
  });
  if (!options.allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
  return result;
}

function parseJson(output, label) {
  try {
    return JSON.parse(output);
  } catch (err) {
    throw new Error(`${label} did not emit JSON: ${err.message}\n${output}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function mdkg(binPath, args, cwd, options = {}) {
  return run(binPath, args, { cwd, allowFailure: options.allowFailure });
}

function installPackedCli(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  const npmCache = path.join(tempRoot, "npm-cache");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });
  fs.mkdirSync(path.join(prefix, "bin"), { recursive: true });
  fs.mkdirSync(path.join(prefix, "lib", "node_modules"), { recursive: true });
  const pack = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir], {
    env: npmEnv(npmCache),
  });
  const tarball = pack.stdout.trim().split(/\r?\n/).filter(Boolean).pop();
  assert(tarball, "npm pack did not return a tarball name");
  const tarballPath = path.join(packDir, tarball);
  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    env: npmEnv(npmCache),
  });
  return path.join(prefix, "bin", "mdkg");
}

function initGit(root) {
  run(GIT_CMD, ["init", "-q"], { cwd: root });
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    })
    .sort();
}

function hashTree(root) {
  const hash = crypto.createHash("sha256");
  for (const file of listFiles(root)) {
    hash.update(path.relative(root, file).split(path.sep).join("/"));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function createTemplateGraph(binPath, root) {
  fs.mkdirSync(root, { recursive: true });
  initGit(root);
  mdkg(binPath, ["init", "--agent"], root);
  mdkg(binPath, ["new", "goal", "template start goal", "--status", "todo", "--priority", "1", "--json"], root);
  mdkg(binPath, [
    "new",
    "task",
    "template linked task",
    "--status",
    "todo",
    "--priority",
    "1",
    "--parent",
    "goal-1",
    "--refs",
    "goal-1",
    "--json",
  ], root);
  fs.appendFileSync(
    path.join(root, ".mdkg", "work", "task-1-template-linked-task.md"),
    "\nMentions root:goal-1 and task-1 for rewrite proof.\n",
    "utf8"
  );
  mdkg(binPath, ["index"], root);
  const bundle = parseJson(
    mdkg(binPath, ["bundle", "create", "--output", path.join(root, "template.mdkg.zip"), "--json"], root).stdout,
    "bundle create"
  );
  return {
    root,
    bundlePath: path.join(root, "template.mdkg.zip"),
    bundleHash: bundle.bundle_hash,
    treeHash: hashTree(root),
  };
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(TEMP_BASE, "mdkg-graph-clone-smoke-"));
  const binPath = installPackedCli(tempRoot);
  const root = path.join(tempRoot, "repo");
  const template = path.join(root, "templates", "website-template-mdkg");
  fs.mkdirSync(root, { recursive: true });
  initGit(root);
  mdkg(binPath, ["init", "--agent"], root);
  const source = createTemplateGraph(binPath, template);

  const clone = parseJson(
    mdkg(binPath, ["graph", "clone", source.bundlePath, "--target", "clones/from-bundle", "--json"], root).stdout,
    "graph clone"
  );
  assert(clone.action === "graph.clone" && clone.ok === true, "graph clone did not succeed");
  assert(clone.preserved_ids === true, "graph clone did not preserve IDs");
  assert(clone.source_hash.bundle_hash === source.bundleHash, "graph clone source hash mismatch");
  mdkg(binPath, ["validate", "--json"], path.join(root, "clones", "from-bundle"));
  const clonedGoal = parseJson(mdkg(binPath, ["show", "goal-1", "--json"], path.join(root, "clones", "from-bundle")).stdout, "cloned goal");
  assert(clonedGoal.item.title === "template start goal", "cloned goal was not preserved");

  const fork = parseJson(
    mdkg(binPath, [
      "graph",
      "fork",
      "templates/website-template-mdkg",
      "--target",
      "forks/from-directory",
      "--start-goal",
      "goal-1",
      "--json",
    ], root).stdout,
    "graph fork"
  );
  assert(fork.action === "graph.fork" && fork.selected_goal.qid === "root:goal-1", "graph fork did not select start goal");
  const forkCurrent = parseJson(
    mdkg(binPath, ["goal", "current", "--json"], path.join(root, "forks", "from-directory")).stdout,
    "fork goal current"
  );
  assert(forkCurrent.goal.id === "goal-1", "fork current goal mismatch");

  mdkg(binPath, ["new", "goal", "local existing goal", "--status", "todo", "--priority", "1", "--json"], root);
  mdkg(binPath, ["new", "task", "local existing task", "--status", "todo", "--priority", "1", "--json"], root);
  const sourceHashBeforeImport = hashTree(template);
  const dryRun = parseJson(
    mdkg(binPath, [
      "graph",
      "import-template",
      "templates/website-template-mdkg",
      "--start-goal",
      "goal-1",
      "--select-goal",
      "--dry-run",
      "--json",
    ], root).stdout,
    "graph import-template dry-run"
  );
  assert(dryRun.mode === "import_template_dry_run", "import-template did not dry-run");
  assert(dryRun.files_written.length === 0, "import-template dry-run wrote files");
  assert(dryRun.selected_goal.qid === "root:goal-2" && dryRun.selected_goal.planned === true, "dry-run selected goal plan mismatch");
  const applied = parseJson(
    mdkg(binPath, [
      "graph",
      "import-template",
      "templates/website-template-mdkg",
      "--start-goal",
      "goal-1",
      "--select-goal",
      "--apply",
      "--json",
    ], root).stdout,
    "graph import-template apply"
  );
  assert(applied.mode === "import_template_applied", "import-template did not apply");
  assert(applied.validation.ok === true, "import-template apply did not validate");
  assert(applied.selected_goal.qid === "root:goal-2" && applied.selected_goal.planned === false, "applied selected goal mismatch");
  const importedTask = fs.readFileSync(path.join(root, ".mdkg", "work", "task-2-template-linked-task.md"), "utf8");
  assert(importedTask.includes("parent: goal-2"), "imported task parent was not rewritten");
  assert(importedTask.includes("root:goal-2 and task-2"), "imported task body was not rewritten");
  assert(hashTree(template) === sourceHashBeforeImport, "source template graph changed during import");

  mdkg(binPath, ["help", "graph"], root);
  mdkg(binPath, ["help", "graph", "import-template"], root);
  mdkg(binPath, ["validate", "--json"], root);
  mdkg(binPath, ["search", "template", "--json"], root);
  mdkg(binPath, ["pack", "goal-2", "--dry-run", "--stats"], root);
  console.log("graph clone smoke passed");
}

main();
