#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");
const { DatabaseSync } = require("node:sqlite");

const repoRoot = path.resolve(__dirname, "..");

let commands;

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

function prepareInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(path.join(prefix, "bin"), { recursive: true });
  fs.mkdirSync(path.join(prefix, "lib"), { recursive: true });
  const packOutput = commands.npm(["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir]).stdout;
  const tarball = packOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);
  return { tarballPath, install() {
    commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
    assertExists(binPath);
    return { binPath, tarballPath };
  } };
}

function mdkg(binPath, args, cwd) {
  return commands.node(binPath, args, cwd).stdout.trim();
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

function exerciseSmoke(tempRoot, installed) {
  const { binPath, tarballPath } = installed;
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  commands.git(["init", "-q"], root);

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

  const runtimeIgnored = commands.git(["check-ignore", ".mdkg/db/runtime/project.sqlite"], root, { allowFailure: true });
  assert(runtimeIgnored.status === 0, "runtime project.sqlite should be ignored by default");
  const stateIgnored = commands.git(["check-ignore", ".mdkg/db/state/project.sqlite"], root, { allowFailure: true });
  assert(stateIgnored.status === 1, "sealed snapshot should be commit-eligible by explicit policy");

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

  return { smoke: "db-snapshot", ok: true, temp_root: tempRoot, tarball: tarballPath };
}

function main() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-db-snapshot-smoke-",
    prepare: (root, ownedCommands) => { commands = ownedCommands; return prepareInstall(root); },
    exercise: exerciseSmoke,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
