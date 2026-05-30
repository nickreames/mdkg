#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const binPath = path.join(repoRoot, "dist", "cli.js");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();

function run(args, cwd) {
  const result = spawnSync(process.execPath, [binPath, ...args], {
    cwd,
    encoding: "utf8",
    stdio: "pipe",
  });
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
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => {
      resolve({ status, stdout, stderr });
    });
  });
}

async function runParallel(calls, cwd) {
  const results = await Promise.all(calls.map((args) => spawnMdkg(args, cwd)));
  for (const result of results) {
    if (result.status !== 0) {
      throw new Error(`parallel command failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
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

async function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-parallel-smoke-"));
  await exerciseBackend(path.join(tempRoot, "sqlite"), "sqlite", 32);
  await exerciseBackend(path.join(tempRoot, "json"), "json", 16);
  console.log("parallel smoke passed");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack || err.message : String(err));
  process.exit(1);
});
