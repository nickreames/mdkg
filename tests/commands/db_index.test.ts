import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync, SpawnSyncReturns } from "node:child_process";
import { writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");
const {
  ackProjectQueueMessage,
  claimProjectQueueMessage,
  createProjectQueue,
  deadLetterProjectQueueMessage,
  enqueueProjectQueueMessage,
  failProjectQueueMessage,
  listProjectQueueMessages,
  pauseProjectQueue,
  readProjectQueue,
  readProjectQueueMessage,
  readProjectQueueSnapshotSummary,
  readProjectQueueStats,
  releaseExpiredProjectQueueLeases,
  resumeProjectQueue,
} = require("../../core/project_db_queue");
const {
  acquireProjectWriterLease,
  applyProjectDbReducer,
  commitProjectWriterLease,
  readProjectWriterLeaseStats,
  recordProjectDbEvent,
  releaseExpiredProjectWriterLeases,
  replayProjectDbEvents,
} = require("../../core/project_db_events");
const {
  enqueueProjectDbMaterialization,
  PROJECT_DB_MATERIALIZER_QUEUE,
  readProjectDbMaterializerStats,
  runNextProjectDbMaterializer,
} = require("../../core/project_db_materializer");

function makeRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: db index fixture",
      "status: todo",
      "priority: 1",
      "tags: [db]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-03",
      "updated: 2026-06-03",
      "---",
      "",
      "# Overview",
      "",
      "DB index fixture.",
    ].join("\n")
  );
  return root;
}

function runCli(root: string, args: string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    cwd: root,
  });
}

function parseJson(stdout: string): any {
  return JSON.parse(stdout);
}

function readConfig(root: string): any {
  return JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
}

function writeConfig(root: string, config: unknown): void {
  fs.writeFileSync(path.join(root, ".mdkg", "config.json"), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function sha256File(filePath: string): string {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

test("db queue contract exposes stable adapter semantics without project DB setup", () => {
  const root = makeRoot("mdkg-db-queue-contract-");
  const result = runCli(root, ["db", "queue", "contract", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = parseJson(result.stdout);
  assert.equal(payload.action, "db-queue-contract");
  assert.equal(payload.ok, true);
  assert.equal(payload.contract.contract_id, "mdkg.project_db.queue.adapter.v1");
  assert.equal(payload.contract.stability, "public");
  assert.equal(payload.contract.boundary.canonical_history, "queue rows are not canonical event history or durable runtime transcripts");
  assert.equal(payload.contract.payload_hash.algorithm, "sha256");
  assert.match(payload.contract.payload_hash.canonicalization, /object keys sorted/);
  assert.equal(payload.contract.dedupe.duplicate_behavior.includes("returns the existing message"), true);
  assert.equal(payload.contract.claim.selection.includes("available_at_ms"), true);
  assert.deepEqual(payload.contract.queue_control.paused_behavior.rejects, ["enqueue", "claim"]);
  assert.equal(payload.contract.settlement.fail.includes("retry_after_ms"), true);
  assert.equal(payload.contract.snapshot_policy.drain.includes("no ready or leased"), true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "db")), false);
});

test("db index rebuild status and verify work in json backend", () => {
  const root = makeRoot("mdkg-db-index-json-");

  const rebuild = runCli(root, ["db", "index", "rebuild", "--json"]);
  assert.equal(rebuild.status, 0, rebuild.stderr);
  const rebuilt = parseJson(rebuild.stdout);
  assert.equal(rebuilt.action, "db-index-rebuild");
  assert.equal(rebuilt.ok, true);
  assert.equal(rebuilt.backend, "json");
  assert.deepEqual(Object.keys(rebuilt.paths).sort(), [
    "capabilities",
    "global",
    "skills",
    "subgraphs",
  ]);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "global.json")), true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "skills.json")), true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "capabilities.json")), true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "subgraphs.json")), true);

  const status = runCli(root, ["db", "index", "status", "--json"]);
  assert.equal(status.status, 0, status.stderr);
  const statusPayload = parseJson(status.stdout);
  assert.equal(statusPayload.action, "db-index-status");
  assert.equal(statusPayload.ok, true);
  assert.equal(statusPayload.checks.find((check: any) => check.name === "sqlite").detail, "SQLite backend disabled; JSON cache backend active");

  const verify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.equal(verify.status, 0, verify.stderr);
  const verifyPayload = parseJson(verify.stdout);
  assert.equal(verifyPayload.action, "db-index-verify");
  assert.equal(verifyPayload.ok, true);

  const shortcut = runCli(root, ["index"]);
  assert.equal(shortcut.status, 0, shortcut.stderr);
  assert.match(shortcut.stdout, /index written: \.mdkg\/index\/global\.json/);
});

