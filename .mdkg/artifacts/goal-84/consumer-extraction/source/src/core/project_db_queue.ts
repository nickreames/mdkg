import crypto from "crypto";

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

export type ProjectQueueStatus = "ready" | "leased" | "acked" | "dead_letter";
export type ProjectQueueControlStatus = "active" | "paused";

export type ProjectQueue = {
  queue_name: string;
  status: ProjectQueueControlStatus;
  paused_reason: string | null;
  created_at_ms: number;
  updated_at_ms: number;
};

export type ProjectQueueMessage = {
  queue_name: string;
  message_id: string;
  dedupe_key: string | null;
  payload_json: string;
  payload_hash: string;
  status: ProjectQueueStatus;
  available_at_ms: number;
  attempt_count: number;
  max_attempts: number;
  lease_owner: string | null;
  lease_deadline_ms: number | null;
  created_at_ms: number;
  updated_at_ms: number;
  last_error: string | null;
};

export type ProjectQueueEnqueueInput = {
  queue_name: string;
  message_id: string;
  dedupe_key?: string | null;
  payload: unknown;
  available_at_ms?: number;
  max_attempts?: number;
  now_ms?: number;
};

export type ProjectQueueClaimInput = {
  queue_name: string;
  lease_owner: string;
  lease_ms: number;
  now_ms?: number;
};

export type ProjectQueueLeaseInput = {
  queue_name: string;
  message_id: string;
  lease_owner: string;
  now_ms?: number;
};

export type ProjectQueueFailInput = ProjectQueueLeaseInput & {
  error: string;
  retry_after_ms?: number;
};

export type ProjectQueueReleaseExpiredInput = {
  queue_name?: string;
  now_ms?: number;
};

export type ProjectQueueStatsInput = {
  queue_name?: string;
  now_ms?: number;
};

export type ProjectQueueStats = {
  total: number;
  by_status: Record<ProjectQueueStatus, number>;
  ready_available: number;
  leased_expired: number;
};

export type ProjectQueueCreateInput = {
  queue_name: string;
  paused?: boolean;
  reason?: string | null;
  now_ms?: number;
};

export type ProjectQueueUpdateInput = {
  queue_name: string;
  reason?: string | null;
  now_ms?: number;
};

export type ProjectQueueMessageListInput = {
  queue_name: string;
  status?: ProjectQueueStatus | "all";
  limit?: number;
};

export type ProjectQueueSnapshotQueue = {
  queue_name: string;
  status: ProjectQueueControlStatus;
  paused_reason: string | null;
  total: number;
  ready: number;
  leased: number;
  acked: number;
  dead_letter: number;
};

