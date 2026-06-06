import crypto from "crypto";
import fs from "fs";
import path from "path";

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

export type ProjectDbEventStatus = "received" | "validated" | "applied" | "rejected" | "dead_letter";
export type ProjectDbReceiptStatus = "applied" | "rejected" | "duplicate" | "conflict" | "replay" | "dead_letter";
export type ProjectDbWriterLeaseStatus = "active" | "committed" | "released" | "expired" | "conflict";

export type ProjectDbEvent = {
  event_id: string;
  project_id: string;
  branch_id: string;
  event_type: string;
  schema_version: number;
  idempotency_key: string;
  payload_json: string;
  payload_hash: string;
  actor: string;
  status: ProjectDbEventStatus;
  occurred_at_ms: number;
  created_at_ms: number;
  updated_at_ms: number;
  last_error: string | null;
};

export type ProjectDbReceipt = {
  receipt_id: string;
  project_id: string;
  branch_id: string;
  kind: string;
  status: ProjectDbReceiptStatus;
  event_id: string | null;
  idempotency_key: string | null;
  payload_hash: string | null;
  base_snapshot_hash: string | null;
  result_snapshot_hash: string | null;
  reducer_name: string | null;
  reducer_version: string | null;
  lease_id: string | null;
  actor: string | null;
  artifact_path: string;
  artifact_hash: string;
  details_json: string;
  created_at_ms: number;
};

export type ProjectDbWriterLease = {
  project_id: string;
  branch_id: string;
  lease_id: string;
  lease_owner: string;
  base_snapshot_hash: string;
  status: ProjectDbWriterLeaseStatus;
  lease_deadline_ms: number;
  result_snapshot_hash: string | null;
  receipt_id: string | null;
  created_at_ms: number;
  updated_at_ms: number;
  last_error: string | null;
};

export type RecordProjectDbEventInput = {
  event_id: string;
  project_id: string;
  branch_id: string;
  event_type: string;
  schema_version: number;
  idempotency_key: string;
  payload: unknown;
  actor: string;
  occurred_at_ms?: number;
  now_ms?: number;
  receipts_path?: string;
};

export type WriteProjectDbReceiptInput = {
  receipt_id?: string;
  project_id: string;
  branch_id: string;
  kind: string;
  status: ProjectDbReceiptStatus;
  event_id?: string | null;
  idempotency_key?: string | null;
  payload_hash?: string | null;
  base_snapshot_hash?: string | null;
  result_snapshot_hash?: string | null;
  reducer_name?: string | null;
  reducer_version?: string | null;
  lease_id?: string | null;
  actor?: string | null;
  details?: unknown;
  now_ms?: number;
  receipts_path?: string;
};

export type ApplyProjectDbReducerInput = {
  event_id: string;
  reducer_name: "project_meta.set";
  reducer_version: "v1";
  actor: string;
  now_ms?: number;
  receipts_path?: string;
};

export type ReplayProjectDbEventsInput = {
  project_id: string;
  branch_id: string;
  reducer_name: "project_meta.set";
  reducer_version: "v1";
  actor: string;
  now_ms?: number;
  receipts_path?: string;
};

export type AcquireProjectWriterLeaseInput = {
  project_id: string;
  branch_id: string;
  lease_id: string;
  lease_owner: string;
  base_snapshot_hash: string;
  lease_ms: number;
  now_ms?: number;
};

export type ProjectWriterLeaseInput = {
  project_id: string;
  branch_id: string;
  lease_id: string;
  lease_owner: string;
  now_ms?: number;
  receipts_path?: string;
};

export type CommitProjectWriterLeaseInput = ProjectWriterLeaseInput & {
  result_snapshot_hash: string;
};

export type ProjectWriterLeaseStats = {
  active: number;
  expired: number;
  by_status: Record<ProjectDbWriterLeaseStatus, number>;
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
    throw new Error(`node:sqlite is required for mdkg project DB events: ${message}`);
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

function stableJson(value: unknown): string {
  if (value === undefined || typeof value === "function" || typeof value === "symbol" || typeof value === "bigint") {
    throw new Error("value must be JSON-serializable");
  }
  if (value === null || typeof value !== "object") {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new Error("value must be JSON-serializable");
    }
    const encoded = JSON.stringify(value);
    if (encoded === undefined) {
      throw new Error("value must be JSON-serializable");
    }
    return encoded;
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson(object[key])}`)
    .join(",")}}`;
}