test("db init creates generic project db scaffold and is idempotent", () => {
  const root = makeRoot("mdkg-db-init-");

  const first = runCli(root, ["db", "init", "--json"]);
  assert.equal(first.status, 0, first.stderr);
  const receipt = parseJson(first.stdout);
  assert.equal(receipt.action, "db-init");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.enabled_before, false);
  assert.equal(receipt.enabled_after, true);
  assert.equal(receipt.runtime_database_created, false);
  assert.equal(receipt.config_updated, true);
  for (const relativePath of [
    ".mdkg/db/schema",
    ".mdkg/db/schema/migrations",
    ".mdkg/db/runtime",
    ".mdkg/db/state",
    ".mdkg/db/receipts",
    ".mdkg/db/project-db.json",
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite")), false);
  const config = readConfig(root);
  assert.equal(config.db.enabled, true);
  assert.equal(config.db.runtime_path, ".mdkg/db/runtime/project.sqlite");
  const manifest = parseJson(fs.readFileSync(path.join(root, ".mdkg", "db", "project-db.json"), "utf8"));
  assert.equal(manifest.kind, "project_db");
  assert.equal(manifest.enabled, true);
  assert.equal(manifest.runtime_database_created, false);

  const second = runCli(root, ["db", "init", "--json"]);
  assert.equal(second.status, 0, second.stderr);
  const repeated = parseJson(second.stdout);
  assert.equal(repeated.enabled_before, true);
  assert.equal(repeated.config_updated, false);
  assert.deepEqual(repeated.created, []);
  assert.deepEqual(repeated.updated, []);
  assert.equal(repeated.unchanged.includes(".mdkg/db/project-db.json"), true);
});

test("db init honors custom contained project db root defaults", () => {
  const root = makeRoot("mdkg-db-init-custom-");
  const config = readConfig(root);
  config.db = {
    enabled: false,
    schema_version: 1,
    root_path: ".project-db",
    migration_table: "mdkg_schema_migration",
  };
  writeConfig(root, config);

  const result = runCli(root, ["db", "init", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = parseJson(result.stdout);
  assert.equal(payload.paths.root, ".project-db");
  assert.equal(payload.paths.runtime_path, ".project-db/runtime/project.sqlite");
  assert.equal(fs.existsSync(path.join(root, ".project-db", "schema", "migrations")), true);
  assert.equal(fs.existsSync(path.join(root, ".project-db", "runtime", "project.sqlite")), false);
  const updatedConfig = readConfig(root);
  assert.equal(updatedConfig.db.enabled, true);
  assert.equal(updatedConfig.db.schema_path, ".project-db/schema");
  assert.equal(updatedConfig.db.runtime_path, ".project-db/runtime/project.sqlite");
});

test("db init rejects invalid existing project db filesystem state", () => {
  const root = makeRoot("mdkg-db-init-invalid-");
  fs.mkdirSync(path.join(root, ".mdkg", "db"), { recursive: true });
  fs.writeFileSync(path.join(root, ".mdkg", "db", "schema"), "not a directory", "utf8");

  const result = runCli(root, ["db", "init", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /\.mdkg\/db\/schema exists and is not a directory/);
});

test("db migrate applies generic foundation migration and is idempotent", () => {
  const root = makeRoot("mdkg-db-migrate-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);

  const first = runCli(root, ["db", "migrate", "--json"]);
  assert.equal(first.status, 0, first.stderr);
  const receipt = parseJson(first.stdout);
  assert.equal(receipt.action, "db-migrate");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.database, ".mdkg/db/runtime/project.sqlite");
  assert.equal(receipt.migration_table, "mdkg_schema_migration");
  assert.equal(receipt.applied_count, 5);
  assert.equal(receipt.skipped_count, 0);
  assert.equal(receipt.migrations[0].key, "mdkg.project_db.foundation.v1");
  assert.equal(receipt.migrations[0].status, "applied");
  assert.equal(receipt.migrations[1].key, "mdkg.project_db.queue.v1");
  assert.equal(receipt.migrations[1].status, "applied");
  assert.equal(receipt.migrations[2].key, "mdkg.project_db.events_receipts.v1");
  assert.equal(receipt.migrations[2].status, "applied");
  assert.equal(receipt.migrations[3].key, "mdkg.project_db.writer_leases.v1");
  assert.equal(receipt.migrations[3].status, "applied");
  assert.equal(receipt.migrations[4].key, "mdkg.project_db.queue_control.v1");
  assert.equal(receipt.migrations[4].status, "applied");
  assert.equal(receipt.migration_files.created[0], ".mdkg/db/schema/migrations/001_mdkg_project_db_foundation.sql");
  assert.equal(receipt.migration_files.created[1], ".mdkg/db/schema/migrations/002_mdkg_project_db_queue.sql");
  assert.equal(receipt.migration_files.created[2], ".mdkg/db/schema/migrations/003_mdkg_project_db_events_receipts.sql");
  assert.equal(receipt.migration_files.created[3], ".mdkg/db/schema/migrations/004_mdkg_project_db_writer_leases.sql");
  assert.equal(receipt.migration_files.created[4], ".mdkg/db/schema/migrations/005_mdkg_project_db_queue_control.sql");
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite")), true);

  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite"));
  try {
    assert.equal(
      db.prepare("SELECT value FROM project_meta WHERE key = 'tool'").get().value,
      "mdkg"
    );
    assert.equal(
      db.prepare("SELECT COUNT(*) AS count FROM mdkg_schema_migration").get().count,
      5
    );
    for (const tableName of [
      "project_queue_message",
      "project_queue",
      "project_event",
      "project_receipt",
      "project_branch_state",
      "project_writer_lease",
    ]) {
      assert.equal(
        db.prepare("SELECT COUNT(*) AS count FROM sqlite_schema WHERE type = 'table' AND name = ?").get(tableName).count,
        1,
        tableName
      );
    }
  } finally {
    db.close();
  }

  const second = runCli(root, ["db", "migrate", "--json"]);
  assert.equal(second.status, 0, second.stderr);
  const repeated = parseJson(second.stdout);
  assert.equal(repeated.applied_count, 0);
  assert.equal(repeated.skipped_count, 5);
  assert.equal(repeated.migrations[0].status, "already_applied");
  assert.equal(repeated.migrations[1].status, "already_applied");
  assert.equal(repeated.migrations[2].status, "already_applied");
  assert.equal(repeated.migrations[3].status, "already_applied");
  assert.equal(repeated.migrations[4].status, "already_applied");
  assert.deepEqual(repeated.migration_files.created, []);
});

test("db migrate rejects linked migration and runtime paths before outside writes", (t) => {
  const migrationRoot = makeRoot("mdkg-db-migrate-linked-dir-");
  const runtimeRoot = makeRoot("mdkg-db-migrate-linked-runtime-");
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-db-migrate-outside-"));
  assert.equal(runCli(migrationRoot, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(runtimeRoot, ["db", "init", "--json"]).status, 0);
  const migrationsDir = path.join(migrationRoot, ".mdkg", "db", "schema", "migrations");
  fs.rmSync(migrationsDir, { recursive: true, force: true });
  const outsideMigrations = path.join(outside, "migrations");
  fs.mkdirSync(outsideMigrations);
  const outsideRuntime = path.join(outside, "runtime.sqlite");
  fs.writeFileSync(outsideRuntime, "outside-runtime\n", "utf8");
  try {
    fs.symlinkSync(outsideMigrations, migrationsDir, "dir");
    fs.symlinkSync(outsideRuntime, path.join(runtimeRoot, ".mdkg", "db", "runtime", "project.sqlite"), "file");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM") {
      t.skip("symbolic links unavailable");
      return;
    }
    throw error;
  }

  const linkedMigrations = runCli(migrationRoot, ["db", "migrate", "--json"]);
  assert.notEqual(linkedMigrations.status, 0);
  assert.match(linkedMigrations.stderr, /linked ancestor|symbolic link/);
  assert.deepEqual(fs.readdirSync(outsideMigrations), []);

  const linkedRuntime = runCli(runtimeRoot, ["db", "migrate", "--json"]);
  assert.notEqual(linkedRuntime.status, 0);
  assert.match(linkedRuntime.stderr, /symbolic link/);
  assert.equal(fs.readFileSync(outsideRuntime, "utf8"), "outside-runtime\n");
  const verify = runCli(runtimeRoot, ["db", "verify", "--json"]);
  assert.notEqual(verify.status, 0);
  assert.match(verify.stdout, /not safely contained/);
});

test("project DB queue helpers handle dedupe leases retries dead-letter and stats", () => {
  const root = makeRoot("mdkg-db-queue-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  const databasePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");

  const first = enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-1",
    dedupe_key: "event-1",
    payload: { z: 1, a: 2 },
    max_attempts: 2,
    now_ms: 1000,
  });
  assert.equal(first.created, true);
  assert.equal(first.duplicate, false);
  assert.equal(first.message.status, "ready");
  assert.equal(first.message.payload_json, '{"a":2,"z":1}');
  assert.match(first.message.payload_hash, /^sha256:/);

  const duplicate = enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-duplicate",
    dedupe_key: "event-1",
    payload: { different: true },
    now_ms: 1001,
  });
  assert.equal(duplicate.created, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.message.message_id, "msg-1");

  enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-later",
    payload: { later: true },
    available_at_ms: 5000,
    now_ms: 1002,
  });

  const claimed = claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-1",
    lease_ms: 100,
    now_ms: 1100,
  });
  assert.equal(claimed?.message_id, "msg-1");
  assert.equal(claimed?.status, "leased");
  assert.equal(claimed?.lease_owner, "worker-1");

  assert.throws(
    () =>
      ackProjectQueueMessage(databasePath, {
        queue_name: "materialize",
        message_id: "msg-1",
        lease_owner: "wrong-worker",
        now_ms: 1101,
      }),
    /not leased by wrong-worker/
  );
  assert.throws(
    () =>
      failProjectQueueMessage(databasePath, {
        queue_name: "materialize",
        message_id: "msg-1",
        lease_owner: "wrong-worker",
        error: "wrong worker",
        now_ms: 1102,
      }),
    /not leased by wrong-worker/
  );

  const retried = failProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-1",
    lease_owner: "worker-1",
    error: "temporary failure",
    retry_after_ms: 50,
    now_ms: 1110,
  });
  assert.equal(retried.status, "ready");
  assert.equal(retried.attempt_count, 1);
  assert.equal(retried.available_at_ms, 1160);

  assert.equal(
    claimProjectQueueMessage(databasePath, {
      queue_name: "materialize",
      lease_owner: "worker-2",
      lease_ms: 100,
      now_ms: 1159,
    }),
    null
  );

  const reclaimed = claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-2",
    lease_ms: 100,
    now_ms: 1160,
  });
  assert.equal(reclaimed?.message_id, "msg-1");

  const deadLetter = failProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-1",
    lease_owner: "worker-2",
    error: "permanent failure",
    now_ms: 1170,
  });
  assert.equal(deadLetter.status, "dead_letter");
  assert.equal(deadLetter.attempt_count, 2);

  enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-2",
    payload: { ok: true },
    now_ms: 2000,
  });
  const leased = claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-3",
    lease_ms: 5,
    now_ms: 2000,
  });
  assert.equal(leased?.message_id, "msg-2");
  assert.equal(releaseExpiredProjectQueueLeases(databasePath, { queue_name: "materialize", now_ms: 2004 }).released_count, 0);
  assert.equal(releaseExpiredProjectQueueLeases(databasePath, { queue_name: "materialize", now_ms: 2006 }).released_count, 1);

  const expiredReclaim = claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-4",
    lease_ms: 100,
    now_ms: 2007,
  });
  assert.equal(expiredReclaim?.message_id, "msg-2");
  const acked = ackProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-2",
    lease_owner: "worker-4",
    now_ms: 2008,
  });
  assert.equal(acked.status, "acked");

  const later = claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-5",
    lease_ms: 100,
    now_ms: 5000,
  });
  assert.equal(later?.message_id, "msg-later");
  const laterAck = ackProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-later",
    lease_owner: "worker-5",
    now_ms: 5001,
  });
  assert.equal(laterAck.status, "acked");

  enqueueProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-explicit-dead-letter",
    payload: { stop: true },
    now_ms: 6000,
  });
  const explicitLease = claimProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    lease_owner: "worker-6",
    lease_ms: 100,
    now_ms: 6001,
  });
  assert.equal(explicitLease?.message_id, "msg-explicit-dead-letter");
  const explicitDeadLetter = deadLetterProjectQueueMessage(databasePath, {
    queue_name: "materialize",
    message_id: "msg-explicit-dead-letter",
    lease_owner: "worker-6",
    error: "manual terminal failure",
    now_ms: 6002,
  });
  assert.equal(explicitDeadLetter.status, "dead_letter");

  const stats = readProjectQueueStats(databasePath, { queue_name: "materialize", now_ms: 5002 });
  assert.equal(stats.total, 4);
  assert.equal(stats.by_status.acked, 2);
  assert.equal(stats.by_status.dead_letter, 2);
  assert.equal(stats.ready_available, 0);
  assert.equal(stats.leased_expired, 0);

  const dbStats = parseJson(runCli(root, ["db", "stats", "--json"]).stdout);
  assert.equal(dbStats.tables.some((table: any) => table.name === "project_queue_message"), true);
  assert.equal(dbStats.tables.some((table: any) => table.name === "project_queue"), true);

  assert.equal(readProjectQueue(databasePath, "materialize")?.status, "active");
  const pausedCreate = createProjectQueue(databasePath, {
    queue_name: "paused-work",
    paused: true,
    reason: "snapshot",
    now_ms: 7000,
  });
  assert.equal(pausedCreate.created, true);
  assert.equal(pausedCreate.queue.status, "paused");
  assert.equal(pausedCreate.queue.paused_reason, "snapshot");
  assert.throws(
    () =>
      enqueueProjectQueueMessage(databasePath, {
        queue_name: "paused-work",
        message_id: "paused-msg",
        payload: { paused: true },
        now_ms: 7001,
      }),
    /queue paused-work is paused; cannot enqueue/
  );
  const resumed = resumeProjectQueue(databasePath, { queue_name: "paused-work", now_ms: 7002 });
  assert.equal(resumed.status, "active");
  enqueueProjectQueueMessage(databasePath, {
    queue_name: "paused-work",
    message_id: "paused-msg",
    payload: { paused: false },
    now_ms: 7003,
  });
  const pausedClaim = claimProjectQueueMessage(databasePath, {
    queue_name: "paused-work",
    lease_owner: "settler",
    lease_ms: 100,
    now_ms: 7004,
  });
  assert.equal(pausedClaim?.status, "leased");
  assert.equal(pauseProjectQueue(databasePath, { queue_name: "paused-work", reason: "settle", now_ms: 7005 }).status, "paused");
  assert.throws(
    () =>
      claimProjectQueueMessage(databasePath, {
        queue_name: "paused-work",
        lease_owner: "blocked",
        lease_ms: 100,
        now_ms: 7006,
      }),
    /queue paused-work is paused; cannot claim/
  );
  const settled = ackProjectQueueMessage(databasePath, {
    queue_name: "paused-work",
    message_id: "paused-msg",
    lease_owner: "settler",
    now_ms: 7007,
  });
  assert.equal(settled.status, "acked");
  assert.equal(readProjectQueueMessage(databasePath, "paused-work", "paused-msg")?.status, "acked");
  assert.equal(listProjectQueueMessages(databasePath, { queue_name: "paused-work", status: "acked" }).length, 1);
  const queueSummary = readProjectQueueSnapshotSummary(databasePath);
  assert.equal(queueSummary.total, 5);
  assert.equal(queueSummary.leased, 0);
  assert.equal(queueSummary.active_ready, 0);
});

