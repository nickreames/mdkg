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
  return { binPath, tarballPath };
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function git(cwd, args) {
  return run(GIT_CMD, args, { cwd });
}

function replaceInFile(filePath, from, to) {
  const content = fs.readFileSync(filePath, "utf8");
  assert(content.includes(from), `expected ${filePath} to contain ${from}`);
  fs.writeFileSync(filePath, content.replace(from, to), "utf8");
}

function appendToFile(filePath, content) {
  fs.appendFileSync(filePath, content, "utf8");
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-handoff-smoke-"));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);

  mdkg(binPath, ["init", "--agent"], root);
  const goal = parseJson(mdkg(binPath, ["new", "goal", "handoff smoke goal", "--json"], root).stdout).node;
  const task = parseJson(
    mdkg(binPath, ["new", "task", "handoff smoke task", "--status", "progress", "--priority", "1", "--json"], root).stdout
  ).node;
  const evidence = parseJson(
    mdkg(binPath, ["new", "task", "handoff smoke evidence", "--status", "done", "--priority", "2", "--json"], root).stdout
  ).node;
  const checkpoint = parseJson(
    mdkg(binPath, ["checkpoint", "new", "handoff smoke checkpoint", "--kind", "handoff", "--json"], root).stdout
  ).checkpoint;

  const goalPath = path.join(root, goal.path);
  replaceInFile(goalPath, "scope_refs: []", `scope_refs: [${task.id}]`);
  replaceInFile(goalPath, "goal_state: active", `goal_state: active\nactive_node: ${task.id}`);
  replaceInFile(goalPath, "required_checks: []", "required_checks: [npm run build, node dist/cli.js validate --json]");

  const taskPath = path.join(root, task.path);
  replaceInFile(taskPath, "priority: 1", `priority: 1\nparent: ${goal.id}`);
  replaceInFile(taskPath, "evidence_refs: []", `evidence_refs: [${evidence.id}, proof://handoff/smoke]`);
  appendToFile(taskPath, "\n# Private Notes\n\nRAW_PAYLOAD_MARKER should be warned about but not copied.\n");

  mdkg(binPath, ["index"], root);
  const handoff = parseJson(mdkg(binPath, ["handoff", "create", goal.id, "--json"], root).stdout);
  assert(handoff.action === "handoff-created", "handoff action mismatch");
  assert(handoff.target.id === goal.id, "handoff target mismatch");
  assert(handoff.included_qids.includes(`root:${task.id}`), "handoff missing scoped task");
  assert(handoff.included_qids.includes(`root:${checkpoint.id}`), "handoff missing latest checkpoint");
  assert(handoff.content.includes("handoff smoke task"), "handoff content missing task summary");
  assert(handoff.content.includes("proof://handoff/smoke"), "handoff content missing evidence ref");
  assert(handoff.content.includes("raw_payload"), "handoff content missing raw marker warning id");
  assert(!handoff.content.includes("RAW_PAYLOAD_MARKER"), "handoff leaked raw marker content");

  const out = ".mdkg/handoffs/handoff-smoke.md";
  const written = parseJson(mdkg(binPath, ["handoff", "create", goal.id, "--out", out, "--json"], root).stdout);
  assert(written.output_path === out, "handoff output path mismatch");
  assertExists(path.join(root, out));
  assert(fs.readFileSync(path.join(root, out), "utf8").includes("mdkg Agent Handoff"), "handoff output missing header");

  const validate = parseJson(mdkg(binPath, ["validate", "--json"], root).stdout);
  assert(validate.ok === true, "handoff smoke repo did not validate");
  const search = parseJson(mdkg(binPath, ["search", "handoff smoke", "--json"], root).stdout);
  assert(search.count >= 3, "handoff smoke search missed records");
  const shown = parseJson(mdkg(binPath, ["show", goal.id, "--json"], root).stdout);
  assert(shown.item.id === goal.id, "show missed handoff goal");

  console.log(
    JSON.stringify(
      {
        smoke: "handoff",
        ok: true,
        packageVersion,
        tempRoot,
        tarballPath,
        root,
      },
      null,
      2
    )
  );
}

main();