function hashJson(payloadJson: string): string {
  return `sha256:${crypto.createHash("sha256").update(payloadJson).digest("hex")}`;
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "receipt";
}

function toMessage<T extends Record<string, unknown>>(row: T | undefined): T | null {
  return row ?? null;
}

function toEvent(row: Record<string, unknown>): ProjectDbEvent {
  return {
    event_id: String(row.event_id),
    project_id: String(row.project_id),
    branch_id: String(row.branch_id),
    event_type: String(row.event_type),
    schema_version: Number(row.schema_version),
    idempotency_key: String(row.idempotency_key),
    payload_json: String(row.payload_json),
    payload_hash: String(row.payload_hash),
    actor: String(row.actor),
    status: String(row.status) as ProjectDbEventStatus,
    occurred_at_ms: Number(row.occurred_at_ms),
    created_at_ms: Number(row.created_at_ms),
    updated_at_ms: Number(row.updated_at_ms),
    last_error: row.last_error === null || row.last_error === undefined ? null : String(row.last_error),
  };
}

function toReceipt(row: Record<string, unknown>): ProjectDbReceipt {
  return {
    receipt_id: String(row.receipt_id),
    project_id: String(row.project_id),
    branch_id: String(row.branch_id),
    kind: String(row.kind),
    status: String(row.status) as ProjectDbReceiptStatus,
    event_id: row.event_id === null || row.event_id === undefined ? null : String(row.event_id),
    idempotency_key: row.idempotency_key === null || row.idempotency_key === undefined ? null : String(row.idempotency_key),
    payload_hash: row.payload_hash === null || row.payload_hash === undefined ? null : String(row.payload_hash),
    base_snapshot_hash: row.base_snapshot_hash === null || row.base_snapshot_hash === undefined ? null : String(row.base_snapshot_hash),
    result_snapshot_hash: row.result_snapshot_hash === null || row.result_snapshot_hash === undefined ? null : String(row.result_snapshot_hash),
    reducer_name: row.reducer_name === null || row.reducer_name === undefined ? null : String(row.reducer_name),
    reducer_version: row.reducer_version === null || row.reducer_version === undefined ? null : String(row.reducer_version),
    lease_id: row.lease_id === null || row.lease_id === undefined ? null : String(row.lease_id),
    actor: row.actor === null || row.actor === undefined ? null : String(row.actor),
    artifact_path: String(row.artifact_path),
    artifact_hash: String(row.artifact_hash),
    details_json: String(row.details_json),
    created_at_ms: Number(row.created_at_ms),
  };
}

function toLease(row: Record<string, unknown>): ProjectDbWriterLease {
  return {
    project_id: String(row.project_id),
    branch_id: String(row.branch_id),
    lease_id: String(row.lease_id),
    lease_owner: String(row.lease_owner),
    base_snapshot_hash: String(row.base_snapshot_hash),
    status: String(row.status) as ProjectDbWriterLeaseStatus,
    lease_deadline_ms: Number(row.lease_deadline_ms),
    result_snapshot_hash: row.result_snapshot_hash === null || row.result_snapshot_hash === undefined ? null : String(row.result_snapshot_hash),
    receipt_id: row.receipt_id === null || row.receipt_id === undefined ? null : String(row.receipt_id),
    created_at_ms: Number(row.created_at_ms),
    updated_at_ms: Number(row.updated_at_ms),
    last_error: row.last_error === null || row.last_error === undefined ? null : String(row.last_error),
  };
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

function withImmediateTransaction<T>(db: DatabaseSyncType, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // ignore rollback failures when no transaction is active
    }
    throw err;
  }
}

function receiptRoot(databasePath: string, receiptsPath?: string): string {
  if (receiptsPath) {
    return receiptsPath;
  }
  return path.join(path.dirname(path.dirname(databasePath)), "receipts");
}

