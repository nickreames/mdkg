#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");

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
    return { binPath, prefix, tarballPath };
  } };
}

function mdkg(binPath, args, cwd) {
  return commands.node(binPath, args, cwd).stdout.trim();
}

function exerciseSmoke(tempRoot, installed) {
  const { binPath, prefix, tarballPath } = installed;
  const helperPath = path.join(prefix, "lib", "node_modules", "mdkg", "dist", "core", "project_db_queue.js");
  assertExists(helperPath);
  const queue = require(helperPath);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  commands.git(["init", "-q"], root);

  mdkg(binPath, ["init", "--agent"], root);
  const init = parseJson(mdkg(binPath, ["db", "init", "--json"], root));
  assert(init.action === "db-init" && init.ok === true, "db init receipt failed");
  const migrate = parseJson(mdkg(binPath, ["db", "migrate", "--json"], root));
  assert(migrate.action === "db-migrate" && migrate.applied_count === 5, "db migrate did not apply built-in migrations");

  const databasePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");
  assertExists(databasePath);

  const first = queue.enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-1",
    dedupe_key: "event-1",
    payload: { b: 2, a: 1 },
    max_attempts: 2,
    now_ms: 1000,
  });
  assert(first.created === true && first.message.payload_json === '{"a":1,"b":2}', "enqueue failed");
  const duplicate = queue.enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-duplicate",
    dedupe_key: "event-1",
    payload: { ignored: true },
    now_ms: 1001,
  });
  assert(duplicate.created === false && duplicate.message.message_id === "queue-smoke-1", "dedupe failed");

  const claim = queue.claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-a",
    lease_ms: 100,
    now_ms: 1010,
  });
  assert(claim && claim.message_id === "queue-smoke-1" && claim.status === "leased", "claim failed");
  let wrongWorkerRejected = false;
  try {
    queue.ackProjectQueueMessage(databasePath, {
      queue_name: "materialize",
      message_id: "queue-smoke-1",
      lease_owner: "worker-b",
      now_ms: 1011,
    });
  } catch {
    wrongWorkerRejected = true;
  }
  assert(wrongWorkerRejected, "wrong-worker ack should be rejected");

  const retry = queue.failProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-1",
    lease_owner: "worker-a",
    error: "temporary failure",
    retry_after_ms: 25,
    now_ms: 1020,
  });
  assert(retry.status === "ready" && retry.available_at_ms === 1045, "retry transition failed");
  assert(
    queue.claimProjectQueueMessage(databasePath, {
      queue_name: "materialize",
      lease_owner: "worker-c",
      lease_ms: 100,
      now_ms: 1044,
    }) === null,
    "message should not be ready before retry delay"
  );
  const retryClaim = queue.claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-c",
    lease_ms: 100,
    now_ms: 1045,
  });
  assert(retryClaim && retryClaim.message_id === "queue-smoke-1", "retry claim failed");
  const dead = queue.failProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-1",
    lease_owner: "worker-c",
    error: "terminal failure",
    now_ms: 1050,
  });
  assert(dead.status === "dead_letter" && dead.attempt_count === 2, "dead-letter transition failed");

  queue.enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-2",
    payload: { ok: true },
    now_ms: 2000,
  });
  const expiring = queue.claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-d",
    lease_ms: 5,
    now_ms: 2000,
  });
  assert(expiring && expiring.message_id === "queue-smoke-2", "expiring claim failed");
  assert(queue.releaseExpiredProjectQueueLeases(databasePath, { queue_name: "materialize", now_ms: 2004 }).released_count === 0, "lease released too early");
  assert(queue.releaseExpiredProjectQueueLeases(databasePath, { queue_name: "materialize", now_ms: 2006 }).released_count === 1, "expired lease not released");
  const reclaim = queue.claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-e",
    lease_ms: 100,
    now_ms: 2007,
  });
  assert(reclaim && reclaim.message_id === "queue-smoke-2", "expired message was not reclaimed");
  const ack = queue.ackProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-2",
    lease_owner: "worker-e",
    now_ms: 2008,
  });
  assert(ack.status === "acked", "ack transition failed");

  queue.enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-3",
    payload: { stop: true },
    now_ms: 3000,
  });
  const explicit = queue.claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-f",
    lease_ms: 100,
    now_ms: 3001,
  });
  assert(explicit && explicit.message_id === "queue-smoke-3", "explicit dead-letter claim failed");
  const explicitDead = queue.deadLetterProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "queue-smoke-3",
    lease_owner: "worker-f",
    error: "manual terminal failure",
    now_ms: 3002,
  });
  assert(explicitDead.status === "dead_letter", "explicit dead-letter failed");

  const queueStats = queue.readProjectQueueStats(databasePath, { queue_name: "materialize", now_ms: 3003 });
  assert(queueStats.total === 3, "queue stats total mismatch");
  assert(queueStats.by_status.acked === 1, "queue stats acked mismatch");
  assert(queueStats.by_status.dead_letter === 2, "queue stats dead-letter mismatch");

  const verify = parseJson(mdkg(binPath, ["db", "verify", "--json"], root));
  assert(verify.action === "db-verify" && verify.ok === true, "db verify receipt failed");
  const stats = parseJson(mdkg(binPath, ["db", "stats", "--json"], root));
  assert(stats.action === "db-stats" && stats.migration_count === 5, "db stats receipt failed");
  const queueTable = stats.tables.find((table) => table.name === "project_queue_message");
  assert(queueTable && queueTable.row_count === 3, "db stats missing queue table rows");

  mdkg(binPath, ["new", "task", "db queue smoke search target", "--status", "todo", "--priority", "1"], root);
  mdkg(binPath, ["index"], root);
  mdkg(binPath, ["validate"], root);

  return { smoke: "db-queue", ok: true, temp_root: tempRoot, tarball: tarballPath };
}

function main() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-db-queue-smoke-",
    prepare: (root, ownedCommands) => { commands = ownedCommands; return prepareInstall(root); },
    exercise: exerciseSmoke,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
