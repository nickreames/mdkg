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
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-db-materializer-smoke-"));
  const { binPath, prefix, tarballPath } = packAndInstall(tempRoot);
  const packageRoot = path.join(prefix, "lib", "node_modules", "mdkg");
  const materializerPath = path.join(packageRoot, "dist", "core", "project_db_materializer.js");
  const eventsPath = path.join(packageRoot, "dist", "core", "project_db_events.js");
  const queuePath = path.join(packageRoot, "dist", "core", "project_db_queue.js");
  assertExists(materializerPath);
  assertExists(eventsPath);
  assertExists(queuePath);
  const materializer = require(materializerPath);
  const events = require(eventsPath);
  const queue = require(queuePath);

  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  const init = parseJson(mdkg(binPath, ["db", "init", "--json"], root));
  assert(init.action === "db-init" && init.ok === true, "db init receipt failed");
  const migrate = parseJson(mdkg(binPath, ["db", "migrate", "--json"], root));
  assert(migrate.action === "db-migrate" && migrate.applied_count === 5, "db migrate did not apply materializer prerequisites");

  const databasePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");
  assertExists(databasePath);
  const runtimeIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/runtime/project.sqlite"], { cwd: root });
  assert(runtimeIgnored.status === 0, "runtime project.sqlite should be ignored by default");

  events.recordProjectDbEvent(databasePath, {
    event_id: "event-1",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "materializer-smoke-1",
    payload: { key: "materializer.smoke", value: "one" },
    actor: "smoke",
    now_ms: 1000,
  });
  const firstEnqueue = materializer.enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-smoke-1",
    project_id: "project",
    branch_id: "main",
    event_id: "event-1",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 2,
    now_ms: 1001,
  });
  assert(firstEnqueue.created === true, "materializer enqueue failed");
  const applied = materializer.runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-1",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1010,
  });
  assert(applied.status === "applied", "materializer apply failed");
  assert(applied.queue_message.status === "acked", "applied message was not acked");
  assert(applied.reducer.applied === true && applied.lease.status === "committed", "reducer or lease did not commit");
  assert(applied.snapshot.action === "db-snapshot-seal" && applied.snapshot.ok === true, "materializer did not seal snapshot");

  const snapshotPath = path.join(root, ".mdkg", "db", "state", "project.sqlite");
  assertExists(snapshotPath);
  const firstSnapshotPath = path.join(root, ".mdkg", "db", "state", "materializer-first.sqlite");
  fs.copyFileSync(snapshotPath, firstSnapshotPath);
  const snapshotVerify = parseJson(mdkg(binPath, ["db", "snapshot", "verify", "--json"], root));
  assert(snapshotVerify.action === "db-snapshot-verify" && snapshotVerify.status === "valid", "snapshot verify failed");

  materializer.enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-smoke-duplicate",
    dedupe_key: "materializer-smoke-duplicate-delivery",
    project_id: "project",
    branch_id: "main",
    event_id: "event-1",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 2,
    now_ms: 1020,
  });
  const duplicate = materializer.runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-2",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1021,
  });
  assert(duplicate.status === "duplicate" && duplicate.queue_message.status === "acked", "duplicate materialization failed");

  queue.enqueueProjectQueueMessage(databasePath, {
    queue_name: materializer.PROJECT_DB_MATERIALIZER_QUEUE,
    message_id: "materializer-smoke-invalid",
    payload: { kind: "not-materializer" },
    max_attempts: 3,
    now_ms: 1030,
  });
  const invalid = materializer.runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-invalid",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1031,
  });
  assert(invalid.status === "dead_letter" && invalid.receipt.status === "rejected", "invalid payload did not dead-letter");

  materializer.enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-smoke-missing",
    project_id: "project",
    branch_id: "main",
    event_id: "event-missing",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 1,
    now_ms: 1040,
  });
  const missing = materializer.runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-missing",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1041,
  });
  assert(missing.status === "dead_letter" && /event-missing/.test(missing.error), "missing event did not dead-letter");

  events.recordProjectDbEvent(databasePath, {
    event_id: "event-2",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "materializer-smoke-2",
    payload: { key: "materializer.conflict", value: "should-not-apply" },
    actor: "smoke",
    now_ms: 1050,
  });
  materializer.enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-smoke-conflict",
    project_id: "project",
    branch_id: "main",
    event_id: "event-2",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 2,
    now_ms: 1051,
  });
  const conflict = materializer.runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-conflict",
    lease_ms: 100,
    repo_root: root,
    base_snapshot_hash: "sha256:stale",
    now_ms: 1052,
  });
  assert(conflict.status === "conflict", "stale materializer base did not conflict");
  assert(conflict.queue_message.status === "ready" && conflict.lease.status === "conflict", "conflict did not leave retryable delivery");

  const verify = parseJson(mdkg(binPath, ["db", "verify", "--json"], root));
  assert(verify.action === "db-verify" && verify.ok === true, "db verify failed");
  const stats = parseJson(mdkg(binPath, ["db", "stats", "--json"], root));
  assert(stats.action === "db-stats" && stats.migration_count === 5, "db stats failed");
  for (const tableName of ["project_queue_message", "project_event", "project_receipt", "project_writer_lease"]) {
    assert(stats.tables.some((table) => table.name === tableName), `db stats missing ${tableName}`);
  }
  assert(stats.receipt_files.count >= 6, "materializer receipt artifacts missing");
  const materializerStats = materializer.readProjectDbMaterializerStats(databasePath, { now_ms: 1060 });
  assert(materializerStats.queue.by_status.acked === 2, "materializer stats missing acked deliveries");
  assert(materializerStats.queue.by_status.dead_letter === 2, "materializer stats missing dead letters");
  assert(materializerStats.queue.by_status.ready === 1, "materializer stats missing retryable conflict");

  const paused = parseJson(mdkg(binPath, ["db", "queue", "pause", materializer.PROJECT_DB_MATERIALIZER_QUEUE, "--reason", "preserve retryable conflict", "--json"], root));
  assert(paused.queue.status === "paused", "materializer queue pause failed");
  const reseal = parseJson(mdkg(binPath, ["db", "snapshot", "seal", "--queue-policy", "paused", "--json"], root));
  assert(reseal.action === "db-snapshot-seal" && reseal.ok === true, "snapshot reseal failed");
  assert(reseal.queue_policy === "paused" && reseal.queue_summary.ready === 1, "paused snapshot policy did not preserve retryable materializer message");
  const dump = parseJson(mdkg(binPath, ["db", "snapshot", "dump", "--output", ".mdkg/db/state/materializer.dump.txt", "--json"], root));
  assert(dump.action === "db-snapshot-dump" && dump.ok === true, "snapshot dump failed");
  const diff = parseJson(mdkg(binPath, ["db", "snapshot", "diff", ".mdkg/db/state/materializer-first.sqlite", ".mdkg/db/state/project.sqlite", "--json"], root));
  assert(diff.action === "db-snapshot-diff" && diff.changed_count > 0, "snapshot diff should report materializer changes");

  mdkg(binPath, ["index"], root);
  mdkg(binPath, ["validate"], root);
  const helpDb = mdkg(binPath, ["help", "db"], root);
  assert(/^\s*mdkg db queue\b/m.test(helpDb), "db help should expose public queue CLI");
  assert(!/^\s*mdkg db event\b/m.test(helpDb), "db help should not expose public event CLI");
  assert(!/^\s*mdkg db reducer\b/m.test(helpDb), "db help should not expose public reducer CLI");
  assert(!/^\s*mdkg db lease\b/m.test(helpDb), "db help should not expose public lease CLI");
  assert(!/^\s*mdkg db materializer\b/m.test(helpDb), "db help should not expose public materializer CLI");

  console.log(`db materializer smoke passed: ${path.basename(tarballPath)}`);
}

main();