function relativeArtifactPath(databasePath: string, artifactPath: string): string {
  const dbRoot = path.dirname(path.dirname(databasePath));
  return artifactPath.split(path.sep).join("/").startsWith(".")
    ? artifactPath
    : path.relative(dbRoot, artifactPath).split(path.sep).join("/");
}

function ensureReceiptId(input: WriteProjectDbReceiptInput, detailsJson: string): string {
  if (input.receipt_id !== undefined) {
    assertNonEmpty(input.receipt_id, "receipt_id");
    return input.receipt_id;
  }
  const hash = crypto
    .createHash("sha256")
    .update([
      input.project_id,
      input.branch_id,
      input.kind,
      input.status,
      input.event_id ?? "",
      input.idempotency_key ?? "",
      input.payload_hash ?? "",
      input.base_snapshot_hash ?? "",
      input.result_snapshot_hash ?? "",
      input.reducer_name ?? "",
      input.reducer_version ?? "",
      input.lease_id ?? "",
      detailsJson,
      String(input.now_ms ?? ""),
    ].join("\n"))
    .digest("hex")
    .slice(0, 16);
  return `receipt-${safeSegment(input.project_id)}-${safeSegment(input.branch_id)}-${safeSegment(input.kind)}-${hash}`;
}

function writeReceiptWithDb(db: DatabaseSyncType, databasePath: string, input: WriteProjectDbReceiptInput): ProjectDbReceipt {
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.branch_id, "branch_id");
  assertNonEmpty(input.kind, "kind");
  const currentNow = nowMs(input.now_ms);
  const detailsJson = stableJson(input.details ?? {});
  const receiptId = ensureReceiptId(input, detailsJson);
  const root = receiptRoot(databasePath, input.receipts_path);
  fs.mkdirSync(root, { recursive: true });
  const artifactPath = path.join(root, `${safeSegment(receiptId)}.json`);
  const artifact = {
    receipt_id: receiptId,
    project_id: input.project_id,
    branch_id: input.branch_id,
    kind: input.kind,
    status: input.status,
    event_id: input.event_id ?? null,
    idempotency_key: input.idempotency_key ?? null,
    payload_hash: input.payload_hash ?? null,
    base_snapshot_hash: input.base_snapshot_hash ?? null,
    result_snapshot_hash: input.result_snapshot_hash ?? null,
    reducer_name: input.reducer_name ?? null,
    reducer_version: input.reducer_version ?? null,
    lease_id: input.lease_id ?? null,
    actor: input.actor ?? null,
    details: JSON.parse(detailsJson),
    created_at_ms: currentNow,
  };
  const artifactJson = `${stableJson(artifact)}\n`;
  fs.writeFileSync(artifactPath, artifactJson, "utf8");
  const artifactHash = hashJson(artifactJson);
  const artifactRelative = relativeArtifactPath(databasePath, artifactPath);
  db
    .prepare(
      [
        "INSERT INTO project_receipt",
        "(receipt_id, project_id, branch_id, kind, status, event_id, idempotency_key, payload_hash, base_snapshot_hash, result_snapshot_hash, reducer_name, reducer_version, lease_id, actor, artifact_path, artifact_hash, details_json, created_at_ms)",
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        "ON CONFLICT(receipt_id) DO UPDATE SET",
        "artifact_path = excluded.artifact_path, artifact_hash = excluded.artifact_hash, details_json = excluded.details_json",
      ].join(" ")
    )
    .run(
      receiptId,
      input.project_id,
      input.branch_id,
      input.kind,
      input.status,
      input.event_id ?? null,
      input.idempotency_key ?? null,
      input.payload_hash ?? null,
      input.base_snapshot_hash ?? null,
      input.result_snapshot_hash ?? null,
      input.reducer_name ?? null,
      input.reducer_version ?? null,
      input.lease_id ?? null,
      input.actor ?? null,
      artifactRelative,
      artifactHash,
      detailsJson,
      currentNow
    );
  const row = db.prepare("SELECT * FROM project_receipt WHERE receipt_id = ?").get(receiptId);
  if (!row) {
    throw new Error("receipt could not be reloaded after insert");
  }
  return toReceipt(row);
}

function getEvent(db: DatabaseSyncType, eventId: string): ProjectDbEvent | null {
  const row = db.prepare("SELECT * FROM project_event WHERE event_id = ?").get(eventId);
  return row ? toEvent(row) : null;
}