test("db queue CLI exposes public lifecycle and paused settlement behavior", () => {
  const root = makeRoot("mdkg-db-queue-cli-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);

  const created = runCli(root, ["db", "queue", "create", "work", "--json"]);
  assert.equal(created.status, 0, created.stderr);
  const createPayload = parseJson(created.stdout);
  assert.equal(createPayload.action, "db-queue-create");
  assert.equal(createPayload.created, true);
  assert.equal(createPayload.queue.status, "active");

  const enqueued = runCli(root, [
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
  ]);
  assert.equal(enqueued.status, 0, enqueued.stderr);
  assert.equal(parseJson(enqueued.stdout).message.payload_json, '{"a":1,"b":2}');

  const duplicate = runCli(root, [
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
  ]);
  assert.equal(duplicate.status, 0, duplicate.stderr);
  assert.equal(parseJson(duplicate.stdout).duplicate, true);
  assert.equal(parseJson(duplicate.stdout).message.message_id, "msg-1");

  const claimed = runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "worker-a", "--lease-ms", "100", "--json"]);
  assert.equal(claimed.status, 0, claimed.stderr);
  assert.equal(parseJson(claimed.stdout).message.status, "leased");

  const wrongAck = runCli(root, ["db", "queue", "ack", "work", "msg-1", "--lease-owner", "worker-b", "--json"]);
  assert.notEqual(wrongAck.status, 0);
  assert.match(wrongAck.stderr, /not leased by worker-b/);

  const retried = runCli(root, [
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
  ]);
  assert.equal(retried.status, 0, retried.stderr);
  assert.equal(parseJson(retried.stdout).message.status, "ready");

  const reclaimed = runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "worker-c", "--lease-ms", "100", "--json"]);
  assert.equal(reclaimed.status, 0, reclaimed.stderr);
  assert.equal(parseJson(reclaimed.stdout).message.message_id, "msg-1");
  const dead = runCli(root, [
    "db",
    "queue",
    "fail",
    "work",
    "msg-1",
    "--lease-owner",
    "worker-c",
    "--error",
    "terminal",
    "--json",
  ]);
  assert.equal(dead.status, 0, dead.stderr);
  assert.equal(parseJson(dead.stdout).message.status, "dead_letter");

  assert.equal(runCli(root, ["db", "queue", "enqueue", "work", "msg-2", "--payload-json", '{"ok":true}', "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "worker-d", "--lease-ms", "100", "--json"]).status, 0);
  const paused = runCli(root, ["db", "queue", "pause", "work", "--reason", "snapshot", "--json"]);
  assert.equal(paused.status, 0, paused.stderr);
  assert.equal(parseJson(paused.stdout).queue.status, "paused");

  const pausedEnqueue = runCli(root, ["db", "queue", "enqueue", "work", "msg-paused", "--payload-json", '{"blocked":true}', "--json"]);
  assert.notEqual(pausedEnqueue.status, 0);
  assert.match(pausedEnqueue.stderr, /queue work is paused; cannot enqueue/);
  const pausedClaim = runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "blocked", "--lease-ms", "100", "--json"]);
  assert.notEqual(pausedClaim.status, 0);
  assert.match(pausedClaim.stderr, /queue work is paused; cannot claim/);

  const ackWhilePaused = runCli(root, ["db", "queue", "ack", "work", "msg-2", "--lease-owner", "worker-d", "--json"]);
  assert.equal(ackWhilePaused.status, 0, ackWhilePaused.stderr);
  assert.equal(parseJson(ackWhilePaused.stdout).message.status, "acked");

  const resumed = runCli(root, ["db", "queue", "resume", "work", "--json"]);
  assert.equal(resumed.status, 0, resumed.stderr);
  assert.equal(parseJson(resumed.stdout).queue.status, "active");

  assert.equal(runCli(root, ["db", "queue", "enqueue", "work", "msg-expire", "--payload-json", '{"expire":true}', "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "worker-e", "--lease-ms", "1", "--json"]).status, 0);
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  const released = runCli(root, ["db", "queue", "release-expired", "work", "--json"]);
  assert.equal(released.status, 0, released.stderr);
  assert.equal(parseJson(released.stdout).released_count, 1);
  const expireClaim = runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "worker-f", "--lease-ms", "100", "--json"]);
  assert.equal(expireClaim.status, 0, expireClaim.stderr);
  assert.equal(parseJson(expireClaim.stdout).message.message_id, "msg-expire");
  const explicitDead = runCli(root, [
    "db",
    "queue",
    "dead-letter",
    "work",
    "msg-expire",
    "--lease-owner",
    "worker-f",
    "--error",
    "manual",
    "--json",
  ]);
  assert.equal(explicitDead.status, 0, explicitDead.stderr);
  assert.equal(parseJson(explicitDead.stdout).message.status, "dead_letter");

  const list = runCli(root, ["db", "queue", "list", "work", "--status", "dead_letter", "--json"]);
  assert.equal(list.status, 0, list.stderr);
  assert.equal(parseJson(list.stdout).count, 2);
  const show = runCli(root, ["db", "queue", "show", "work", "msg-1", "--json"]);
  assert.equal(show.status, 0, show.stderr);
  assert.equal(parseJson(show.stdout).message.message_id, "msg-1");
  const stats = runCli(root, ["db", "queue", "stats", "work", "--json"]);
  assert.equal(stats.status, 0, stats.stderr);
  assert.equal(parseJson(stats.stdout).stats.by_status.acked, 1);
  assert.equal(parseJson(stats.stdout).stats.by_status.dead_letter, 2);
});