export type ProjectQueueSnapshotSummary = {
  queues: ProjectQueueSnapshotQueue[];
  total: number;
  ready: number;
  leased: number;
  acked: number;
  dead_letter: number;
  paused_ready: number;
  active_ready: number;
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
    throw new Error(`node:sqlite is required for mdkg project DB queues: ${message}`);
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
    throw new Error("payload must be JSON-serializable");
  }
  if (value === null || typeof value !== "object") {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new Error("payload must be JSON-serializable");
    }
    const encoded = JSON.stringify(value);
    if (encoded === undefined) {
      throw new Error("payload must be JSON-serializable");
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

function payloadHash(payloadJson: string): string {
  return `sha256:${crypto.createHash("sha256").update(payloadJson).digest("hex")}`;
}

function toMessage(row: Record<string, unknown>): ProjectQueueMessage {
  return {
    queue_name: String(row.queue_name),
    message_id: String(row.message_id),
    dedupe_key: row.dedupe_key === null || row.dedupe_key === undefined ? null : String(row.dedupe_key),
    payload_json: String(row.payload_json),
    payload_hash: String(row.payload_hash),
    status: String(row.status) as ProjectQueueStatus,
    available_at_ms: Number(row.available_at_ms),
    attempt_count: Number(row.attempt_count),
    max_attempts: Number(row.max_attempts),
    lease_owner: row.lease_owner === null || row.lease_owner === undefined ? null : String(row.lease_owner),
    lease_deadline_ms: row.lease_deadline_ms === null || row.lease_deadline_ms === undefined ? null : Number(row.lease_deadline_ms),
    created_at_ms: Number(row.created_at_ms),
    updated_at_ms: Number(row.updated_at_ms),
    last_error: row.last_error === null || row.last_error === undefined ? null : String(row.last_error),
  };
}

function toQueue(row: Record<string, unknown>): ProjectQueue {
  return {
    queue_name: String(row.queue_name),
    status: String(row.status) as ProjectQueueControlStatus,
    paused_reason: row.paused_reason === null || row.paused_reason === undefined ? null : String(row.paused_reason),
    created_at_ms: Number(row.created_at_ms),
    updated_at_ms: Number(row.updated_at_ms),
  };
}

function getMessage(db: DatabaseSyncType, queueName: string, messageId: string): ProjectQueueMessage | null {
  const row = db
    .prepare("SELECT * FROM project_queue_message WHERE queue_name = ? AND message_id = ?")
    .get(queueName, messageId);
  return row ? toMessage(row) : null;
}

function getQueue(db: DatabaseSyncType, queueName: string): ProjectQueue | null {
  const row = db.prepare("SELECT * FROM project_queue WHERE queue_name = ?").get(queueName);
  return row ? toQueue(row) : null;
}

function ensureQueue(db: DatabaseSyncType, queueName: string, currentNow: number): ProjectQueue {
  const existing = getQueue(db, queueName);
  if (existing) {
    return existing;
  }
  db
    .prepare(
      "INSERT INTO project_queue (queue_name, status, paused_reason, created_at_ms, updated_at_ms) VALUES (?, 'active', NULL, ?, ?)"
    )
    .run(queueName, currentNow, currentNow);
  const queue = getQueue(db, queueName);
  if (!queue) {
    throw new Error(`queue could not be loaded after create: ${queueName}`);
  }
  return queue;
}

function requireQueueActive(queue: ProjectQueue, action: string): void {
  if (queue.status === "paused") {
    throw new Error(`queue ${queue.queue_name} is paused; cannot ${action}`);
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

export function enqueueProjectQueueMessage(
  databasePath: string,
  input: ProjectQueueEnqueueInput
): { created: boolean; duplicate: boolean; message: ProjectQueueMessage } {
  assertNonEmpty(input.queue_name, "queue_name");
  assertNonEmpty(input.message_id, "message_id");
  if (input.dedupe_key !== undefined && input.dedupe_key !== null) {
    assertNonEmpty(input.dedupe_key, "dedupe_key");
  }
  const currentNow = nowMs(input.now_ms);
  const availableAt = input.available_at_ms ?? currentNow;
  assertInteger(availableAt, "available_at_ms");
  const maxAttempts = input.max_attempts ?? 3;
  assertPositiveInteger(maxAttempts, "max_attempts");
  const payloadJson = stableJson(input.payload);
  const hash = payloadHash(payloadJson);

  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      requireQueueActive(ensureQueue(db, input.queue_name, currentNow), "enqueue");
      if (input.dedupe_key) {
        const duplicate = db
          .prepare("SELECT * FROM project_queue_message WHERE queue_name = ? AND dedupe_key = ?")
          .get(input.queue_name, input.dedupe_key);
        if (duplicate) {
          return { created: false, duplicate: true, message: toMessage(duplicate) };
        }
      }
      db
        .prepare(
          [
            "INSERT INTO project_queue_message",
            "(queue_name, message_id, dedupe_key, payload_json, payload_hash, status, available_at_ms, attempt_count, max_attempts, lease_owner, lease_deadline_ms, created_at_ms, updated_at_ms, last_error)",
            "VALUES (?, ?, ?, ?, ?, 'ready', ?, 0, ?, NULL, NULL, ?, ?, NULL)",
          ].join(" ")
        )
        .run(
          input.queue_name,
          input.message_id,
          input.dedupe_key ?? null,
          payloadJson,
          hash,
          availableAt,
          maxAttempts,
          currentNow,
          currentNow
        );
      const message = getMessage(db, input.queue_name, input.message_id);
      if (!message) {
        throw new Error("queued message could not be reloaded after insert");
      }
      return { created: true, duplicate: false, message };
    })
  );
}

export function claimProjectQueueMessage(
  databasePath: string,
  input: ProjectQueueClaimInput
): ProjectQueueMessage | null {
  assertNonEmpty(input.queue_name, "queue_name");
  assertNonEmpty(input.lease_owner, "lease_owner");
  assertPositiveInteger(input.lease_ms, "lease_ms");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      requireQueueActive(ensureQueue(db, input.queue_name, currentNow), "claim");
      const row = db
        .prepare(
          [
            "SELECT * FROM project_queue_message",
            "WHERE queue_name = ?",
            "AND (",
            "  (status = 'ready' AND available_at_ms <= ?)",
            "  OR (status = 'leased' AND lease_deadline_ms <= ?)",
            ")",
            "ORDER BY available_at_ms ASC, created_at_ms ASC, message_id ASC",
            "LIMIT 1",
          ].join(" ")
        )
        .get(input.queue_name, currentNow, currentNow);
      if (!row) {
        return null;
      }
      const message = toMessage(row);
      db
        .prepare(
          "UPDATE project_queue_message SET status = 'leased', lease_owner = ?, lease_deadline_ms = ?, updated_at_ms = ? WHERE queue_name = ? AND message_id = ?"
        )
        .run(input.lease_owner, currentNow + input.lease_ms, currentNow, input.queue_name, message.message_id);
      return getMessage(db, input.queue_name, message.message_id);
    })
  );
}

