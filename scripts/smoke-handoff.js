#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;

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

function prepareInstall(tempRoot) {
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
  assert(tarballName, "unable to determine npm pack output tarball");
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  return { tarballPath, install() {
    const install = commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    assert(`${install.stdout}${install.stderr}`.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing package version");

    const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
    assertExists(binPath);
    return { binPath, tarballPath };
  } };
}

function mdkg(binPath, args, cwd) {
  const result = commands.node(binPath, args, cwd);
  return { ...result, stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}` };
}

function git(cwd, args) {
  return commands.git(args, cwd);
}

function replaceInFile(filePath, from, to) {
  const content = fs.readFileSync(filePath, "utf8");
  assert(content.includes(from), `expected ${filePath} to contain ${from}`);
  fs.writeFileSync(filePath, content.replace(from, to), "utf8");
}

function appendToFile(filePath, content) {
  fs.appendFileSync(filePath, content, "utf8");
}

function exerciseSmoke(tempRoot, installed) {
  const { binPath, tarballPath } = installed;
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

  return {
    smoke: "handoff",
    ok: true,
    packageVersion,
    tempRoot,
    tarballPath,
    root,
  };
}

function main() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-handoff-smoke-",
    prepare: (root, ownedCommands) => { commands = ownedCommands; return prepareInstall(root); },
    exercise: exerciseSmoke,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