test("project DB events receipts reducers and writer leases handle idempotency replay and CAS", () => {
  const root = makeRoot("mdkg-db-events-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  const databasePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");

  const first = recordProjectDbEvent(databasePath, {
    event_id: "event-1",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-1",
    payload: { value: "applied", key: "event.reducer.test" },
    actor: "tester",
    now_ms: 1000,
  });
  assert.equal(first.created, true);
  assert.equal(first.duplicate, false);
  assert.equal(first.conflict, false);
  assert.equal(first.event?.payload_json, '{"key":"event.reducer.test","value":"applied"}');

  const duplicate = recordProjectDbEvent(databasePath, {
    event_id: "event-duplicate",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-1",
    payload: { key: "event.reducer.test", value: "applied" },
    actor: "tester",
    now_ms: 1001,
  });
  assert.equal(duplicate.created, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.event?.event_id, "event-1");

  const conflict = recordProjectDbEvent(databasePath, {
    event_id: "event-conflict",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-1",
    payload: { key: "event.reducer.test", value: "conflict" },
    actor: "tester",
    now_ms: 1002,
  });
  assert.equal(conflict.created, false);
  assert.equal(conflict.conflict, true);
  assert.equal(conflict.receipt?.status, "conflict");
  assert.ok(conflict.receipt?.artifact_path);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "db", conflict.receipt.artifact_path)), true);

  const applied = applyProjectDbReducer(databasePath, {
    event_id: "event-1",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    actor: "tester",
    now_ms: 1100,
  });
  assert.equal(applied.applied, true);
  assert.equal(applied.event.status, "applied");
  assert.equal(applied.receipt.status, "applied");

  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(databasePath);
  try {
    assert.equal(db.prepare("SELECT value FROM project_meta WHERE key = ?").get("event.reducer.test").value, "applied");
    db.prepare("UPDATE project_meta SET value = ? WHERE key = ?").run("stale", "event.reducer.test");
  } finally {
    db.close();
  }

  const replay = replayProjectDbEvents(databasePath, {
    project_id: "project",
    branch_id: "main",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    actor: "tester",
    now_ms: 1200,
  });
  assert.equal(replay.replayed_count, 1);
  assert.equal(replay.receipt.status, "replay");

  const replayDb = new DatabaseSync(databasePath);
  try {
    assert.equal(replayDb.prepare("SELECT value FROM project_meta WHERE key = ?").get("event.reducer.test").value, "applied");
  } finally {
    replayDb.close();
  }

  recordProjectDbEvent(databasePath, {
    event_id: "event-invalid",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "idem-invalid",
    payload: { key: "missing-value" },
    actor: "tester",
    now_ms: 1300,
  });
  const rejected = applyProjectDbReducer(databasePath, {
    event_id: "event-invalid",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    actor: "tester",
    now_ms: 1301,
  });
  assert.equal(rejected.applied, false);
  assert.equal(rejected.event.status, "rejected");
  assert.equal(rejected.receipt.status, "rejected");

  const lease1 = acquireProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-1",
    lease_owner: "worker-1",
    base_snapshot_hash: "sha256:base",
    lease_ms: 100,
    now_ms: 2000,
  });
  assert.equal(lease1.status, "active");
  assert.throws(
    () =>
      commitProjectWriterLease(databasePath, {
        project_id: "project",
        branch_id: "main",
        lease_id: "lease-1",
        lease_owner: "wrong-worker",
        result_snapshot_hash: "sha256:wrong",
        now_ms: 2001,
      }),
    /not owned by wrong-worker/
  );
  const commit1 = commitProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-1",
    lease_owner: "worker-1",
    result_snapshot_hash: "sha256:one",
    now_ms: 2010,
  });
  assert.equal(commit1.committed, true);
  assert.equal(commit1.lease.status, "committed");
  assert.equal(commit1.receipt.status, "applied");

  acquireProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-2",
    lease_owner: "worker-2",
    base_snapshot_hash: "sha256:base",
    lease_ms: 100,
    now_ms: 2020,
  });
  const conflictCommit = commitProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-2",
    lease_owner: "worker-2",
    result_snapshot_hash: "sha256:two",
    now_ms: 2030,
  });
  assert.equal(conflictCommit.committed, false);
  assert.equal(conflictCommit.lease.status, "conflict");
  assert.equal(conflictCommit.receipt.status, "conflict");

  acquireProjectWriterLease(databasePath, {
    project_id: "project",
    branch_id: "main",
    lease_id: "lease-3",
    lease_owner: "worker-3",
    base_snapshot_hash: "sha256:one",
    lease_ms: 5,
    now_ms: 3000,
  });
  assert.equal(releaseExpiredProjectWriterLeases(databasePath, { now_ms: 3004 }).released_count, 0);
  assert.equal(releaseExpiredProjectWriterLeases(databasePath, { now_ms: 3006 }).released_count, 1);
  const leaseStats = readProjectWriterLeaseStats(databasePath, { now_ms: 3007 });
  assert.equal(leaseStats.by_status.committed, 1);
  assert.equal(leaseStats.by_status.conflict, 1);
  assert.equal(leaseStats.by_status.expired, 1);

  const dbStats = parseJson(runCli(root, ["db", "stats", "--json"]).stdout);
  assert.equal(dbStats.receipt_files.count >= 5, true);
  for (const tableName of ["project_event", "project_receipt", "project_branch_state", "project_writer_lease"]) {
    assert.equal(dbStats.tables.some((table: any) => table.name === tableName), true, tableName);
  }
});

