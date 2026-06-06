#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

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
  return { binPath, prefix, tarballPath };
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-db-events-smoke-"));
  const { binPath, prefix, tarballPath } = packAndInstall(tempRoot);
  const helperPath = path.join(prefix, "lib", "node_modules", "mdkg", "dist", "core", "project_db_events.js");
  assertExists(helperPath);
  const events = require(helperPath);

  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  const init = parseJson(mdkg(binPath, ["db", "init", "--json"], root));
  assert(init.action === "db-init" && init.ok === true, "db init receipt failed");
  const migrate = parseJson(mdkg(binPath, ["db", "migrate", "--json"], root));
  assert(migrate.action === "db-migrate" && migrate.applied_count === 5, "db migrate did not apply event migrations");

  const databasePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");
  const runtimeIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/runtime/project.sqlite"], { cwd: root });
  assert(runtimeIgnored.status === 0, "runtime project.sqlite should be ignored by default");
  for (const migrationPath of [
    ".mdkg/db/schema/migrations/003_mdkg_project_db_events_receipts.sql",
    ".mdkg/db/schema/migrations/004_mdkg_project_db_writer_leases.sql",
  ]) {
    const ignored = runRaw(GIT_CMD, ["check-ignore", migrationPath], { cwd: root });
    assert(ignored.status !== 0, `${migrationPath} should be commit-eligible`);
  }

  const first = events.recordProjectDbEvent(databasePath, {
    event_id: "event-1",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-1",
    payload: { key: "events.smoke", value: "one" },
    actor: "smoke",
    now_ms: 1000,
  });
  assert(first.created === true && first.event.payload_hash.startsWith("sha256:"), "event insert failed");

  const duplicate = events.recordProjectDbEvent(databasePath, {
    event_id: "event-duplicate",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-1",
    payload: { key: "events.smoke", value: "one" },
    actor: "smoke",
    now_ms: 1001,
  });
  assert(duplicate.duplicate === true && duplicate.event.event_id === "event-1", "event dedupe failed");

  const conflict = events.recordProjectDbEvent(databasePath, {
    event_id: "event-conflict",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-1",
    payload: { key: "events.smoke", value: "conflict" },
    actor: "smoke",
    now_ms: 1002,
  });
  assert(conflict.conflict === true && conflict.receipt.status === "conflict", "event conflict receipt failed");
  assertExists(path.join(root, ".mdkg", "db", conflict.receipt.artifact_path));

  const applied = events.applyProjectDbReducer(databasePath, {
    event_id: "event-1",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    actor: "smoke",
    now_ms: 1010,
  });
  assert(applied.applied === true && applied.receipt.status === "applied", "reducer apply failed");
  const replay = events.replayProjectDbEvents(databasePath, {
    project_id: "project",
    branch_id: "main",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    actor: "smoke",
    now_ms: 1020,
  });
  assert(replay.replayed_count === 1 && replay.receipt.status === "replay", "event replay failed");

  events.recordProjectDbEvent(databasePath, {
    event_id: "event-invalid",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-invalid",
    payload: { key: "missing-value" },
    actor: "smoke",
    now_ms: 1030,
  });
  const rejected = events.applyProjectDbReducer(databasePath, {
    event_id: "event-invalid",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    actor: "smoke",
    now_ms: 1031,
  });
  assert(rejected.applied === false && rejected.receipt.status === "rejected", "rejected receipt failed");

  events.acquireProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-1",
    lease_owner: "worker-1",
    base_snapshot_hash: "sha256:base",
    lease_ms: 100,
    now_ms: 2000,
  });
  const committed = events.commitProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-1",
    lease_owner: "worker-1",
    result_snapshot_hash: "sha256:one",
    now_ms: 2010,
  });
  assert(committed.committed === true && committed.receipt.status === "applied", "lease commit failed");
  events.acquireProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-2",
    lease_owner: "worker-2",
    base_snapshot_hash: "sha256:base",
    lease_ms: 100,
    now_ms: 2020,
  });
  const stale = events.commitProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-2",
    lease_owner: "worker-2",
    result_snapshot_hash: "sha256:two",
    now_ms: 2030,
  });
  assert(stale.committed === false && stale.receipt.status === "conflict", "stale lease conflict failed");
  events.acquireProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-3",
    lease_owner: "worker-3",
    base_snapshot_hash: "sha256:one",
    lease_ms: 5,
    now_ms: 2040,
  });
  assert(events.releaseExpiredProjectWriterLeases(databasePath, { now_ms: 2044 }).released_count === 0, "lease expired too early");
  assert(events.releaseExpiredProjectWriterLeases(databasePath, { now_ms: 2046 }).released_count === 1, "expired lease not released");
  const leaseStats = events.readProjectWriterLeaseStats(databasePath, { now_ms: 2047 });
  assert(leaseStats.by_status.committed === 1 && leaseStats.by_status.conflict === 1, "lease stats mismatch");

  const verify = parseJson(mdkg(binPath, ["db", "verify", "--json"], root));
  assert(verify.action === "db-verify" && verify.ok === true, "db verify receipt failed");
  const stats = parseJson(mdkg(binPath, ["db", "stats", "--json"], root));
  assert(stats.action === "db-stats" && stats.migration_count === 5, "db stats receipt failed");
  for (const tableName of ["project_event", "project_receipt", "project_branch_state", "project_writer_lease"]) {
    assert(stats.tables.some((table) => table.name === tableName), `db stats missing ${tableName}`);
  }
  assert(stats.receipt_files.count >= 6, "receipt artifacts missing from stats");

  const seal = parseJson(mdkg(binPath, ["db", "snapshot", "seal", "--json"], root));
  assert(seal.action === "db-snapshot-seal" && seal.ok === true, "snapshot seal failed");
  const snapshotPath = path.join(root, ".mdkg", "db", "state", "project.sqlite");
  const firstSnapshotPath = path.join(root, ".mdkg", "db", "state", "events-first.sqlite");
  fs.copyFileSync(snapshotPath, firstSnapshotPath);
  const snapshotVerify = parseJson(mdkg(binPath, ["db", "snapshot", "verify", "--json"], root));
  assert(snapshotVerify.action === "db-snapshot-verify" && snapshotVerify.ok === true, "snapshot verify failed");
  const dump = parseJson(mdkg(binPath, ["db", "snapshot", "dump", "--output", ".mdkg/db/state/events.dump.txt", "--json"], root));
  assert(dump.action === "db-snapshot-dump" && dump.ok === true, "snapshot dump failed");

  events.recordProjectDbEvent(databasePath, {
    event_id: "event-2",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-2",
    payload: { key: "events.smoke", value: "two" },
    actor: "smoke",
    now_ms: 3000,
  });
  events.applyProjectDbReducer(databasePath, {
    event_id: "event-2",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    actor: "smoke",
    now_ms: 3001,
  });
  const reseal = parseJson(mdkg(binPath, ["db", "snapshot", "seal", "--json"], root));
  assert(reseal.action === "db-snapshot-seal" && reseal.ok === true, "second snapshot seal failed");
  const diff = parseJson(mdkg(binPath, ["db", "snapshot", "diff", ".mdkg/db/state/events-first.sqlite", ".mdkg/db/state/project.sqlite", "--json"], root));
  assert(diff.action === "db-snapshot-diff" && diff.changed_count > 0, "snapshot diff should report changes");

  mdkg(binPath, ["index"], root);
  mdkg(binPath, ["validate"], root);
  const helpDb = mdkg(binPath, ["help", "db"], root);
  assert(!/^\s*mdkg db event\b/m.test(helpDb), "db help should not expose public event CLI");
  assert(!/^\s*mdkg db reducer\b/m.test(helpDb), "db help should not expose public reducer CLI");
  assert(!/^\s*mdkg db lease\b/m.test(helpDb), "db help should not expose public lease CLI");

  console.log(`db events smoke passed: ${path.basename(tarballPath)}`);
}

main();