function requireLeasedMessage(
  db: DatabaseSyncType,
  queueName: string,
  messageId: string,
  leaseOwner: string
): ProjectQueueMessage {
  const message = getMessage(db, queueName, messageId);
  if (!message) {
    throw new Error(`queue message not found: ${queueName}/${messageId}`);
  }
  if (message.status !== "leased" || message.lease_owner !== leaseOwner) {
    throw new Error(`queue message ${messageId} is not leased by ${leaseOwner}`);
  }
  return message;
}

export function ackProjectQueueMessage(databasePath: string, input: ProjectQueueLeaseInput): ProjectQueueMessage {
  assertNonEmpty(input.queue_name, "queue_name");
  assertNonEmpty(input.message_id, "message_id");
  assertNonEmpty(input.lease_owner, "lease_owner");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      requireLeasedMessage(db, input.queue_name, input.message_id, input.lease_owner);
      db
        .prepare(
          "UPDATE project_queue_message SET status = 'acked', lease_owner = NULL, lease_deadline_ms = NULL, updated_at_ms = ? WHERE queue_name = ? AND message_id = ?"
        )
        .run(currentNow, input.queue_name, input.message_id);
      const message = getMessage(db, input.queue_name, input.message_id);
      if (!message) {
        throw new Error("acked message could not be reloaded");
      }
      return message;
    })
  );
}

export function failProjectQueueMessage(
  databasePath: string,
  input: ProjectQueueFailInput
): ProjectQueueMessage {
  assertNonEmpty(input.queue_name, "queue_name");
  assertNonEmpty(input.message_id, "message_id");
  assertNonEmpty(input.lease_owner, "lease_owner");
  assertNonEmpty(input.error, "error");
  const currentNow = nowMs(input.now_ms);
  const retryAfter = input.retry_after_ms ?? 0;
  assertInteger(retryAfter, "retry_after_ms");
  if (retryAfter < 0) {
    throw new Error("retry_after_ms must be greater than or equal to 0");
  }
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const message = requireLeasedMessage(db, input.queue_name, input.message_id, input.lease_owner);
      const attemptCount = message.attempt_count + 1;
      const status: ProjectQueueStatus = attemptCount >= message.max_attempts ? "dead_letter" : "ready";
      const availableAt = status === "ready" ? currentNow + retryAfter : currentNow;
      db
        .prepare(
          [
            "UPDATE project_queue_message",
            "SET status = ?, attempt_count = ?, available_at_ms = ?, lease_owner = NULL, lease_deadline_ms = NULL, updated_at_ms = ?, last_error = ?",
            "WHERE queue_name = ? AND message_id = ?",
          ].join(" ")
        )
        .run(status, attemptCount, availableAt, currentNow, input.error, input.queue_name, input.message_id);
      const updated = getMessage(db, input.queue_name, input.message_id);
      if (!updated) {
        throw new Error("failed message could not be reloaded");
      }
      return updated;
    })
  );
}

export function deadLetterProjectQueueMessage(
  databasePath: string,
  input: ProjectQueueLeaseInput & { error: string }
): ProjectQueueMessage {
  assertNonEmpty(input.queue_name, "queue_name");
  assertNonEmpty(input.message_id, "message_id");
  assertNonEmpty(input.lease_owner, "lease_owner");
  assertNonEmpty(input.error, "error");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      requireLeasedMessage(db, input.queue_name, input.message_id, input.lease_owner);
      db
        .prepare(
          "UPDATE project_queue_message SET status = 'dead_letter', lease_owner = NULL, lease_deadline_ms = NULL, updated_at_ms = ?, last_error = ? WHERE queue_name = ? AND message_id = ?"
        )
        .run(currentNow, input.error, input.queue_name, input.message_id);
      const message = getMessage(db, input.queue_name, input.message_id);
      if (!message) {
        throw new Error("dead-lettered message could not be reloaded");
      }
      return message;
    })
  );
}