test("project DB materializer helper processes queue messages through reducers leases and snapshots", () => {
  const root = makeRoot("mdkg-db-materializer-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  const databasePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");

  recordProjectDbEvent(databasePath, {
    event_id: "event-1",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "materializer-1",
    payload: { key: "materializer.test", value: "applied" },
    actor: "tester",
    now_ms: 1000,
  });
  const enqueued = enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-msg-1",
    project_id: "project",
    branch_id: "main",
    event_id: "event-1",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 2,
    now_ms: 1001,
  });
  assert.equal(enqueued.created, true);
  const duplicateEnqueue = enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-msg-duplicate",
    project_id: "project",
    branch_id: "main",
    event_id: "event-1",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    now_ms: 1002,
  });
  assert.equal(duplicateEnqueue.duplicate, true);
  assert.equal(duplicateEnqueue.message.message_id, "materializer-msg-1");

  const applied = runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-1",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1010,
  });
  assert.equal(applied.status, "applied");
  assert.equal(applied.queue_message?.status, "acked");
  assert.equal(applied.reducer?.applied, true);
  assert.equal(applied.lease?.status, "committed");
  assert.equal(applied.snapshot?.ok, true);
  const snapshotVerify = parseJson(runCli(root, ["db", "snapshot", "verify", "--json"]).stdout);
  assert.equal(snapshotVerify.ok, true);
  assert.equal(snapshotVerify.status, "valid");

  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(databasePath);
  try {
    assert.equal(db.prepare("SELECT value FROM project_meta WHERE key = ?").get("materializer.test").value, "applied");
  } finally {
    db.close();
  }

  enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-msg-2",
    dedupe_key: "materializer-duplicate-second-delivery",
    project_id: "project",
    branch_id: "main",
    event_id: "event-1",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 2,
    now_ms: 1020,
  });
  const duplicate = runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-2",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1021,
  });
  assert.equal(duplicate.status, "duplicate");
  assert.equal(duplicate.queue_message?.status, "acked");
  assert.equal(duplicate.reducer?.receipt.status, "duplicate");

  enqueueProjectQueueMessage(databasePath, {
    queue_name: PROJECT_DB_MATERIALIZER_QUEUE,
    message_id: "materializer-invalid",
    payload: { kind: "not-materializer" },
    max_attempts: 3,
    now_ms: 1030,
  });
  const invalid = runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-invalid",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1031,
  });
  assert.equal(invalid.status, "dead_letter");
  assert.equal(invalid.queue_message?.status, "dead_letter");
  assert.equal(invalid.receipt?.status, "rejected");

  enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-missing-event",
    project_id: "project",
    branch_id: "main",
    event_id: "event-missing",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 1,
    now_ms: 1040,
  });
  const missing = runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-missing",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1041,
  });
  assert.equal(missing.status, "dead_letter");
  assert.equal(missing.queue_message?.status, "dead_letter");
  assert.match(missing.error ?? "", /event-missing/);

  recordProjectDbEvent(databasePath, {
    event_id: "event-cross-scope",
    project_id: "other-project",
    branch_id: "other-branch",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "materializer-cross-scope",
    payload: { key: "materializer.cross-scope", value: "must-not-apply" },
    actor: "tester",
    now_ms: 1042,
  });
  enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-cross-scope",
    project_id: "project",
    branch_id: "main",
    event_id: "event-cross-scope",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 1,
    now_ms: 1043,
  });
  const crossScope = runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-cross-scope",
    lease_ms: 100,
    repo_root: root,
    now_ms: 1044,
  });
  assert.equal(crossScope.status, "dead_letter");
  assert.match(crossScope.error ?? "", /event scope mismatch/);
  const crossScopeDb = new DatabaseSync(databasePath);
  try {
    assert.equal(crossScopeDb.prepare("SELECT value FROM project_meta WHERE key = ?").get("materializer.cross-scope"), undefined);
  } finally {
    crossScopeDb.close();
  }

  recordProjectDbEvent(databasePath, {
    event_id: "event-2",
    project_id: "project",
    branch_id: "main",
    event_type: "project_meta.set",
    schema_version: 1,
    idempotency_key: "materializer-2",
    payload: { key: "materializer.conflict", value: "should-not-apply" },
    actor: "tester",
    now_ms: 1050,
  });
  enqueueProjectDbMaterialization(databasePath, {
    message_id: "materializer-conflict",
    project_id: "project",
    branch_id: "main",
    event_id: "event-2",
    reducer_name: "project_meta.set",
    reducer_version: "v1",
    max_attempts: 2,
    now_ms: 1051,
  });
  const conflict = runNextProjectDbMaterializer(databasePath, {
    lease_owner: "worker-conflict",
    lease_ms: 100,
    repo_root: root,
    base_snapshot_hash: "sha256:stale",
    now_ms: 1052,
  });
  assert.equal(conflict.status, "conflict");
  assert.equal(conflict.queue_message?.status, "ready");
  assert.equal(conflict.lease?.status, "conflict");
  assert.equal(conflict.receipt?.status, "conflict");
  const conflictDb = new DatabaseSync(databasePath);
  try {
    assert.equal(conflictDb.prepare("SELECT value FROM project_meta WHERE key = ?").get("materializer.conflict"), undefined);
  } finally {
    conflictDb.close();
  }

  const materializerStats = readProjectDbMaterializerStats(databasePath, { now_ms: 1060 });
  assert.equal(materializerStats.queue.total, 6);
  assert.equal(materializerStats.queue.by_status.acked, 2);
  assert.equal(materializerStats.queue.by_status.dead_letter, 3);
  assert.equal(materializerStats.queue.by_status.ready, 1);
  assert.equal(materializerStats.writer_leases.by_status.committed >= 2, true);
  assert.equal(materializerStats.writer_leases.by_status.conflict >= 1, true);
});