function getLease(db: DatabaseSyncType, projectId: string, branchId: string, leaseId: string): ProjectDbWriterLease | null {
  const row = db
    .prepare("SELECT * FROM project_writer_lease WHERE project_id = ? AND branch_id = ? AND lease_id = ?")
    .get(projectId, branchId, leaseId);
  return row ? toLease(row) : null;
}

export function writeProjectDbReceipt(databasePath: string, input: WriteProjectDbReceiptInput): ProjectDbReceipt {
  return withDb(databasePath, (db) => withImmediateTransaction(db, () => writeReceiptWithDb(db, databasePath, input)));
}

export function recordProjectDbEvent(
  databasePath: string,
  input: RecordProjectDbEventInput
): { created: boolean; duplicate: boolean; conflict: boolean; event: ProjectDbEvent | null; receipt: ProjectDbReceipt | null } {
  assertNonEmpty(input.event_id, "event_id");
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.branch_id, "branch_id");
  assertNonEmpty(input.event_type, "event_type");
  assertPositiveInteger(input.schema_version, "schema_version");
  assertNonEmpty(input.idempotency_key, "idempotency_key");
  assertNonEmpty(input.actor, "actor");
  const currentNow = nowMs(input.now_ms);
  const occurredAt = input.occurred_at_ms ?? currentNow;
  assertInteger(occurredAt, "occurred_at_ms");
  const payloadJson = stableJson(input.payload);
  const payloadHash = hashJson(payloadJson);

  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const duplicateRow = db
        .prepare("SELECT * FROM project_event WHERE project_id = ? AND branch_id = ? AND idempotency_key = ?")
        .get(input.project_id, input.branch_id, input.idempotency_key);
      if (duplicateRow) {
        const duplicate = toEvent(duplicateRow);
        if (duplicate.payload_hash === payloadHash) {
          return { created: false, duplicate: true, conflict: false, event: duplicate, receipt: null };
        }
        const receipt = writeReceiptWithDb(db, databasePath, {
          project_id: input.project_id,
          branch_id: input.branch_id,
          kind: "event-conflict",
          status: "conflict",
          event_id: duplicate.event_id,
          idempotency_key: input.idempotency_key,
          payload_hash: payloadHash,
          actor: input.actor,
          details: {
            existing_event_id: duplicate.event_id,
            existing_payload_hash: duplicate.payload_hash,
            incoming_event_id: input.event_id,
            incoming_payload_hash: payloadHash,
          },
          now_ms: currentNow,
          receipts_path: input.receipts_path,
        });
        return { created: false, duplicate: false, conflict: true, event: duplicate, receipt };
      }
      db
        .prepare(
          [
            "INSERT INTO project_event",
            "(event_id, project_id, branch_id, event_type, schema_version, idempotency_key, payload_json, payload_hash, actor, status, occurred_at_ms, created_at_ms, updated_at_ms, last_error)",
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?, ?, NULL)",
          ].join(" ")
        )
        .run(
          input.event_id,
          input.project_id,
          input.branch_id,
          input.event_type,
          input.schema_version,
          input.idempotency_key,
          payloadJson,
          payloadHash,
          input.actor,
          occurredAt,
          currentNow,
          currentNow
        );
      const event = getEvent(db, input.event_id);
      if (!event) {
        throw new Error("event could not be reloaded after insert");
      }
      return { created: true, duplicate: false, conflict: false, event, receipt: null };
    })
  );
}

function parseProjectMetaSet(event: ProjectDbEvent): { key: string; value: string } {
  if (event.event_type !== "project_meta.set") {
    throw new Error(`unsupported event_type for reducer project_meta.set: ${event.event_type}`);
  }
  const payload = JSON.parse(event.payload_json) as { key?: unknown; value?: unknown };
  if (typeof payload.key !== "string" || payload.key.trim() === "") {
    throw new Error("project_meta.set payload.key must be a non-empty string");
  }
  if (typeof payload.value !== "string") {
    throw new Error("project_meta.set payload.value must be a string");
  }
  return { key: payload.key, value: payload.value };
}