export function releaseExpiredProjectQueueLeases(
  databasePath: string,
  input: ProjectQueueReleaseExpiredInput = {}
): { released_count: number } {
  const currentNow = nowMs(input.now_ms);
  if (input.queue_name !== undefined) {
    assertNonEmpty(input.queue_name, "queue_name");
  }
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const result = input.queue_name
        ? db
            .prepare(
              "UPDATE project_queue_message SET status = 'ready', lease_owner = NULL, lease_deadline_ms = NULL, updated_at_ms = ? WHERE queue_name = ? AND status = 'leased' AND lease_deadline_ms <= ?"
            )
            .run(currentNow, input.queue_name, currentNow)
        : db
            .prepare(
              "UPDATE project_queue_message SET status = 'ready', lease_owner = NULL, lease_deadline_ms = NULL, updated_at_ms = ? WHERE status = 'leased' AND lease_deadline_ms <= ?"
            )
            .run(currentNow, currentNow);
      return { released_count: Number(result.changes ?? 0) };
    })
  );
}

export function readProjectQueueStats(
  databasePath: string,
  input: ProjectQueueStatsInput = {}
): ProjectQueueStats {
  if (input.queue_name !== undefined) {
    assertNonEmpty(input.queue_name, "queue_name");
  }
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) => {
    const params = input.queue_name ? [input.queue_name] : [];
    const where = input.queue_name ? "WHERE queue_name = ?" : "";
    const rows = db
      .prepare(`SELECT status, COUNT(*) AS count FROM project_queue_message ${where} GROUP BY status`)
      .all(...params);
    const byStatus: Record<ProjectQueueStatus, number> = {
      ready: 0,
      leased: 0,
      acked: 0,
      dead_letter: 0,
    };
    for (const row of rows) {
      byStatus[String(row.status) as ProjectQueueStatus] = Number(row.count);
    }
    const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
    const readyAvailable = db
      .prepare(`SELECT COUNT(*) AS count FROM project_queue_message ${where} ${where ? "AND" : "WHERE"} status = 'ready' AND available_at_ms <= ?`)
      .get(...params, currentNow);
    const leasedExpired = db
      .prepare(`SELECT COUNT(*) AS count FROM project_queue_message ${where} ${where ? "AND" : "WHERE"} status = 'leased' AND lease_deadline_ms <= ?`)
      .get(...params, currentNow);
    return {
      total,
      by_status: byStatus,
      ready_available: Number(readyAvailable?.count ?? 0),
      leased_expired: Number(leasedExpired?.count ?? 0),
    };
  });
}

export function createProjectQueue(
  databasePath: string,
  input: ProjectQueueCreateInput
): { created: boolean; queue: ProjectQueue } {
  assertNonEmpty(input.queue_name, "queue_name");
  const currentNow = nowMs(input.now_ms);
  if (input.reason !== undefined && input.reason !== null) {
    assertNonEmpty(input.reason, "reason");
  }
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      const existing = getQueue(db, input.queue_name);
      if (existing) {
        return { created: false, queue: existing };
      }
      const status: ProjectQueueControlStatus = input.paused ? "paused" : "active";
      db
        .prepare(
          "INSERT INTO project_queue (queue_name, status, paused_reason, created_at_ms, updated_at_ms) VALUES (?, ?, ?, ?, ?)"
        )
        .run(input.queue_name, status, input.paused ? input.reason ?? null : null, currentNow, currentNow);
      const queue = getQueue(db, input.queue_name);
      if (!queue) {
        throw new Error(`queue could not be loaded after create: ${input.queue_name}`);
      }
      return { created: true, queue };
    })
  );
}

export function pauseProjectQueue(databasePath: string, input: ProjectQueueUpdateInput): ProjectQueue {
  assertNonEmpty(input.queue_name, "queue_name");
  if (input.reason !== undefined && input.reason !== null) {
    assertNonEmpty(input.reason, "reason");
  }
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      ensureQueue(db, input.queue_name, currentNow);
      db
        .prepare("UPDATE project_queue SET status = 'paused', paused_reason = ?, updated_at_ms = ? WHERE queue_name = ?")
        .run(input.reason ?? null, currentNow, input.queue_name);
      const queue = getQueue(db, input.queue_name);
      if (!queue) {
        throw new Error(`queue could not be loaded after pause: ${input.queue_name}`);
      }
      return queue;
    })
  );
}

