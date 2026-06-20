#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
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
  if (result.status !== 0) {
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
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}` };
}

function runFailure(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status === 0) {
    throw new Error(`command unexpectedly succeeded: ${command} ${args.join(" ")}`);
  }
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function parseJson(output) {
  return JSON.parse(output);
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
  assert(tarballName, "unable to determine npm pack output tarball");
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assert(install.combined.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing package version");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function mdkgFailure(binPath, args, cwd) {
  return runFailure(binPath, args, { cwd });
}

function git(cwd, args) {
  return run(GIT_CMD, args, { cwd });
}

function replaceInFile(filePath, from, to) {
  const content = fs.readFileSync(filePath, "utf8");
  assert(content.includes(from), `expected ${filePath} to contain ${from}`);
  fs.writeFileSync(filePath, content.replace(from, to));
}

function createChildGraph(binPath, root) {
  const child = path.join(root, "projects", "child_graph");
  fs.mkdirSync(child, { recursive: true });
  git(child, ["init", "-q"]);
  git(child, ["config", "user.email", "mdkg@example.test"]);
  git(child, ["config", "user.name", "mdkg smoke"]);
  mdkg(binPath, ["init", "--agent"], child);
  const childGoal = parseJson(
    mdkg(binPath, ["new", "goal", "Child Active Goal", "--status", "progress", "--priority", "1", "--json"], child).stdout
  ).node;
  const childTask = parseJson(
    mdkg(binPath, ["new", "task", "Child Scoped Task", "--status", "todo", "--priority", "1", "--json"], child).stdout
  ).node;
  replaceInFile(path.join(child, childGoal.path), "scope_refs: []", `scope_refs: [${childTask.id}]`);
  mdkg(binPath, ["index"], child);
  const childValidate = parseJson(mdkg(binPath, ["validate", "--json"], child).stdout);
  assert(childValidate.ok === true, "child graph did not validate");
  git(child, ["add", "."]);
  git(child, ["commit", "-m", "initial child graph"]);

  const bundlePath = ".mdkg/bundles/private/subgraphs/child_graph.mdkg.zip";
  const bundleAbs = path.join(root, bundlePath);
  mdkg(binPath, ["bundle", "create", "--profile", "private", "--output", bundleAbs, "--json"], child);
  return { child, childGoal, bundlePath };
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-goal-lifecycle-smoke-"));
  const binPath = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);

  mdkg(binPath, ["init", "--agent"], root);
  const goalA = parseJson(
    mdkg(binPath, ["new", "goal", "Primary Active Goal", "--status", "progress", "--priority", "1", "--json"], root).stdout
  ).node;
  const goalB = parseJson(
    mdkg(binPath, ["new", "goal", "Replacement Goal", "--status", "todo", "--priority", "2", "--json"], root).stdout
  ).node;
  const scopedTask = parseJson(
    mdkg(binPath, ["new", "task", "Replacement Scoped Task", "--status", "todo", "--priority", "1", "--json"], root).stdout
  ).node;
  replaceInFile(path.join(root, goalB.path), "scope_refs: []", `scope_refs: [${scopedTask.id}]`);
  mdkg(binPath, ["index"], root);

  const currentBefore = parseJson(mdkg(binPath, ["goal", "current", "--json"], root).stdout);
  assert(currentBefore.goal.id === goalA.id, "unique active goal did not resolve before activation");
  const activated = parseJson(mdkg(binPath, ["goal", "activate", goalB.id, "--json"], root).stdout);
  assert(activated.goal.id === goalB.id, "goal activate did not activate replacement goal");
  assert(activated.goal.status === "progress" && activated.goal.goal_state === "active", "activated goal state mismatch");
  assert(activated.paused_goals.some((goal) => goal.id === goalA.id), "goal activate did not pause prior active goal");

  const currentAfter = parseJson(mdkg(binPath, ["goal", "current", "--json"], root).stdout);
  assert(currentAfter.goal.id === goalB.id && currentAfter.source === "selected", "goal current did not select activated goal");
  const goalANow = parseJson(mdkg(binPath, ["goal", "show", goalA.id, "--json"], root).stdout).goal;
  assert(goalANow.status === "blocked" && goalANow.goal_state === "paused", "prior active goal was not paused");
  const next = parseJson(mdkg(binPath, ["goal", "next", goalB.id, "--json"], root).stdout);
  assert(next.node.id === scopedTask.id, "goal next did not route to scoped task");

  const archived = parseJson(mdkg(binPath, ["goal", "archive", goalA.id, "--json"], root).stdout);
  assert(archived.goal.status === "archived" && archived.goal.goal_state === "archived", "goal archive did not archive goal");
  assert(!Object.prototype.hasOwnProperty.call(archived.goal, "active_node"), "archived goal should not retain active_node");
  const archivedList = parseJson(mdkg(binPath, ["list", "--type", "goal", "--status", "archived", "--json"], root).stdout);
  assert(archivedList.items.some((item) => item.id === goalA.id), "archived goal not found by list filter");
  const archivedSearch = parseJson(
    mdkg(binPath, ["search", "Primary Active", "--type", "goal", "--status", "archived", "--json"], root).stdout
  );
  assert(archivedSearch.items.some((item) => item.id === goalA.id), "archived goal not found by search filter");
  const archivedNext = parseJson(mdkg(binPath, ["goal", "next", goalA.id, "--json"], root).stdout);
  assert(archivedNext.node === null, "archived goal unexpectedly returned actionable next work");
  assert(archivedNext.warnings.some((warning) => warning.includes("archived")), "archived next warning missing");
  assert(mdkgFailure(binPath, ["goal", "activate", goalA.id, "--json"], root).stderr.includes("cannot activate archived goal"), "archived goal activate did not fail");
  assert(mdkgFailure(binPath, ["goal", "select", goalA.id, "--json"], root).stderr.includes("cannot select archived goal"), "archived goal select did not fail");

  const closeGoal = parseJson(
    mdkg(binPath, ["new", "goal", "Closeout Goal", "--status", "todo", "--priority", "1", "--json"], root).stdout
  ).node;
  const closeTask = parseJson(
    mdkg(binPath, ["new", "task", "Closeout Scoped Task", "--status", "todo", "--priority", "1", "--json"], root).stdout
  ).node;
  replaceInFile(path.join(root, closeGoal.path), "scope_refs: []", `scope_refs: [${closeTask.id}]`);
  mdkg(binPath, ["goal", "activate", closeGoal.id, "--json"], root);
  mdkg(binPath, ["goal", "claim", closeGoal.id, closeTask.id, "--json"], root);
  const closed = parseJson(mdkg(binPath, ["goal", "done", closeGoal.id, "--json"], root).stdout);
  assert(closed.goal.status === "done" && closed.goal.goal_state === "achieved", "goal done did not mark goal achieved");
  assert(!Object.prototype.hasOwnProperty.call(closed.goal, "active_node"), "done goal should not retain active_node");
  assert(closed.goal.last_active_node === closeTask.id, "goal done did not preserve last_active_node");
  const closedNext = parseJson(mdkg(binPath, ["goal", "next", closeGoal.id, "--json"], root).stdout);
  assert(closedNext.node === null, "achieved goal unexpectedly returned actionable work");
  assert(!closedNext.warnings.some((warning) => warning.includes("active_node")), "achieved goal next emitted stale active_node warning");
  mdkg(binPath, ["goal", "activate", goalB.id, "--json"], root);

  const child = createChildGraph(binPath, root);
  const added = parseJson(
    mdkg(
      binPath,
      [
        "subgraph",
        "add",
        "child_graph",
        child.bundlePath,
        "--source-path",
        "projects/child_graph",
        "--json",
      ],
      root
    ).stdout
  );
  assert(added.subgraph.alias === "child_graph", "subgraph add did not return child_graph");
  mdkg(binPath, ["index"], root);
  const validate = parseJson(mdkg(binPath, ["validate", "--json"], root).stdout);
  assert(validate.ok === true, "root graph with imported active subgraph goal did not validate");
  const allGoals = parseJson(mdkg(binPath, ["list", "--ws", "all", "--type", "goal", "--json"], root).stdout);
  assert(allGoals.items.some((item) => item.qid === "child_graph:goal-1" && item.attributes.goal_state === "active"), "imported child active goal not visible");
  const currentWithSubgraph = parseJson(mdkg(binPath, ["goal", "current", "--json"], root).stdout);
  assert(currentWithSubgraph.goal.id === goalB.id, "imported active goal affected root current goal");
  const doctor = parseJson(mdkg(binPath, ["doctor", "--strict", "--json"], root).stdout);
  assert(doctor.ok === true && doctor.failure_count === 0, "doctor strict failed after goal lifecycle smoke");
  mdkg(binPath, ["pack", goalB.id, "--dry-run", "--stats"], root);

  console.log("smoke:goal-lifecycle ok");
}

main();