test("db migrate fails on disabled config missing dirs corrupt db and checksum drift", () => {
  const disabledRoot = makeRoot("mdkg-db-migrate-disabled-");
  const disabled = runCli(disabledRoot, ["db", "migrate", "--json"]);
  assert.notEqual(disabled.status, 0);
  assert.match(disabled.stderr, /project db is disabled; run mdkg db init first/);

  const missingRoot = makeRoot("mdkg-db-migrate-missing-");
  assert.equal(runCli(missingRoot, ["db", "init", "--json"]).status, 0);
  fs.rmSync(path.join(missingRoot, ".mdkg", "db", "schema"), { recursive: true, force: true });
  const missing = runCli(missingRoot, ["db", "migrate", "--json"]);
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /project db schema directory missing/);

  const corruptRoot = makeRoot("mdkg-db-migrate-corrupt-");
  assert.equal(runCli(corruptRoot, ["db", "init", "--json"]).status, 0);
  fs.writeFileSync(path.join(corruptRoot, ".mdkg", "db", "runtime", "project.sqlite"), "not sqlite", "utf8");
  const corrupt = runCli(corruptRoot, ["db", "migrate", "--json"]);
  assert.notEqual(corrupt.status, 0);
  assert.match(corrupt.stderr, /project DB migration failed|file is not a database/);

  const fileDriftRoot = makeRoot("mdkg-db-migrate-file-drift-");
  assert.equal(runCli(fileDriftRoot, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(fileDriftRoot, ["db", "migrate", "--json"]).status, 0);
  fs.appendFileSync(
    path.join(fileDriftRoot, ".mdkg", "db", "schema", "migrations", "001_mdkg_project_db_foundation.sql"),
    "\n-- drift\n",
    "utf8"
  );
  const fileDrift = runCli(fileDriftRoot, ["db", "migrate", "--json"]);
  assert.notEqual(fileDrift.status, 0);
  assert.match(fileDrift.stderr, /migration file checksum drift/);

  const dbDriftRoot = makeRoot("mdkg-db-migrate-db-drift-");
  assert.equal(runCli(dbDriftRoot, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(dbDriftRoot, ["db", "migrate", "--json"]).status, 0);
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(dbDriftRoot, ".mdkg", "db", "runtime", "project.sqlite"));
  try {
    db.prepare("UPDATE mdkg_schema_migration SET checksum = ? WHERE migration_key = ?")
      .run("sha256:drift", "mdkg.project_db.foundation.v1");
  } finally {
    db.close();
  }
  const dbDrift = runCli(dbDriftRoot, ["db", "migrate", "--json"]);
  assert.notEqual(dbDrift.status, 0);
  assert.match(dbDrift.stderr, /migration checksum drift/);
});