export function resumeProjectQueue(databasePath: string, input: ProjectQueueUpdateInput): ProjectQueue {
  assertNonEmpty(input.queue_name, "queue_name");
  const currentNow = nowMs(input.now_ms);
  return withDb(databasePath, (db) =>
    withImmediateTransaction(db, () => {
      ensureQueue(db, input.queue_name, currentNow);
      db
        .prepare("UPDATE project_queue SET status = 'active', paused_reason = NULL, updated_at_ms = ? WHERE queue_name = ?")
        .run(currentNow, input.queue_name);
      const queue = getQueue(db, input.queue_name);
      if (!queue) {
        throw new Error(`queue could not be loaded after resume: ${input.queue_name}`);
      }
      return queue;
    })
  );
}

export function readProjectQueue(databasePath: string, queueName: string): ProjectQueue | null {
  assertNonEmpty(queueName, "queue_name");
  return withDb(databasePath, (db) => getQueue(db, queueName));
}

export function listProjectQueues(databasePath: string): ProjectQueue[] {
  return withDb(databasePath, (db) =>
    db.prepare("SELECT * FROM project_queue ORDER BY queue_name ASC").all().map(toQueue)
  );
}

export function readProjectQueueMessage(
  databasePath: string,
  queueName: string,
  messageId: string
): ProjectQueueMessage | null {
  assertNonEmpty(queueName, "queue_name");
  assertNonEmpty(messageId, "message_id");
  return withDb(databasePath, (db) => getMessage(db, queueName, messageId));
}

export function listProjectQueueMessages(
  databasePath: string,
  input: ProjectQueueMessageListInput
): ProjectQueueMessage[] {
  assertNonEmpty(input.queue_name, "queue_name");
  const limit = input.limit ?? 50;
  assertPositiveInteger(limit, "limit");
  if (input.status && input.status !== "all" && !["ready", "leased", "acked", "dead_letter"].includes(input.status)) {
    throw new Error("status must be ready, leased, acked, dead_letter, or all");
  }
  return withDb(databasePath, (db) => {
    const sql =
      input.status && input.status !== "all"
        ? [
            "SELECT * FROM project_queue_message",
            "WHERE queue_name = ? AND status = ?",
            "ORDER BY available_at_ms ASC, created_at_ms ASC, message_id ASC",
            "LIMIT ?",
          ].join(" ")
        : [
            "SELECT * FROM project_queue_message",
            "WHERE queue_name = ?",
            "ORDER BY available_at_ms ASC, created_at_ms ASC, message_id ASC",
            "LIMIT ?",
          ].join(" ");
    const params = input.status && input.status !== "all" ? [input.queue_name, input.status, limit] : [input.queue_name, limit];
    return db.prepare(sql).all(...params).map(toMessage);
  });
}

export function readProjectQueueSnapshotSummary(databasePath: string): ProjectQueueSnapshotSummary {
  return withDb(databasePath, (db) => {
    const rows = db
      .prepare(
        [
          "SELECT q.queue_name, q.status, q.paused_reason,",
          "COUNT(m.message_id) AS total,",
          "SUM(CASE WHEN m.status = 'ready' THEN 1 ELSE 0 END) AS ready,",
          "SUM(CASE WHEN m.status = 'leased' THEN 1 ELSE 0 END) AS leased,",
          "SUM(CASE WHEN m.status = 'acked' THEN 1 ELSE 0 END) AS acked,",
          "SUM(CASE WHEN m.status = 'dead_letter' THEN 1 ELSE 0 END) AS dead_letter",
          "FROM project_queue q",
          "LEFT JOIN project_queue_message m ON m.queue_name = q.queue_name",
          "GROUP BY q.queue_name, q.status, q.paused_reason",
          "ORDER BY q.queue_name ASC",
        ].join(" ")
      )
      .all();
    const queues: ProjectQueueSnapshotQueue[] = rows.map((row) => ({
      queue_name: String(row.queue_name),
      status: String(row.status) as ProjectQueueControlStatus,
      paused_reason: row.paused_reason === null || row.paused_reason === undefined ? null : String(row.paused_reason),
      total: Number(row.total ?? 0),
      ready: Number(row.ready ?? 0),
      leased: Number(row.leased ?? 0),
      acked: Number(row.acked ?? 0),
      dead_letter: Number(row.dead_letter ?? 0),
    }));
    const summary: ProjectQueueSnapshotSummary = {
      queues,
      total: 0,
      ready: 0,
      leased: 0,
      acked: 0,
      dead_letter: 0,
      paused_ready: 0,
      active_ready: 0,
    };
    for (const queue of queues) {
      summary.total += queue.total;
      summary.ready += queue.ready;
      summary.leased += queue.leased;
      summary.acked += queue.acked;
      summary.dead_letter += queue.dead_letter;
      if (queue.status === "paused") {
        summary.paused_ready += queue.ready;
      } else {
        summary.active_ready += queue.ready;
      }
    }
    return summary;
  });
}
