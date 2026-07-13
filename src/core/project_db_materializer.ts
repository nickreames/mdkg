import crypto from "crypto";
import fs from "fs";
import path from "path";
import { loadConfig } from "./config";
import {
  ackProjectQueueMessage,
  claimProjectQueueMessage,
  deadLetterProjectQueueMessage,
  enqueueProjectQueueMessage,
  failProjectQueueMessage,
  ProjectQueueMessage,
  ProjectQueueStats,
  readProjectQueueStats,
  releaseExpiredProjectQueueLeases,
} from "./project_db_queue";
import {
  acquireProjectWriterLease,
  applyProjectDbReducer,
  commitProjectWriterLease,
  ProjectDbReceipt,
  ProjectDbWriterLease,
  readProjectWriterLeaseStats,
  releaseProjectWriterLease,
  writeProjectDbReceipt,
} from "./project_db_events";
import { ProjectDbSnapshotSealReceipt, sealProjectDbSnapshot } from "./project_db_snapshot";

type DatabaseSyncType = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: unknown[]): { changes?: number; lastInsertRowid?: number | bigint };
    get(...values: unknown[]): Record<string, unknown> | undefined;
    all(...values: unknown[]): Array<Record<string, unknown>>;
  };
  close(): void;
};

type DatabaseCtor = new (filename: string) => DatabaseSyncType;

export const PROJECT_DB_MATERIALIZER_QUEUE = "project-db.materialize";
export const PROJECT_DB_MATERIALIZER_KIND = "project-db.materialize";
export const PROJECT_DB_MATERIALIZER_SCHEMA_VERSION = 1;

export type ProjectDbMaterializerStatus =
  | "idle"
  | "applied"
  | "duplicate"
  | "rejected"
  | "conflict"
  | "retry"
  | "dead_letter";

export type ProjectDbMaterializerPayload = {
  kind: "project-db.materialize";
  schema_version: 1;
  project_id: string;
  branch_id: string;
  event_id: string;
  reducer_name: "project_meta.set";
  reducer_version: "v1";
};

export type EnqueueProjectDbMaterializationInput = {
  queue_name?: string;
  message_id: string;
  dedupe_key?: string | null;
  project_id: string;
  branch_id: string;
  event_id: string;
  reducer_name: "project_meta.set";
  reducer_version: "v1";
  available_at_ms?: number;
  max_attempts?: number;
  now_ms?: number;
};

export type RunNextProjectDbMaterializerInput = {
  queue_name?: string;
  lease_owner: string;
  lease_ms: number;
  repo_root?: string;
  base_snapshot_hash?: string;
  retry_after_ms?: number;
  now_ms?: number;
  receipts_path?: string;
};

export type ProjectDbMaterializerResult = {
  status: ProjectDbMaterializerStatus;
  queue_name: string;
  queue_message: ProjectQueueMessage | null;
  payload: ProjectDbMaterializerPayload | null;
  reducer: ReturnType<typeof applyProjectDbReducer> | null;
  lease: ProjectDbWriterLease | null;
  receipt: ProjectDbReceipt | null;
  snapshot: ProjectDbSnapshotSealReceipt | null;
  error: string | null;
};

export type ProjectDbMaterializerStats = {
  queue_name: string;
  queue: ProjectQueueStats;
  writer_leases: ReturnType<typeof readProjectWriterLeaseStats>;
};

function loadDatabaseCtor(): DatabaseCtor {
  try {
    const loaded = require("node:sqlite") as { DatabaseSync?: DatabaseCtor };
    if (!loaded.DatabaseSync) {
      throw new Error("node:sqlite DatabaseSync is unavailable");
    }
    return loaded.DatabaseSync;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`node:sqlite is required for mdkg project DB materializers: ${message}`);
  }
}

function nowMs(input?: number): number {
  if (input !== undefined) {
    assertInteger(input, "now_ms");
    return input;
  }
  return Date.now();
}