test("db verify and stats report valid project db state and transient warnings", () => {
  const root = makeRoot("mdkg-db-verify-stats-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);

  const verify = runCli(root, ["db", "verify", "--json"]);
  assert.equal(verify.status, 0, verify.stderr);
  const verifyPayload = parseJson(verify.stdout);
  assert.equal(verifyPayload.action, "db-verify");
  assert.equal(verifyPayload.ok, true);
  assert.equal(verifyPayload.failure_count, 0);
  assert.equal(verifyPayload.checks.some((check: any) => check.name === "migrations" && check.ok), true);

  const stats = runCli(root, ["db", "stats", "--json"]);
  assert.equal(stats.status, 0, stats.stderr);
  const statsPayload = parseJson(stats.stdout);
  assert.equal(statsPayload.action, "db-stats");
  assert.equal(statsPayload.ok, true);
  assert.equal(statsPayload.migration_count, 5);
  assert.equal(statsPayload.latest_migration.key, "mdkg.project_db.queue_control.v1");
  assert.equal(statsPayload.tables.some((table: any) => table.name === "project_meta"), true);
  assert.equal(statsPayload.tables.some((table: any) => table.name === "mdkg_schema_migration"), true);
  assert.equal(statsPayload.tables.some((table: any) => table.name === "project_queue_message"), true);
  assert.equal(statsPayload.tables.some((table: any) => table.name === "project_queue"), true);
  assert.equal(statsPayload.tables.some((table: any) => table.name === "project_event"), true);
  assert.equal(statsPayload.tables.some((table: any) => table.name === "project_receipt"), true);
  assert.equal(statsPayload.tables.some((table: any) => table.name === "project_writer_lease"), true);
  assert.equal(statsPayload.receipt_files.count, 0);

  fs.writeFileSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite-wal"), "", "utf8");
  const walVerify = runCli(root, ["db", "verify", "--json"]);
  assert.equal(walVerify.status, 0, walVerify.stderr);
  const walPayload = parseJson(walVerify.stdout);
  assert.equal(walPayload.ok, true);
  assert.match(walPayload.warnings.join("\n"), /project\.sqlite-wal/);

  const walStats = parseJson(runCli(root, ["db", "stats", "--json"]).stdout);
  assert.equal(walStats.transient_files.some((item: any) => item.path.endsWith("project.sqlite-wal")), true);
});

test("db verify and stats fail for disabled missing corrupt and migration drift states", () => {
  const disabledRoot = makeRoot("mdkg-db-verify-disabled-");
  const disabledVerify = runCli(disabledRoot, ["db", "verify", "--json"]);
  assert.notEqual(disabledVerify.status, 0);
  assert.equal(parseJson(disabledVerify.stdout).ok, false);
  assert.match(disabledVerify.stderr, /db verify failed/);

  const missingRoot = makeRoot("mdkg-db-verify-missing-");
  assert.equal(runCli(missingRoot, ["db", "init", "--json"]).status, 0);
  const missingVerify = runCli(missingRoot, ["db", "verify", "--json"]);
  assert.notEqual(missingVerify.status, 0);
  assert.match(parseJson(missingVerify.stdout).errors.join("\n"), /project\.sqlite missing; run mdkg db migrate/);
  const missingStats = runCli(missingRoot, ["db", "stats", "--json"]);
  assert.notEqual(missingStats.status, 0);
  assert.match(missingStats.stderr, /db stats requires a valid project DB/);

  const corruptRoot = makeRoot("mdkg-db-verify-corrupt-");
  assert.equal(runCli(corruptRoot, ["db", "init", "--json"]).status, 0);
  fs.writeFileSync(path.join(corruptRoot, ".mdkg", "db", "runtime", "project.sqlite"), "not sqlite", "utf8");
  const corruptVerify = runCli(corruptRoot, ["db", "verify", "--json"]);
  assert.notEqual(corruptVerify.status, 0);
  assert.match(parseJson(corruptVerify.stdout).errors.join("\n"), /failed to open project DB|failed to read project DB/);

  const driftRoot = makeRoot("mdkg-db-verify-drift-");
  assert.equal(runCli(driftRoot, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(driftRoot, ["db", "migrate", "--json"]).status, 0);
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(driftRoot, ".mdkg", "db", "runtime", "project.sqlite"));
  try {
    db.prepare("UPDATE mdkg_schema_migration SET checksum = ? WHERE migration_key = ?")
      .run("sha256:drift", "mdkg.project_db.foundation.v1");
  } finally {
    db.close();
  }
  const driftVerify = runCli(driftRoot, ["db", "verify", "--json"]);
  assert.notEqual(driftVerify.status, 0);
  assert.match(parseJson(driftVerify.stdout).errors.join("\n"), /migration checksum drift/);
});

test("db index status reports and verify fails for missing and stale caches", () => {
  const root = makeRoot("mdkg-db-index-stale-");
  assert.equal(runCli(root, ["db", "index", "rebuild"]).status, 0);

  fs.rmSync(path.join(root, ".mdkg", "index", "capabilities.json"));
  const missingStatus = runCli(root, ["db", "index", "status", "--json"]);
  assert.equal(missingStatus.status, 0, missingStatus.stderr);
  const missingStatusPayload = parseJson(missingStatus.stdout);
  assert.equal(missingStatusPayload.ok, false);
  assert.match(missingStatusPayload.errors.join("\n"), /capabilities: cache file missing/);

  const missingVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(missingVerify.status, 0);
  const missingVerifyPayload = parseJson(missingVerify.stdout);
  assert.equal(missingVerifyPayload.ok, false);
  assert.match(missingVerify.stderr, /db index verify failed/);

  assert.equal(runCli(root, ["db", "index", "rebuild"]).status, 0);
  fs.appendFileSync(path.join(root, ".mdkg", "work", "task-1.md"), "\nStale marker.\n", "utf8");

  const staleVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(staleVerify.status, 0);
  const stalePayload = parseJson(staleVerify.stdout);
  assert.equal(stalePayload.ok, false);
  assert.match(stalePayload.warnings.join("\n"), /cache is stale/);
});

test("db index rebuild restores missing sqlite cache and verify detects corrupt sqlite", () => {
  const root = makeRoot("mdkg-db-index-sqlite-");
  const config = readConfig(root);
  config.index.backend = "sqlite";
  writeConfig(root, config);

  const rebuild = runCli(root, ["db", "index", "rebuild", "--json"]);
  assert.equal(rebuild.status, 0, rebuild.stderr);
  const rebuilt = parseJson(rebuild.stdout);
  assert.equal(rebuilt.backend, "sqlite");
  assert.equal(rebuilt.paths.sqlite, ".mdkg/index/mdkg.sqlite");
  const sqlitePath = path.join(root, ".mdkg", "index", "mdkg.sqlite");
  assert.equal(fs.existsSync(sqlitePath), true);

  fs.rmSync(sqlitePath);
  const missingVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(missingVerify.status, 0);
  assert.match(parseJson(missingVerify.stdout).errors.join("\n"), /sqlite: SQLite cache missing/);

  assert.equal(runCli(root, ["db", "index", "rebuild"]).status, 0);
  assert.equal(fs.existsSync(sqlitePath), true);
  assert.equal(runCli(root, ["db", "index", "verify"]).status, 0);

  fs.writeFileSync(sqlitePath, "not a sqlite database", "utf8");
  const corruptVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(corruptVerify.status, 0);
  assert.match(parseJson(corruptVerify.stdout).errors.join("\n"), /failed to read SQLite cache|file is not a database/);
});

test("db snapshot seal verify status dump and diff work", () => {
  const root = makeRoot("mdkg-db-snapshot-lifecycle-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);

  const missingVerify = runCli(root, ["db", "snapshot", "verify", "--json"]);
  assert.notEqual(missingVerify.status, 0);
  assert.equal(parseJson(missingVerify.stdout).status, "missing");

  const missingStatus = runCli(root, ["db", "snapshot", "status", "--json"]);
  assert.equal(missingStatus.status, 0, missingStatus.stderr);
  assert.equal(parseJson(missingStatus.stdout).status, "missing");

  const missingSeal = runCli(root, ["db", "snapshot", "seal", "--json"]);
  assert.notEqual(missingSeal.status, 0);
  assert.match(missingSeal.stderr, /db snapshot seal requires a valid project DB/);

  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  const firstSeal = runCli(root, ["db", "snapshot", "seal", "--json"]);
  assert.equal(firstSeal.status, 0, firstSeal.stderr);
  const firstSealPayload = parseJson(firstSeal.stdout);
  assert.equal(firstSealPayload.action, "db-snapshot-seal");
  assert.equal(firstSealPayload.snapshot, ".mdkg/db/state/project.sqlite");
  assert.equal(firstSealPayload.manifest, ".mdkg/db/state/project.manifest.json");
  assert.equal(firstSealPayload.old_snapshot_sha256, null);
  assert.equal(firstSealPayload.table_counts.some((table: any) => table.name === "project_meta"), true);
  const snapshotPath = path.join(root, ".mdkg", "db", "state", "project.sqlite");
  const manifestPath = path.join(root, ".mdkg", "db", "state", "project.manifest.json");
  assert.equal(fs.existsSync(snapshotPath), true);
  assert.equal(fs.existsSync(manifestPath), true);

  const verify = runCli(root, ["db", "snapshot", "verify", "--json"]);
  assert.equal(verify.status, 0, verify.stderr);
  const verifyPayload = parseJson(verify.stdout);
  assert.equal(verifyPayload.status, "valid");
  assert.equal(verifyPayload.checks.every((check: any) => !String(check.path ?? "").startsWith(root)), true);

  const dump = runCli(root, ["db", "snapshot", "dump", "--output", ".mdkg/db/state/project.dump.txt", "--json"]);
  assert.equal(dump.status, 0, dump.stderr);
  const dumpPayload = parseJson(dump.stdout);
  assert.equal(dumpPayload.action, "db-snapshot-dump");
  assert.equal(dumpPayload.output, ".mdkg/db/state/project.dump.txt");
  const dumpText = fs.readFileSync(path.join(root, ".mdkg", "db", "state", "project.dump.txt"), "utf8");
  assert.match(dumpText, /# mdkg project db canonical dump v1/);
  assert.match(dumpText, /table project_meta/);

  const firstSnapshotCopy = path.join(root, ".mdkg", "db", "state", "first.sqlite");
  fs.copyFileSync(snapshotPath, firstSnapshotCopy);
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite"));
  try {
    db.exec("CREATE TABLE fixture_item (id TEXT PRIMARY KEY, name TEXT NOT NULL, payload BLOB) STRICT;");
    db.prepare("INSERT INTO fixture_item (id, name, payload) VALUES (?, ?, ?)")
      .run("fixture-1", "Changed", Buffer.from("payload"));
  } finally {
    db.close();
  }

  const staleStatus = runCli(root, ["db", "snapshot", "status", "--json"]);
  assert.equal(staleStatus.status, 0, staleStatus.stderr);
  assert.equal(parseJson(staleStatus.stdout).status, "stale");

  const secondSeal = runCli(root, ["db", "snapshot", "seal", "--json"]);
  assert.equal(secondSeal.status, 0, secondSeal.stderr);
  assert.notEqual(parseJson(secondSeal.stdout).old_snapshot_sha256, null);

  const currentDump = runCli(root, ["db", "snapshot", "dump"]);
  assert.equal(currentDump.status, 0, currentDump.stderr);
  assert.match(currentDump.stdout, /table fixture_item/);
  assert.match(currentDump.stdout, /blob_sha256/);

  const diff = runCli(root, ["db", "snapshot", "diff", ".mdkg/db/state/first.sqlite", ".mdkg/db/state/project.sqlite", "--json"]);
  assert.equal(diff.status, 0, diff.stderr);
  const diffPayload = parseJson(diff.stdout);
  assert.equal(diffPayload.action, "db-snapshot-diff");
  assert.equal(diffPayload.changed_count > 0, true);
  assert.equal(diffPayload.added.some((line: string) => line.includes("fixture_item")), true);
});

test("db snapshot dump and diff reject linked inputs and output ancestry", (t) => {
  const root = makeRoot("mdkg-db-snapshot-linked-");
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-db-snapshot-outside-"));
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "snapshot", "seal", "--json"]).status, 0);
  const snapshot = path.join(root, ".mdkg", "db", "state", "project.sqlite");
  const outsideSnapshot = path.join(outside, "outside.sqlite");
  fs.copyFileSync(snapshot, outsideSnapshot);
  writeFile(path.join(outside, "sentinel.txt"), "outside\n");
  try {
    fs.symlinkSync(outsideSnapshot, path.join(root, ".mdkg", "db", "state", "linked.sqlite"), "file");
    fs.symlinkSync(outside, path.join(root, ".mdkg", "db", "state", "linked-output"), "dir");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM") {
      t.skip("symbolic links unavailable");
      return;
    }
    throw error;
  }

  const linkedDump = runCli(root, ["db", "snapshot", "dump", "--snapshot", ".mdkg/db/state/linked.sqlite", "--json"]);
  assert.notEqual(linkedDump.status, 0);
  assert.match(linkedDump.stderr, /symbolic link/);
  const linkedOutput = runCli(root, ["db", "snapshot", "dump", "--output", ".mdkg/db/state/linked-output/dump.txt", "--json"]);
  assert.notEqual(linkedOutput.status, 0);
  assert.match(linkedOutput.stderr, /linked ancestor/);
  const linkedDiff = runCli(root, ["db", "snapshot", "diff", ".mdkg/db/state/project.sqlite", ".mdkg/db/state/linked.sqlite", "--json"]);
  assert.notEqual(linkedDiff.status, 0);
  assert.match(linkedDiff.stderr, /symbolic link/);
  assert.equal(fs.readFileSync(path.join(outside, "sentinel.txt"), "utf8"), "outside\n");
  assert.equal(fs.existsSync(path.join(outside, "dump.txt")), false);
});

