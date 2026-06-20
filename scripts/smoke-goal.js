#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || "npm";
const GIT_CMD = process.env.GIT || "git";

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
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
    );
  }
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`,
  };
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing ${expected}`);
  }
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected path to exist: ${filePath}`);
  }
}

function parseJson(output) {
  return JSON.parse(output);
}

function replaceInFile(filePath, from, to) {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(from)) {
    throw new Error(`expected ${filePath} to contain ${from}`);
  }
  fs.writeFileSync(filePath, content.replace(from, to));
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir], {
    cwd: repoRoot,
  }).stdout;
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

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assertIncludes(install.combined, `mdkg ${packageVersion} installed.`, "postinstall");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-goal-smoke-"));
  const binPath = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  const goal = parseJson(mdkg(binPath, ["new", "goal", "Ship Goal Smoke", "--json"], root).stdout).node;
  if (goal.id !== "goal-1" || goal.type !== "goal") {
    throw new Error(`unexpected goal receipt: ${JSON.stringify(goal)}`);
  }
  assertExists(path.join(root, goal.path));
  const epicA = parseJson(mdkg(binPath, ["new", "epic", "Goal Epic A", "--status", "todo", "--priority", "3", "--json"], root).stdout).node;
  const epicB = parseJson(mdkg(binPath, ["new", "epic", "Goal Epic B", "--status", "todo", "--priority", "4", "--json"], root).stdout).node;
  const feature = parseJson(
    mdkg(binPath, ["new", "feat", "Scoped Feature", "--status", "todo", "--priority", "5", "--epic", epicA.id, "--json"], root).stdout
  ).node;
  const task = parseJson(
    mdkg(binPath, ["new", "task", "Complete Goal Smoke", "--status", "todo", "--priority", "1", "--parent", feature.id, "--json"], root).stdout
  ).node;
  const testNode = parseJson(
    mdkg(binPath, ["new", "test", "Verify Goal Smoke", "--status", "todo", "--priority", "2", "--epic", epicB.id, "--json"], root).stdout
  ).node;
  const unrelated = parseJson(
    mdkg(binPath, ["new", "task", "Unrelated Urgent", "--status", "todo", "--priority", "0", "--json"], root).stdout
  ).node;
  replaceInFile(path.join(root, goal.path), "scope_refs: []", `scope_refs: [${epicA.id}, ${epicB.id}]`);

  mdkg(binPath, ["validate"], root);
  mdkg(binPath, ["index"], root);
  assertIncludes(mdkg(binPath, ["list", "--type", "goal", "--json"], root).stdout, "goal-1", "goal list");
  assertIncludes(mdkg(binPath, ["search", "Ship Goal Smoke"], root).stdout, "goal-1", "goal search");
  assertIncludes(mdkg(binPath, ["show", goal.id, "--json"], root).stdout, "goal_state", "goal show");
  mdkg(binPath, ["pack", goal.id, "--dry-run", "--stats"], root);

  const goalShow = parseJson(mdkg(binPath, ["goal", "show", goal.id, "--json"], root).stdout);
  if (goalShow.goal.goal_state !== "active") {
    throw new Error(`unexpected goal state: ${goalShow.goal.goal_state}`);
  }
  if (goalShow.goal.scope_refs.length !== 2) {
    throw new Error(`goal scope refs missing: ${JSON.stringify(goalShow.goal.scope_refs)}`);
  }
  const evaluated = parseJson(mdkg(binPath, ["goal", "evaluate", goal.id, "--json"], root).stdout);
  if (!evaluated.report_only || evaluated.runs_scripts) {
    throw new Error(`goal evaluate should be report-only: ${JSON.stringify(evaluated)}`);
  }
  mdkg(binPath, ["goal", "select", goal.id], root);
  const current = parseJson(mdkg(binPath, ["goal", "current", "--json"], root).stdout);
  if (current.goal.qid !== goal.qid || current.source !== "selected") {
    throw new Error(`goal current did not use selected goal: ${JSON.stringify(current)}`);
  }
  const globalNext = mdkg(binPath, ["next", "--json"], root).stdout;
  if (!globalNext.includes(unrelated.id)) {
    throw new Error(`mdkg next should ignore goal scope and choose unrelated urgent work: ${globalNext}`);
  }
  const next = parseJson(mdkg(binPath, ["goal", "next", "--json"], root).stdout);
  if (next.node.id !== task.id || next.node.type !== "task") {
    throw new Error(`goal next selected wrong node: ${JSON.stringify(next)}`);
  }
  const claimed = parseJson(mdkg(binPath, ["goal", "claim", task.id, "--json"], root).stdout);
  if (claimed.goal.active_node !== task.id) {
    throw new Error(`goal claim did not set active_node: ${JSON.stringify(claimed)}`);
  }
  mdkg(binPath, ["task", "done", task.id, "--json"], root);
  const nextAfterDone = parseJson(mdkg(binPath, ["goal", "next", "--json"], root).stdout);
  if (nextAfterDone.node.id !== testNode.id || nextAfterDone.node.type !== "test") {
    throw new Error(`goal next after task done selected wrong node: ${JSON.stringify(nextAfterDone)}`);
  }
  mdkg(binPath, ["goal", "clear"], root);

  const paused = parseJson(mdkg(binPath, ["goal", "pause", goal.id, "--json"], root).stdout);
  if (paused.goal.goal_state !== "paused") {
    throw new Error("goal pause did not pause");
  }
  const resumed = parseJson(mdkg(binPath, ["goal", "resume", goal.id, "--json"], root).stdout);
  if (resumed.goal.goal_state !== "active") {
    throw new Error("goal resume did not resume");
  }
  const done = parseJson(mdkg(binPath, ["goal", "done", goal.id, "--json"], root).stdout);
  if (done.goal.goal_state !== "achieved" || done.goal.status !== "done") {
    throw new Error("goal done did not close goal");
  }
  if (Object.prototype.hasOwnProperty.call(done.goal, "active_node")) {
    throw new Error(`goal done should remove active_node: ${JSON.stringify(done)}`);
  }
  if (done.goal.last_active_node !== task.id) {
    throw new Error(`goal done did not preserve last_active_node: ${JSON.stringify(done)}`);
  }
  const nextAfterGoalDone = parseJson(mdkg(binPath, ["goal", "next", goal.id, "--json"], root).stdout);
  if (nextAfterGoalDone.node !== null) {
    throw new Error(`achieved goal should not route next work: ${JSON.stringify(nextAfterGoalDone)}`);
  }
  if (nextAfterGoalDone.warnings.some((warning) => warning.includes("active_node"))) {
    throw new Error(`achieved goal next should not warn about active_node: ${JSON.stringify(nextAfterGoalDone)}`);
  }
  const doneShow = parseJson(mdkg(binPath, ["goal", "show", goal.id, "--json"], root).stdout);
  if (doneShow.goal.last_active_node !== task.id) {
    throw new Error(`goal show missing last_active_node: ${JSON.stringify(doneShow)}`);
  }

  mdkg(binPath, ["validate"], root);
  console.log("smoke:goal ok");
}

main();