function applyProjectMetaSet(db: DatabaseSyncType, event: ProjectDbEvent): { key: string; value: string } {
  const payload = parseProjectMetaSet(event);
  db
    .prepare(
      "INSERT INTO project_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value WHERE value <> excluded.value"
    )
    .run(payload.key, payload.value);
  return payload;
}

export function applyProjectDbReducer(
  databasePath: string,
  input: ApplyProjectDbReducerInput
): { applied: boolean; event: ProjectDbEvent; receipt: ProjectDbReceipt } {
  assertNonEmpty(input.event_id, "event_id");
  assertNonEmpty(input.actor, "actor");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const event = getEvent(db, input.event_id);
      if (!event) {
        throw new Error(`project DB event not found: ${input.event_id}`);
      }
      if (event.status === "applied") {
        const receipt = writeReceiptWithDb(db, databasePath, {
          project_id: event.project_id,
          branch_id: event.branch_id,
          kind: "event-duplicate",
          status: "duplicate",
          event_id: event.event_id,
          idempotency_key: event.idempotency_key,
          payload_hash: event.payload_hash,
          reducer_name: input.reducer_name,
          reducer_version: input.reducer_version,
          actor: input.actor,
          details: { reason: "event already applied" },
          now_ms: currentNow,
          receipts_path: input.receipts_path,
        });
        return { applied: false, event, receipt };
      }
      try {
        const change = applyProjectMetaSet(db, event);
        db
          .prepare("UPDATE project_event SET status = 'applied', updated_at_ms = ?, last_error = NULL WHERE event_id = ?")
          .run(currentNow, event.event_id);
        const updated = getEvent(db, event.event_id);
        if (!updated) {
          throw new Error("event could not be reloaded after reducer apply");
        }
        const receipt = writeReceiptWithDb(db, databasePath, {
          project_id: event.project_id,
          branch_id: event.branch_id,
          kind: "event-applied",
          status: "applied",
          event_id: event.event_id,
          idempotency_key: event.idempotency_key,
          payload_hash: event.payload_hash,
          reducer_name: input.reducer_name,
          reducer_version: input.reducer_version,
          actor: input.actor,
          details: { change },
          now_ms: currentNow,
          receipts_path: input.receipts_path,
        });
        return { applied: true, event: updated, receipt };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        db
          .prepare("UPDATE project_event SET status = 'rejected', updated_at_ms = ?, last_error = ? WHERE event_id = ?")
          .run(currentNow, message, event.event_id);
        const updated = getEvent(db, event.event_id);
        if (!updated) {
          throw new Error("event could not be reloaded after reducer reject");
        }
        const receipt = writeReceiptWithDb(db, databasePath, {
          project_id: event.project_id,
          branch_id: event.branch_id,
          kind: "event-rejected",
          status: "rejected",
          event_id: event.event_id,
          idempotency_key: event.idempotency_key,
          payload_hash: event.payload_hash,
          reducer_name: input.reducer_name,
          reducer_version: input.reducer_version,
          actor: input.actor,
          details: { error: message },
          now_ms: currentNow,
          receipts_path: input.receipts_path,
        });
        return { applied: false, event: updated, receipt };
      }
    })
  );
}

export function replayProjectDbEvents(
  databasePath: string,
  input: ReplayProjectDbEventsInput
): { replayed_count: number; receipt: ProjectDbReceipt } {
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.branch_id, "branch_id");
  assertNonEmpty(input.actor, "actor");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const rows = db
        .prepare(
          "SELECT * FROM project_event WHERE project_id = ? AND branch_id = ? AND event_type = ? AND status IN ('received', 'validated', 'applied') ORDER BY occurred_at_ms ASC, event_id ASC"
        )
        .all(input.project_id, input.branch_id, input.reducer_name);
      for (const row of rows) {
        applyProjectMetaSet(db, toEvent(row));
      }
      const receipt = writeReceiptWithDb(db, databasePath, {
        project_id: input.project_id,
        branch_id: input.branch_id,
        kind: "event-replay",
        status: "replay",
        reducer_name: input.reducer_name,
        reducer_version: input.reducer_version,
        actor: input.actor,
        details: { replayed_event_ids: rows.map((row) => String(row.event_id)) },
        now_ms: currentNow,
        receipts_path: input.receipts_path,
      });
      return { replayed_count: rows.length, receipt };
    })
  );
}

