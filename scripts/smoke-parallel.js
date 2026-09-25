#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const { acceptOwnedGitFixture } = require("./qualification-git");
const { createOwnedFixture, finalizeFixture } = require("./qualification-fixture");
const { runFixtureNode } = require("./qualification-process");
const { createSmokeCommands } = require("./qualification-smoke");

const repoRoot = path.resolve(__dirname, "..");
const binPath = path.join(repoRoot, "dist", "cli.js");
let ownedRoot;

function run(args, cwd) {
  const result = runFixtureNode(ownedRoot, binPath, args, { cwd, env: process.env,
    timeout: 180000, maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(`mdkg ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
  return result.stdout.trim();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function initRepo(root, backend) {
  fs.mkdirSync(root, { recursive: true });
  run(["init", "--agent"], root);
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = readJson(configPath);
  config.index.backend = backend;
  writeJson(configPath, config);
  run(["index"], root);
}

function spawnMdkg(args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [binPath, ...args], {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    });
    let stdout = "";
    let stderr = "";
    let error;
    const timeout = setTimeout(() => {
      error = new Error(`parallel mdkg process exceeded 180000ms: ${args.join(" ")}`);
      child.kill("SIGKILL");
    }, 180000);
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (stdout.length > 16 * 1024 * 1024) { error = new Error("parallel mdkg stdout exceeded fixture limit"); child.kill("SIGKILL"); }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      if (stderr.length > 16 * 1024 * 1024) { error = new Error("parallel mdkg stderr exceeded fixture limit"); child.kill("SIGKILL"); }
    });
    child.once("error", failure => { error = failure; });
    child.once("close", (status, signal) => {
      clearTimeout(timeout);
      resolve({ status, signal, error, stdout, stderr });
    });
  });
}

async function runParallel(calls, cwd) {
  const results = await Promise.all(calls.map((args) => spawnMdkg(args, cwd)));
  for (const result of results) {
    if (result.status !== 0 || result.error || result.signal) {
      throw new Error(`parallel command failed: ${result.error?.message || result.signal || result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
  }
  return results;
}

function assertUniqueCreated(results, expectedCount) {
  const ids = results.map((result) => JSON.parse(result.stdout).node.id);
  assert(ids.length === expectedCount, `expected ${expectedCount} ids`);
  assert(new Set(ids).size === ids.length, `duplicate ids found: ${ids.join(", ")}`);
}

async function exerciseBackend(root, backend, count) {
  initRepo(root, backend);
  const createCalls = Array.from({ length: count }, (_, index) => [
    "new",
    "task",
    `parallel ${backend} ${index}`,
    "--status",
    "todo",
    "--priority",
    "1",
    "--json",
  ]);
  const created = await runParallel(createCalls, root);
  assertUniqueCreated(created, count);

  const checkpointCalls = Array.from({ length: count }, (_, index) => [
    "checkpoint",
    "new",
    `parallel checkpoint ${backend} ${index}`,
    "--json",
  ]);
  const checkpoints = await runParallel(checkpointCalls, root);
  const checkpointIds = checkpoints.map((result) => JSON.parse(result.stdout).checkpoint.id);
  assert(new Set(checkpointIds).size === checkpointIds.length, `duplicate checkpoint ids: ${checkpointIds.join(", ")}`);

  const updateCalls = Array.from({ length: count }, (_, index) => [
    "task",
    "update",
    "task-1",
    "--add-refs",
    `task-${index + 1}`,
    "--json",
  ]);
  await runParallel(updateCalls, root);
  run(["index"], root);
  run(["validate"], root);
  const shown = JSON.parse(run(["show", "task-1", "--json"], root));
  const refs = new Set(shown.item.refs);
  for (let index = 1; index <= count; index += 1) {
    assert(refs.has(`task-${index}`), `lost parallel ref task-${index} in ${backend} backend`);
  }
}

async function ownedWorker(args) {
  assert(globalThis[Symbol.for("mdkg.qualification.supervised-child")] === true,
    "parallel worker requires its supervised owner");
  assert(args.length === 2, "parallel worker requires its exact fixture root and owner token");
  ownedRoot = fs.realpathSync(args[0]);
  assert(ownedRoot === args[0], "parallel worker requires its canonical fixture root");
  const admissionPath = path.join(ownedRoot, "worker-admission.json");
  const admissionStat = fs.lstatSync(admissionPath);
  assert(admissionStat.isFile() && admissionStat.nlink === 1,
    "parallel worker owner admission must be an independent regular file");
  const admission = JSON.parse(fs.readFileSync(admissionPath, "utf8"));
  assert(admission.root === ownedRoot && admission.token === args[1] &&
    /^[a-f0-9]{64}$/.test(admission.token), "parallel worker owner admission mismatch");
  acceptOwnedGitFixture(ownedRoot, process.env);
  await exerciseBackend(path.join(ownedRoot, "sqlite"), "sqlite", 32);
  await exerciseBackend(path.join(ownedRoot, "json"), "json", 16);
  console.log(JSON.stringify({ smoke: "parallel", ok: true, sqlite_writers: 32, json_writers: 16 }));
}

function main() {
  const fixture = createOwnedFixture({ base: process.env.MDKG_SMOKE_TMPDIR || undefined,
    prefix: "mdkg-parallel-smoke-" });
  let error, result;
  try {
    const commands = createSmokeCommands(fixture);
    const token = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(fixture.resolve("worker-admission.json"),
      `${JSON.stringify({ root: fixture.root, token })}\n`, { flag: "wx", mode: 0o600 });
    const worker = commands.node(__filename, ["--owned-worker", fixture.root, token], fixture.root,
      { timeout: 300000 });
    result = JSON.parse(worker.stdout);
    assert(result.ok && result.smoke === "parallel", "parallel worker did not report success");
  } catch (failure) { error = failure; }
  const cleanup = finalizeFixture(fixture, { error });
  console.log("parallel smoke passed");
  return { ...result, cleanup };
}

if (require.main === module && process.argv[2] === "--owned-worker") {
  ownedWorker(process.argv.slice(3)).catch(err => { console.error(err.stack || err.message); process.exitCode = 1; });
} else if (require.main === module) {
  try { console.log(JSON.stringify(main())); }
  catch (err) { console.error(err.stack || err.message); process.exitCode = 1; }
}

module.exports = { main };