function assertNonEmpty(value: string, field: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} must be a non-empty string`);
  }
}

function assertInteger(value: number, field: string): void {
  if (!Number.isInteger(value)) {
    throw new Error(`${field} must be an integer`);
  }
}

function assertPositiveInteger(value: number, field: string): void {
  assertInteger(value, field);
  if (value <= 0) {
    throw new Error(`${field} must be greater than 0`);
  }
}

function sha256File(filePath: string): string {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "materializer";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(value: Record<string, unknown>, field: keyof ProjectDbMaterializerPayload): string {
  const raw = value[field];
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error(`materializer payload ${field} must be a non-empty string`);
  }
  return raw;
}

function parsePayload(payloadJson: string): ProjectDbMaterializerPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(payloadJson);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`materializer payload must be valid JSON: ${message}`);
  }
  if (!isObject(parsed)) {
    throw new Error("materializer payload must be an object");
  }
  if (parsed.kind !== PROJECT_DB_MATERIALIZER_KIND) {
    throw new Error(`materializer payload kind must be ${PROJECT_DB_MATERIALIZER_KIND}`);
  }
  if (parsed.schema_version !== PROJECT_DB_MATERIALIZER_SCHEMA_VERSION) {
    throw new Error(`materializer payload schema_version must be ${PROJECT_DB_MATERIALIZER_SCHEMA_VERSION}`);
  }
  const reducerName = stringField(parsed, "reducer_name");
  if (reducerName !== "project_meta.set") {
    throw new Error(`unsupported materializer reducer_name: ${reducerName}`);
  }
  const reducerVersion = stringField(parsed, "reducer_version");
  if (reducerVersion !== "v1") {
    throw new Error(`unsupported materializer reducer_version: ${reducerVersion}`);
  }
  return {
    kind: PROJECT_DB_MATERIALIZER_KIND,
    schema_version: PROJECT_DB_MATERIALIZER_SCHEMA_VERSION,
    project_id: stringField(parsed, "project_id"),
    branch_id: stringField(parsed, "branch_id"),
    event_id: stringField(parsed, "event_id"),
    reducer_name: reducerName,
    reducer_version: reducerVersion,
  };
}

function partialPayloadIds(payloadJson: string): { project_id: string; branch_id: string; event_id: string | null } {
  try {
    const parsed = JSON.parse(payloadJson);
    if (isObject(parsed)) {
      return {
        project_id: typeof parsed.project_id === "string" && parsed.project_id.trim() !== "" ? parsed.project_id : "unknown",
        branch_id: typeof parsed.branch_id === "string" && parsed.branch_id.trim() !== "" ? parsed.branch_id : "unknown",
        event_id: typeof parsed.event_id === "string" && parsed.event_id.trim() !== "" ? parsed.event_id : null,
      };
    }
  } catch {
    // fall through to unknown identifiers for rejected payload receipts
  }
  return { project_id: "unknown", branch_id: "unknown", event_id: null };
}

function findRepoRoot(databasePath: string, explicitRoot?: string): string {
  if (explicitRoot) {
    return path.resolve(explicitRoot);
  }
  let current = path.dirname(path.resolve(databasePath));
  while (true) {
    if (fs.existsSync(path.join(current, ".mdkg", "config.json"))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("repo_root is required when databasePath is not inside an mdkg repo");
    }
    current = parent;
  }
}

function withDb<T>(databasePath: string, fn: (db: DatabaseSyncType) => T): T {
  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(databasePath);
  try {
    db.exec("PRAGMA foreign_keys = ON;");
    return fn(db);
  } finally {
    db.close();
  }
}

function readBranchSnapshotHash(databasePath: string, projectId: string, branchId: string): string | null {
  return withDb(databasePath, (db) => {
    const row = db
      .prepare("SELECT current_snapshot_hash FROM project_branch_state WHERE project_id = ? AND branch_id = ?")
      .get(projectId, branchId);
    return row?.current_snapshot_hash === undefined || row.current_snapshot_hash === null
      ? null
      : String(row.current_snapshot_hash);
  });
}

function queueName(input?: string): string {
  if (input !== undefined) {
    assertNonEmpty(input, "queue_name");
    return input;
  }
  return PROJECT_DB_MATERIALIZER_QUEUE;
}

function result(input: {
  status: ProjectDbMaterializerStatus;
  queue_name: string;
  queue_message: ProjectQueueMessage | null;
  payload?: ProjectDbMaterializerPayload | null;
  reducer?: ReturnType<typeof applyProjectDbReducer> | null;
  lease?: ProjectDbWriterLease | null;
  receipt?: ProjectDbReceipt | null;
  snapshot?: ProjectDbSnapshotSealReceipt | null;
  error?: string | null;
}): ProjectDbMaterializerResult {
  return {
    status: input.status,
    queue_name: input.queue_name,
    queue_message: input.queue_message,
    payload: input.payload ?? null,
    reducer: input.reducer ?? null,
    lease: input.lease ?? null,
    receipt: input.receipt ?? null,
    snapshot: input.snapshot ?? null,
    error: input.error ?? null,
  };
}

function failStatus(message: ProjectQueueMessage, fallback: ProjectDbMaterializerStatus): ProjectDbMaterializerStatus {
  return message.status === "dead_letter" ? "dead_letter" : fallback;
}

function writeMaterializerReceipt(
  databasePath: string,
  input: {
    payload: ProjectDbMaterializerPayload | { project_id: string; branch_id: string; event_id: string | null };
    kind: string;
    status: "rejected" | "conflict" | "dead_letter";
    actor: string;
    message: ProjectQueueMessage;
    error: string;
    now_ms: number;
    receipts_path?: string;
  }
): ProjectDbReceipt {
  return writeProjectDbReceipt(databasePath, {
    project_id: input.payload.project_id,
    branch_id: input.payload.branch_id,
    kind: input.kind,
    status: input.status,
    event_id: input.payload.event_id,
    actor: input.actor,
    details: {
      message_id: input.message.message_id,
      queue_name: input.message.queue_name,
      error: input.error,
    },
    now_ms: input.now_ms,
    receipts_path: input.receipts_path,
  });
}

function tryReleaseWriterLease(
  databasePath: string,
  payload: ProjectDbMaterializerPayload,
  leaseId: string,
  leaseOwner: string,
  now: number,
  receiptsPath?: string
): void {
  try {
    releaseProjectWriterLease(databasePath, {
      project_id: payload.project_id,
      branch_id: payload.branch_id,
      lease_id: leaseId,
      lease_owner: leaseOwner,
      now_ms: now,
      receipts_path: receiptsPath,
    });
  } catch {
    // The lease may already be committed, conflicted, released, or absent.
  }
}

export function enqueueProjectDbMaterialization(
  databasePath: string,
  input: EnqueueProjectDbMaterializationInput
): ReturnType<typeof enqueueProjectQueueMessage> {
  assertNonEmpty(input.message_id, "message_id");
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.branch_id, "branch_id");
  assertNonEmpty(input.event_id, "event_id");
  const selectedQueue = queueName(input.queue_name);
  const payload: ProjectDbMaterializerPayload = {
    kind: PROJECT_DB_MATERIALIZER_KIND,
    schema_version: PROJECT_DB_MATERIALIZER_SCHEMA_VERSION,
    project_id: input.project_id,
    branch_id: input.branch_id,
    event_id: input.event_id,
    reducer_name: input.reducer_name,
    reducer_version: input.reducer_version,
  };
  return enqueueProjectQueueMessage(databasePath, {
    queue_name: selectedQueue,
    message_id: input.message_id,
    dedupe_key:
      input.dedupe_key === undefined
        ? `${input.project_id}:${input.branch_id}:${input.event_id}:${input.reducer_name}:${input.reducer_version}`
        : input.dedupe_key,
    payload,
    available_at_ms: input.available_at_ms,
    max_attempts: input.max_attempts,
    now_ms: input.now_ms,
  });
}

export function runNextProjectDbMaterializer(
  databasePath: string,
  input: RunNextProjectDbMaterializerInput
): ProjectDbMaterializerResult {
  assertNonEmpty(input.lease_owner, "lease_owner");
  assertPositiveInteger(input.lease_ms, "lease_ms");
  const selectedQueue = queueName(input.queue_name);
  const currentNow = nowMs(input.now_ms);
  const retryAfter = input.retry_after_ms ?? 0;
  assertInteger(retryAfter, "retry_after_ms");
  if (retryAfter < 0) {
    throw new Error("retry_after_ms must be greater than or equal to 0");
  }

  releaseExpiredProjectQueueLeases(databasePath, {
    queue_name: selectedQueue,
    now_ms: currentNow,
  });
  const claimed = claimProjectQueueMessage(databasePath, {
    queue_name: selectedQueue,
    lease_owner: input.lease_owner,
    lease_ms: input.lease_ms,
    now_ms: currentNow,
  });
  if (!claimed) {
    return result({ status: "idle", queue_name: selectedQueue, queue_message: null });
  }

  let payload: ProjectDbMaterializerPayload;
  try {
    payload = parsePayload(claimed.payload_json);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const partial = partialPayloadIds(claimed.payload_json);
    const receipt = writeMaterializerReceipt(databasePath, {
      payload: partial,
      kind: "materializer-invalid-payload",
      status: "rejected",
      actor: input.lease_owner,
      message: claimed,
      error,
      now_ms: currentNow,
      receipts_path: input.receipts_path,
    });
    const dead = deadLetterProjectQueueMessage(databasePath, {
      queue_name: selectedQueue,
      message_id: claimed.message_id,
      lease_owner: input.lease_owner,
      error,
      now_ms: currentNow,
    });
    return result({
      status: "dead_letter",
      queue_name: selectedQueue,
      queue_message: dead,
      receipt,
      error,
    });
  }

  const leaseId = `materializer-${safeSegment(claimed.message_id)}-${claimed.attempt_count}`;
  const currentBranchHash = readBranchSnapshotHash(databasePath, payload.project_id, payload.branch_id);
  const baseHash = input.base_snapshot_hash ?? currentBranchHash ?? sha256File(databasePath);
  let lease: ProjectDbWriterLease | null = null;

  try {
    lease = acquireProjectWriterLease(databasePath, {
      project_id: payload.project_id,
      branch_id: payload.branch_id,
      lease_id: leaseId,
      lease_owner: input.lease_owner,
      base_snapshot_hash: baseHash,
      lease_ms: input.lease_ms,
      now_ms: currentNow,
    });
    if (currentBranchHash && currentBranchHash !== baseHash) {
      const conflict = commitProjectWriterLease(databasePath, {
        project_id: payload.project_id,
        branch_id: payload.branch_id,
        lease_id: leaseId,
        lease_owner: input.lease_owner,
        result_snapshot_hash: sha256File(databasePath),
        now_ms: currentNow,
        receipts_path: input.receipts_path,
      });
      const failed = failProjectQueueMessage(databasePath, {
        queue_name: selectedQueue,
        message_id: claimed.message_id,
        lease_owner: input.lease_owner,
        error: `snapshot hash mismatch: current ${currentBranchHash}, base ${baseHash}`,
        retry_after_ms: retryAfter,
        now_ms: currentNow,
      });
      return result({
        status: failStatus(failed, "conflict"),
        queue_name: selectedQueue,
        queue_message: failed,
        payload,
        lease: conflict.lease,
        receipt: conflict.receipt,
        error: failed.last_error,
      });
    }

    const reducer = applyProjectDbReducer(databasePath, {
      event_id: payload.event_id,
      expected_project_id: payload.project_id,
      expected_branch_id: payload.branch_id,
      reducer_name: payload.reducer_name,
      reducer_version: payload.reducer_version,
      actor: input.lease_owner,
      now_ms: currentNow,
      receipts_path: input.receipts_path,
    });
    if (!reducer.applied && reducer.receipt.status === "rejected") {
      tryReleaseWriterLease(databasePath, payload, leaseId, input.lease_owner, currentNow, input.receipts_path);
      const failed = failProjectQueueMessage(databasePath, {
        queue_name: selectedQueue,
        message_id: claimed.message_id,
        lease_owner: input.lease_owner,
        error: reducer.receipt.details_json,
        retry_after_ms: retryAfter,
        now_ms: currentNow,
      });
      return result({
        status: failStatus(failed, "rejected"),
        queue_name: selectedQueue,
        queue_message: failed,
        payload,
        reducer,
        lease,
        receipt: reducer.receipt,
        error: failed.last_error,
      });
    }

    const commit = commitProjectWriterLease(databasePath, {
      project_id: payload.project_id,
      branch_id: payload.branch_id,
      lease_id: leaseId,
      lease_owner: input.lease_owner,
      result_snapshot_hash: sha256File(databasePath),
      now_ms: currentNow,
      receipts_path: input.receipts_path,
    });
    if (!commit.committed) {
      const failed = failProjectQueueMessage(databasePath, {
        queue_name: selectedQueue,
        message_id: claimed.message_id,
        lease_owner: input.lease_owner,
        error: commit.receipt.details_json,
        retry_after_ms: retryAfter,
        now_ms: currentNow,
      });
      return result({
        status: failStatus(failed, "conflict"),
        queue_name: selectedQueue,
        queue_message: failed,
        payload,
        reducer,
        lease: commit.lease,
        receipt: commit.receipt,
        error: failed.last_error,
      });
    }

    const acked = ackProjectQueueMessage(databasePath, {
      queue_name: selectedQueue,
      message_id: claimed.message_id,
      lease_owner: input.lease_owner,
      now_ms: currentNow,
    });
    const repoRoot = findRepoRoot(databasePath, input.repo_root);
    const config = loadConfig(repoRoot);
    const snapshot = sealProjectDbSnapshot(repoRoot, config);
    return result({
      status: reducer.applied ? "applied" : "duplicate",
      queue_name: selectedQueue,
      queue_message: acked,
      payload,
      reducer,
      lease: commit.lease,
      receipt: reducer.receipt,
      snapshot,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    if (lease) {
      tryReleaseWriterLease(databasePath, payload, leaseId, input.lease_owner, currentNow, input.receipts_path);
    }
    const receipt = writeMaterializerReceipt(databasePath, {
      payload,
      kind: "materializer-error",
      status: "rejected",
      actor: input.lease_owner,
      message: claimed,
      error,
      now_ms: currentNow,
      receipts_path: input.receipts_path,
    });
    const failed = failProjectQueueMessage(databasePath, {
      queue_name: selectedQueue,
      message_id: claimed.message_id,
      lease_owner: input.lease_owner,
      error,
      retry_after_ms: retryAfter,
      now_ms: currentNow,
    });
    return result({
      status: failStatus(failed, "retry"),
      queue_name: selectedQueue,
      queue_message: failed,
      payload,
      lease,
      receipt,
      error,
    });
  }
}

export function readProjectDbMaterializerStats(
  databasePath: string,
  input: { queue_name?: string; now_ms?: number } = {}
): ProjectDbMaterializerStats {
  const selectedQueue = queueName(input.queue_name);
  return {
    queue_name: selectedQueue,
    queue: readProjectQueueStats(databasePath, {
      queue_name: selectedQueue,
      now_ms: input.now_ms,
    }),
    writer_leases: readProjectWriterLeaseStats(databasePath, { now_ms: input.now_ms }),
  };
}
