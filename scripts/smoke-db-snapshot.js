#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { DatabaseSync } = require("node:sqlite");

const repoRoot = path.resolve(__dirname, "..");
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
    throw new Error(`${command} ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
  return result.stdout.trim();
}

function runRaw(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
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
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(path.join(prefix, "bin"), { recursive: true });
  fs.mkdirSync(path.join(prefix, "lib"), { recursive: true });
  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = packOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);
  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function writeFixtureState(runtimePath, id, name, payload) {
  const db = new DatabaseSync(runtimePath);
  try {
    db.exec(`
CREATE TABLE IF NOT EXISTS smoke_item (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  payload BLOB
) STRICT;
`);
    db.prepare("INSERT OR REPLACE INTO smoke_item (id, name, payload) VALUES (?, ?, ?)").run(
      id,
      name,
      Buffer.from(payload, "utf8")
    );
  } finally {
    db.close();
  }
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-db-snapshot-smoke-"));
  const binPath = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  parseJson(mdkg(binPath, ["db", "init", "--json"], root));
  parseJson(mdkg(binPath, ["db", "migrate", "--json"], root));

  const runtimePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");
  const snapshotPath = path.join(root, ".mdkg", "db", "state", "project.sqlite");
  const manifestPath = path.join(root, ".mdkg", "db", "state", "project.manifest.json");
  const firstSnapshotPath = path.join(root, ".mdkg", "db", "state", "first.sqlite");
  const dumpPath = path.join(root, ".mdkg", "db", "state", "project.dump.txt");

  const missingStatus = parseJson(mdkg(binPath, ["db", "snapshot", "status", "--json"], root));
  assert(missingStatus.action === "db-snapshot-status" && missingStatus.status === "missing", "snapshot status should start missing");

  writeFixtureState(runtimePath, "smoke-1", "first smoke row", "payload-one");
  const seal = parseJson(mdkg(binPath, ["db", "snapshot", "seal", "--json"], root));
  assert(seal.action === "db-snapshot-seal" && seal.ok === true, "snapshot seal receipt failed");
  assertExists(snapshotPath);
  assertExists(manifestPath);

  const runtimeIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/runtime/project.sqlite"], { cwd: root });
  assert(runtimeIgnored.status === 0, "runtime project.sqlite should be ignored by default");
  const stateIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/state/project.sqlite"], { cwd: root });
  assert(stateIgnored.status !== 0, "sealed snapshot should be commit-eligible by explicit policy");

  const verify = parseJson(mdkg(binPath, ["db", "snapshot", "verify", "--json"], root));
  assert(verify.action === "db-snapshot-verify" && verify.ok === true && verify.status === "valid", "snapshot verify failed");

  const dump = parseJson(mdkg(binPath, ["db", "snapshot", "dump", "--output", ".mdkg/db/state/project.dump.txt", "--json"], root));
  assert(dump.action === "db-snapshot-dump" && dump.ok === true && dump.output === ".mdkg/db/state/project.dump.txt", "snapshot dump receipt failed");
  const dumpText = fs.readFileSync(dumpPath, "utf8");
  assert(dumpText.includes("smoke_item"), "canonical dump missing smoke table");
  assert(dumpText.includes("blob_sha256"), "canonical dump missing blob hash summary");

  fs.copyFileSync(snapshotPath, firstSnapshotPath);
  writeFixtureState(runtimePath, "smoke-2", "second smoke row", "payload-two");
  const staleStatus = parseJson(mdkg(binPath, ["db", "snapshot", "status", "--json"], root));
  assert(staleStatus.status === "stale", "snapshot status should report stale after runtime mutation");

  const reseal = parseJson(mdkg(binPath, ["db", "snapshot", "seal", "--json"], root));
  assert(reseal.action === "db-snapshot-seal" && reseal.ok === true, "second snapshot seal failed");
  const diff = parseJson(mdkg(binPath, ["db", "snapshot", "diff", ".mdkg/db/state/first.sqlite", ".mdkg/db/state/project.sqlite", "--json"], root));
  assert(diff.action === "db-snapshot-diff" && diff.changed_count > 0, "snapshot diff should report changed lines");
  assert(diff.added.some((line) => line.includes("smoke-2")), "snapshot diff missing new fixture row");

  mdkg(binPath, ["validate"], root);
  const indexRebuild = parseJson(mdkg(binPath, ["db", "index", "rebuild", "--json"], root));
  assert(indexRebuild.action === "db-index-rebuild" && indexRebuild.ok === true, "db index rebuild failed");
  const indexVerify = parseJson(mdkg(binPath, ["db", "index", "verify", "--json"], root));
  assert(indexVerify.action === "db-index-verify" && indexVerify.ok === true, "db index verify failed");

  console.log("db snapshot smoke passed");
}

main();