function requireActiveLease(db: DatabaseSyncType, input: ProjectWriterLeaseInput): ProjectDbWriterLease {
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.branch_id, "branch_id");
  assertNonEmpty(input.lease_id, "lease_id");
  assertNonEmpty(input.lease_owner, "lease_owner");
  const lease = getLease(db, input.project_id, input.branch_id, input.lease_id);
  if (!lease) {
    throw new Error(`writer lease not found: ${input.project_id}/${input.branch_id}/${input.lease_id}`);
  }
  if (lease.status !== "active") {
    throw new Error(`writer lease ${input.lease_id} is not active`);
  }
  if (lease.lease_owner !== input.lease_owner) {
    throw new Error(`writer lease ${input.lease_id} is not owned by ${input.lease_owner}`);
  }
  return lease;
}

export function acquireProjectWriterLease(
  databasePath: string,
  input: AcquireProjectWriterLeaseInput
): ProjectDbWriterLease {
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.branch_id, "branch_id");
  assertNonEmpty(input.lease_id, "lease_id");
  assertNonEmpty(input.lease_owner, "lease_owner");
  assertNonEmpty(input.base_snapshot_hash, "base_snapshot_hash");
  assertPositiveInteger(input.lease_ms, "lease_ms");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      db
        .prepare(
          "UPDATE project_writer_lease SET status = 'expired', updated_at_ms = ?, last_error = 'lease expired' WHERE status = 'active' AND lease_deadline_ms <= ?"
        )
        .run(currentNow, currentNow);
      db
        .prepare(
          "INSERT INTO project_branch_state (project_id, branch_id, current_snapshot_hash, updated_at_ms) VALUES (?, ?, ?, ?) ON CONFLICT(project_id, branch_id) DO NOTHING"
        )
        .run(input.project_id, input.branch_id, input.base_snapshot_hash, currentNow);
      db
        .prepare(
          [
            "INSERT INTO project_writer_lease",
            "(project_id, branch_id, lease_id, lease_owner, base_snapshot_hash, status, lease_deadline_ms, result_snapshot_hash, receipt_id, created_at_ms, updated_at_ms, last_error)",
            "VALUES (?, ?, ?, ?, ?, 'active', ?, NULL, NULL, ?, ?, NULL)",
          ].join(" ")
        )
        .run(
          input.project_id,
          input.branch_id,
          input.lease_id,
          input.lease_owner,
          input.base_snapshot_hash,
          currentNow + input.lease_ms,
          currentNow,
          currentNow
        );
      const lease = getLease(db, input.project_id, input.branch_id, input.lease_id);
      if (!lease) {
        throw new Error("writer lease could not be reloaded after insert");
      }
      return lease;
    })
  );
}