test("db snapshot seal enforces queue drain and paused policies", () => {
  const root = makeRoot("mdkg-db-snapshot-queue-policy-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "create", "work", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "enqueue", "work", "msg-1", "--payload-json", '{"ready":true}', "--json"]).status, 0);

  const activeDefault = runCli(root, ["db", "snapshot", "seal", "--json"]);
  assert.notEqual(activeDefault.status, 0);
  assert.match(activeDefault.stderr, /requires drained queues/);

  assert.equal(runCli(root, ["db", "queue", "pause", "work", "--reason", "snapshot", "--json"]).status, 0);
  const pausedSeal = runCli(root, ["db", "snapshot", "seal", "--queue-policy", "paused", "--json"]);
  assert.equal(pausedSeal.status, 0, pausedSeal.stderr);
  const pausedPayload = parseJson(pausedSeal.stdout);
  assert.equal(pausedPayload.queue_policy, "paused");
  assert.equal(pausedPayload.queue_summary.ready, 1);
  assert.equal(parseJson(runCli(root, ["db", "snapshot", "verify", "--json"]).stdout).status, "valid");

  assert.equal(runCli(root, ["db", "queue", "resume", "work", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "worker", "--lease-ms", "100", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "pause", "work", "--reason", "leased", "--json"]).status, 0);
  const leasedPaused = runCli(root, ["db", "snapshot", "seal", "--queue-policy", "paused", "--json"]);
  assert.notEqual(leasedPaused.status, 0);
  assert.match(leasedPaused.stderr, /requires no leased messages/);

  assert.equal(runCli(root, ["db", "queue", "ack", "work", "msg-1", "--lease-owner", "worker", "--json"]).status, 0);
  const drainedSeal = runCli(root, ["db", "snapshot", "seal", "--json"]);
  assert.equal(drainedSeal.status, 0, drainedSeal.stderr);
  const drainedPayload = parseJson(drainedSeal.stdout);
  assert.equal(drainedPayload.queue_policy, "drain");
  assert.equal(drainedPayload.queue_summary.ready, 0);
  assert.equal(drainedPayload.queue_summary.leased, 0);
});

test("db snapshot verify detects manifest drift and corrupt snapshots", () => {
  const root = makeRoot("mdkg-db-snapshot-invalid-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "snapshot", "seal", "--json"]).status, 0);
  const snapshotPath = path.join(root, ".mdkg", "db", "state", "project.sqlite");
  const manifestPath = path.join(root, ".mdkg", "db", "state", "project.manifest.json");

  const manifest = parseJson(fs.readFileSync(manifestPath, "utf8"));
  manifest.snapshot_sha256 = "sha256:drift";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const drift = runCli(root, ["db", "snapshot", "verify", "--json"]);
  assert.notEqual(drift.status, 0);
  assert.match(parseJson(drift.stdout).errors.join("\n"), /snapshot hash mismatch/);

  fs.writeFileSync(snapshotPath, "not sqlite", "utf8");
  manifest.snapshot_sha256 = sha256File(snapshotPath);
  manifest.byte_size = fs.statSync(snapshotPath).size;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const corrupt = runCli(root, ["db", "snapshot", "verify", "--json"]);
  assert.notEqual(corrupt.status, 0);
  assert.match(parseJson(corrupt.stdout).errors.join("\n"), /snapshot SQLite integrity failed|file is not a database/);
});

test("snapshot verification requires runtime identity and validates queue policy from sealed bytes", () => {
  const root = makeRoot("mdkg-db-snapshot-proof-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "migrate", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "create", "work", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "enqueue", "work", "msg-1", "--payload-json", '{"ready":true}', "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "claim", "work", "--lease-owner", "worker", "--lease-ms", "100", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "queue", "ack", "work", "msg-1", "--lease-owner", "worker", "--json"]).status, 0);
  assert.equal(runCli(root, ["db", "snapshot", "seal", "--json"]).status, 0);

  const snapshotPath = path.join(root, ".mdkg", "db", "state", "project.sqlite");
  const manifestPath = path.join(root, ".mdkg", "db", "state", "project.manifest.json");
  const manifest = parseJson(fs.readFileSync(manifestPath, "utf8"));
  manifest.source_runtime_sha256 = null;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const missingSource = runCli(root, ["db", "snapshot", "verify", "--json"]);
  assert.notEqual(missingSource.status, 0);
  assert.match(parseJson(missingSource.stdout).errors.join("\n"), /source_runtime_sha256/);

  const { DatabaseSync } = require("node:sqlite");
  const snapshotDb = new DatabaseSync(snapshotPath);
  try {
    snapshotDb.prepare("UPDATE project_queue_message SET status = 'ready', available_at_ms = 0 WHERE queue_name = 'work' AND message_id = 'msg-1'").run();
  } finally {
    snapshotDb.close();
  }
  manifest.source_runtime_sha256 = sha256File(path.join(root, ".mdkg", "db", "runtime", "project.sqlite"));
  manifest.snapshot_sha256 = sha256File(snapshotPath);
  manifest.byte_size = fs.statSync(snapshotPath).size;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const queueDrift = runCli(root, ["db", "snapshot", "verify", "--json"]);
  assert.notEqual(queueDrift.status, 0);
  assert.match(parseJson(queueDrift.stdout).errors.join("\n"), /requires drained queues|queue summary/);
});
