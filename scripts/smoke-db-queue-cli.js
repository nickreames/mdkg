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
  return { binPath, tarballPath };
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function mdkgRaw(binPath, args, cwd) {
  return runRaw(binPath, args, { cwd });
}

function expectFailure(binPath, args, cwd, pattern) {
  const result = mdkgRaw(binPath, args, cwd);
  assert(result.status !== 0, `expected failure for mdkg ${args.join(" ")}`);
  assert(pattern.test(result.stderr), `stderr did not match ${pattern}: ${result.stderr}`);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-db-queue-cli-smoke-"));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);

  const queueHelp = mdkg(binPath, ["help", "db", "queue"], root);
  assert(/mdkg db queue enqueue/.test(queueHelp), "queue help did not expose enqueue");
  assert(/mdkg db queue contract/.test(queueHelp), "queue help did not expose adapter contract");
  const contract = parseJson(mdkg(binPath, ["db", "queue", "contract", "--json"], root));
  assert(contract.contract.contract_id === "mdkg.project_db.queue.adapter.v1", "queue adapter contract id mismatch");
  assert(contract.contract.claim.selection.includes("available_at_ms"), "queue adapter contract missing claim ordering");
  assert(contract.contract.settlement.fail.includes("retry_after_ms"), "queue adapter contract missing retry semantics");

  assert(parseJson(mdkg(binPath, ["db", "init", "--json"], root)).ok === true, "db init failed");
  const migrate = parseJson(mdkg(binPath, ["db", "migrate", "--json"], root));
  assert(migrate.action === "db-migrate" && migrate.applied_count === 5, "db migrate did not apply queue control migration");
  assert(parseJson(mdkg(binPath, ["db", "verify", "--json"], root)).ok === true, "db verify failed");

  const created = parseJson(mdkg(binPath, ["db", "queue", "create", "work", "--json"], root));
  assert(created.created === true && created.queue.status === "active", "queue create failed");
  const enqueued = parseJson(mdkg(binPath, [
    "db",
    "queue",
    "enqueue",
    "work",
    "msg-1",
    "--payload-json",
    '{"b":2,"a":1}',
    "--dedupe-key",
    "dedupe-1",
    "--max-attempts",
    "2",
    "--json",
  ], root));
  assert(enqueued.message.payload_json === '{"a":1,"b":2}', "queue enqueue did not canonicalize payload");
  const duplicate = parseJson(mdkg(binPath, [
    "db",
    "queue",
    "enqueue",
    "work",
    "msg-duplicate",
    "--payload-json",
    '{"ignored":true}',
    "--dedupe-key",
    "dedupe-1",
    "--json",
  ], root));
  assert(duplicate.duplicate === true && duplicate.message.message_id === "msg-1", "queue dedupe failed");

  assert(parseJson(mdkg(binPath, ["db", "queue", "claim", "work", "--lease-owner", "worker-a", "--lease-ms", "100", "--json"], root)).message.status === "leased", "queue claim failed");
  expectFailure(binPath, ["db", "queue", "ack", "work", "msg-1", "--lease-owner", "worker-b", "--json"], root, /not leased by worker-b/);
  assert(parseJson(mdkg(binPath, [
    "db",
    "queue",
    "fail",
    "work",
    "msg-1",
    "--lease-owner",
    "worker-a",
    "--error",
    "temporary",
    "--retry-after-ms",
    "0",
    "--json",
  ], root)).message.status === "ready", "queue fail retry failed");
  assert(parseJson(mdkg(binPath, ["db", "queue", "claim", "work", "--lease-owner", "worker-c", "--lease-ms", "100", "--json"], root)).message.message_id === "msg-1", "retry claim failed");
  assert(parseJson(mdkg(binPath, ["db", "queue", "fail", "work", "msg-1", "--lease-owner", "worker-c", "--error", "terminal", "--json"], root)).message.status === "dead_letter", "max-attempt dead-letter failed");

  mdkg(binPath, ["db", "queue", "enqueue", "work", "msg-2", "--payload-json", '{"ok":true}', "--json"], root);
  mdkg(binPath, ["db", "queue", "claim", "work", "--lease-owner", "worker-d", "--lease-ms", "100", "--json"], root);
  assert(parseJson(mdkg(binPath, ["db", "queue", "pause", "work", "--reason", "snapshot", "--json"], root)).queue.status === "paused", "queue pause failed");
  expectFailure(binPath, ["db", "queue", "enqueue", "work", "msg-paused", "--payload-json", '{"blocked":true}', "--json"], root, /queue work is paused; cannot enqueue/);
  expectFailure(binPath, ["db", "queue", "claim", "work", "--lease-owner", "blocked", "--lease-ms", "100", "--json"], root, /queue work is paused; cannot claim/);
  assert(parseJson(mdkg(binPath, ["db", "queue", "ack", "work", "msg-2", "--lease-owner", "worker-d", "--json"], root)).message.status === "acked", "paused settlement ack failed");
  assert(parseJson(mdkg(binPath, ["db", "queue", "resume", "work", "--json"], root)).queue.status === "active", "queue resume failed");

  mdkg(binPath, ["db", "queue", "enqueue", "work", "msg-expire", "--payload-json", '{"expire":true}', "--json"], root);
  mdkg(binPath, ["db", "queue", "claim", "work", "--lease-owner", "worker-e", "--lease-ms", "1", "--json"], root);
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  assert(parseJson(mdkg(binPath, ["db", "queue", "release-expired", "work", "--json"], root)).released_count === 1, "release-expired failed");
  assert(parseJson(mdkg(binPath, ["db", "queue", "claim", "work", "--lease-owner", "worker-f", "--lease-ms", "100", "--json"], root)).message.message_id === "msg-expire", "expired reclaim failed");
  assert(parseJson(mdkg(binPath, ["db", "queue", "dead-letter", "work", "msg-expire", "--lease-owner", "worker-f", "--error", "manual", "--json"], root)).message.status === "dead_letter", "explicit dead-letter failed");

  const list = parseJson(mdkg(binPath, ["db", "queue", "list", "work", "--status", "dead_letter", "--json"], root));
  assert(list.count === 2, "queue list dead-letter count mismatch");
  assert(parseJson(mdkg(binPath, ["db", "queue", "show", "work", "msg-1", "--json"], root)).message.message_id === "msg-1", "queue show failed");
  const stats = parseJson(mdkg(binPath, ["db", "queue", "stats", "work", "--json"], root));
  assert(stats.stats.by_status.acked === 1 && stats.stats.by_status.dead_letter === 2, "queue stats failed");

  mdkg(binPath, ["db", "queue", "enqueue", "work", "msg-ready", "--payload-json", '{"ready":true}', "--json"], root);
  expectFailure(binPath, ["db", "snapshot", "seal", "--json"], root, /requires drained queues/);
  mdkg(binPath, ["db", "queue", "pause", "work", "--reason", "snapshot", "--json"], root);
  const pausedSeal = parseJson(mdkg(binPath, ["db", "snapshot", "seal", "--queue-policy", "paused", "--json"], root));
  assert(pausedSeal.queue_policy === "paused" && pausedSeal.queue_summary.ready === 1, "paused queue snapshot failed");
  assert(parseJson(mdkg(binPath, ["db", "snapshot", "verify", "--json"], root)).status === "valid", "paused snapshot verify failed");
  const firstSnapshot = path.join(root, ".mdkg", "db", "state", "first.sqlite");
  fs.copyFileSync(path.join(root, ".mdkg", "db", "state", "project.sqlite"), firstSnapshot);

  mdkg(binPath, ["db", "queue", "resume", "work", "--json"], root);
  mdkg(binPath, ["db", "queue", "claim", "work", "--lease-owner", "worker-g", "--lease-ms", "100", "--json"], root);
  mdkg(binPath, ["db", "queue", "ack", "work", "msg-ready", "--lease-owner", "worker-g", "--json"], root);
  const drainedSeal = parseJson(mdkg(binPath, ["db", "snapshot", "seal", "--json"], root));
  assert(drainedSeal.queue_policy === "drain" && drainedSeal.queue_summary.ready === 0 && drainedSeal.queue_summary.leased === 0, "drained snapshot failed");
  assert(parseJson(mdkg(binPath, ["db", "snapshot", "dump", "--output", ".mdkg/db/state/project.dump.txt", "--json"], root)).ok === true, "snapshot dump failed");
  assert(parseJson(mdkg(binPath, ["db", "snapshot", "diff", ".mdkg/db/state/first.sqlite", ".mdkg/db/state/project.sqlite", "--json"], root)).changed_count > 0, "snapshot diff failed");

  const dbStats = parseJson(mdkg(binPath, ["db", "stats", "--json"], root));
  assert(dbStats.tables.some((table) => table.name === "project_queue"), "db stats missing project_queue");
  assert(dbStats.tables.some((table) => table.name === "project_queue_message"), "db stats missing project_queue_message");
  const runtimeIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/runtime/project.sqlite"], { cwd: root });
  assert(runtimeIgnored.status === 0, "runtime project.sqlite should be ignored");
  const migrationIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/schema/migrations/005_mdkg_project_db_queue_control.sql"], { cwd: root });
  assert(migrationIgnored.status !== 0, "queue control migration should be commit-eligible");
  const stateIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/state/project.sqlite"], { cwd: root });
  assert(stateIgnored.status !== 0, "sealed state snapshot should be commit-eligible");

  mdkg(binPath, ["new", "task", "db queue cli smoke search target", "--status", "todo", "--priority", "1"], root);
  mdkg(binPath, ["index"], root);
  mdkg(binPath, ["validate"], root);
  assert(/db queue cli smoke search target/.test(mdkg(binPath, ["search", "db queue cli smoke search target", "--json"], root)), "search did not find smoke task");

  console.log(`db queue cli smoke passed: ${path.basename(tarballPath)} at ${tempRoot}`);
}

main();