export function commitProjectWriterLease(
  databasePath: string,
  input: CommitProjectWriterLeaseInput
): { committed: boolean; lease: ProjectDbWriterLease; receipt: ProjectDbReceipt } {
  assertNonEmpty(input.result_snapshot_hash, "result_snapshot_hash");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const lease = requireActiveLease(db, input);
      const state = toMessage(
        db
          .prepare("SELECT * FROM project_branch_state WHERE project_id = ? AND branch_id = ?")
          .get(input.project_id, input.branch_id)
      );
      const currentSnapshotHash = state ? String(state.current_snapshot_hash) : lease.base_snapshot_hash;
      if (currentSnapshotHash !== lease.base_snapshot_hash) {
        const receipt = writeReceiptWithDb(db, databasePath, {
          project_id: input.project_id,
          branch_id: input.branch_id,
          kind: "writer-conflict",
          status: "conflict",
          base_snapshot_hash: lease.base_snapshot_hash,
          result_snapshot_hash: input.result_snapshot_hash,
          lease_id: input.lease_id,
          actor: input.lease_owner,
          details: { current_snapshot_hash: currentSnapshotHash },
          now_ms: currentNow,
          receipts_path: input.receipts_path,
        });
        db
          .prepare(
            "UPDATE project_writer_lease SET status = 'conflict', result_snapshot_hash = ?, receipt_id = ?, updated_at_ms = ?, last_error = ? WHERE project_id = ? AND branch_id = ? AND lease_id = ?"
          )
          .run(
            input.result_snapshot_hash,
            receipt.receipt_id,
            currentNow,
            `snapshot hash mismatch: current ${currentSnapshotHash}, base ${lease.base_snapshot_hash}`,
            input.project_id,
            input.branch_id,
            input.lease_id
          );
        const updated = getLease(db, input.project_id, input.branch_id, input.lease_id);
        if (!updated) {
          throw new Error("writer lease could not be reloaded after conflict");
        }
        return { committed: false, lease: updated, receipt };
      }
      const receipt = writeReceiptWithDb(db, databasePath, {
        project_id: input.project_id,
        branch_id: input.branch_id,
        kind: "writer-commit",
        status: "applied",
        base_snapshot_hash: lease.base_snapshot_hash,
        result_snapshot_hash: input.result_snapshot_hash,
        lease_id: input.lease_id,
        actor: input.lease_owner,
        details: { committed: true },
        now_ms: currentNow,
        receipts_path: input.receipts_path,
      });
      db
        .prepare("UPDATE project_branch_state SET current_snapshot_hash = ?, updated_at_ms = ? WHERE project_id = ? AND branch_id = ?")
        .run(input.result_snapshot_hash, currentNow, input.project_id, input.branch_id);
      db
        .prepare(
          "UPDATE project_writer_lease SET status = 'committed', result_snapshot_hash = ?, receipt_id = ?, updated_at_ms = ?, last_error = NULL WHERE project_id = ? AND branch_id = ? AND lease_id = ?"
        )
        .run(input.result_snapshot_hash, receipt.receipt_id, currentNow, input.project_id, input.branch_id, input.lease_id);
      const updated = getLease(db, input.project_id, input.branch_id, input.lease_id);
      if (!updated) {
        throw new Error("writer lease could not be reloaded after commit");
      }
      return { committed: true, lease: updated, receipt };
    })
  );
}

export function releaseProjectWriterLease(databasePath: string, input: ProjectWriterLeaseInput): ProjectDbWriterLease {
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      requireActiveLease(db, input);
      db
        .prepare(
          "UPDATE project_writer_lease SET status = 'released', updated_at_ms = ?, last_error = NULL WHERE project_id = ? AND branch_id = ? AND lease_id = ?"
        )
        .run(currentNow, input.project_id, input.branch_id, input.lease_id);
      const updated = getLease(db, input.project_id, input.branch_id, input.lease_id);
      if (!updated) {
        throw new Error("writer lease could not be reloaded after release");
      }
      return updated;
    })
  );
}

export function releaseExpiredProjectWriterLeases(
  databasePath: string,
  input: { now_ms?: number } = {}
): { released_count: number } {
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const result = db
        .prepare(
          "UPDATE project_writer_lease SET status = 'expired', updated_at_ms = ?, last_error = 'lease expired' WHERE status = 'active' AND lease_deadline_ms <= ?"
        )
        .run(currentNow, currentNow);
      return { released_count: Number(result.changes ?? 0) };
    })
  );
}

export function readProjectWriterLeaseStats(databasePath: string, input: { now_ms?: number } = {}): ProjectWriterLeaseStats {
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) => {
    const byStatus: Record<ProjectDbWriterLeaseStatus, number> = {
      active: 0,
      committed: 0,
      released: 0,
      expired: 0,
      conflict: 0,
    };
    for (const row of db.prepare("SELECT status, COUNT(*) AS count FROM project_writer_lease GROUP BY status").all()) {
      byStatus[String(row.status) as ProjectDbWriterLeaseStatus] = Number(row.count ?? 0);
    }
    const active = Number(
      db.prepare("SELECT COUNT(*) AS count FROM project_writer_lease WHERE status = 'active'").get()?.count ?? 0
    );
    const expired = Number(
      db
        .prepare("SELECT COUNT(*) AS count FROM project_writer_lease WHERE status = 'active' AND lease_deadline_ms <= ?")
        .get(currentNow)?.count ?? 0
    );
    return { active, expired, by_status: byStatus };
  });
}
