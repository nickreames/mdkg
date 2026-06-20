export type ProjectDbQueueAdapterContract = {
  schema_version: 1;
  contract_id: "mdkg.project_db.queue.adapter.v1";
  stability: "public";
  boundary: {
    role: string;
    canonical_history: string;
    raw_payload_policy: string;
    internal_surfaces: string[];
  };
  runtime: {
    database: "node:sqlite";
    transactions: string;
    external_dependencies: string[];
  };
  commands: string[];
  queue_control: {
    table: "project_queue";
    states: ["active", "paused"];
    paused_behavior: {
      rejects: ["enqueue", "claim"];
      allows: ["ack", "fail", "dead-letter", "release-expired", "stats", "list", "show"];
    };
  };
  message: {
    table: "project_queue_message";
    states: ["ready", "leased", "acked", "dead_letter"];
    fields: string[];
    terminal_states: ["acked", "dead_letter"];
  };
  payload_hash: {
    algorithm: "sha256";
    encoding: "sha256:<64 lowercase hex chars>";
    canonicalization: string;
  };
  dedupe: {
    key: "queue_name + dedupe_key";
    scope: string;
    duplicate_behavior: string;
  };
  claim: {
    selection: string;
    lease: string;
    transactional: true;
  };
  settlement: {
    ack: string;
    fail: string;
    dead_letter: string;
    release_expired: string;
  };
  stats: {
    counters: string[];
    snapshot_summary: string[];
  };
  snapshot_policy: {
    drain: string;
    paused: string;
  };
  adapter_guidance: string[];
};

export function projectDbQueueAdapterContract(): ProjectDbQueueAdapterContract {
  return {
    schema_version: 1,
    contract_id: "mdkg.project_db.queue.adapter.v1",
    stability: "public",
    boundary: {
      role: "durable local delivery state for mdkg project DB integrations",
      canonical_history: "queue rows are not canonical event history or durable runtime transcripts",
      raw_payload_policy: "store compact refs and redacted payloads; do not store raw secrets, prompts, provider payloads, or bulky runtime artifacts",
      internal_surfaces: ["event", "receipt", "reducer", "writer_lease", "materializer"],
    },
    runtime: {
      database: "node:sqlite",
      transactions: "short BEGIN IMMEDIATE transactions for writes and claims",
      external_dependencies: [],
    },
    commands: [
      "mdkg db queue create <queue>",
      "mdkg db queue pause <queue>",
      "mdkg db queue resume <queue>",
      "mdkg db queue enqueue <queue> <message-id>",
      "mdkg db queue claim <queue>",
      "mdkg db queue ack <queue> <message-id>",
      "mdkg db queue fail <queue> <message-id>",
      "mdkg db queue dead-letter <queue> <message-id>",
      "mdkg db queue release-expired [queue]",
      "mdkg db queue stats [queue]",
      "mdkg db queue list <queue>",
      "mdkg db queue show <queue> <message-id>",
      "mdkg db queue contract",
    ],
    queue_control: {
      table: "project_queue",
      states: ["active", "paused"],
      paused_behavior: {
        rejects: ["enqueue", "claim"],
        allows: ["ack", "fail", "dead-letter", "release-expired", "stats", "list", "show"],
      },
    },
    message: {
      table: "project_queue_message",
      states: ["ready", "leased", "acked", "dead_letter"],
      fields: [
        "queue_name",
        "message_id",
        "dedupe_key",
        "payload_json",
        "payload_hash",
        "status",
        "available_at_ms",
        "attempt_count",
        "max_attempts",
        "lease_owner",
        "lease_deadline_ms",
        "created_at_ms",
        "updated_at_ms",
        "last_error",
      ],
      terminal_states: ["acked", "dead_letter"],
    },
    payload_hash: {
      algorithm: "sha256",
      encoding: "sha256:<64 lowercase hex chars>",
      canonicalization: "payload JSON is serialized deterministically with object keys sorted before hashing and storage",
    },
    dedupe: {
      key: "queue_name + dedupe_key",
      scope: "only non-null dedupe keys participate in the partial unique index",
      duplicate_behavior: "enqueue with an existing dedupe key returns the existing message without replacing payload_json or payload_hash",
    },
    claim: {
      selection: "oldest ready or expired leased message ordered by available_at_ms, created_at_ms, then message_id",
      lease: "claim sets status=leased, lease_owner, and lease_deadline_ms; ack/fail/dead-letter must use the same lease owner",
      transactional: true,
    },
    settlement: {
      ack: "leased message becomes acked and clears lease owner/deadline",
      fail: "leased message increments attempt_count; if attempts remain it becomes ready at now + retry_after_ms, otherwise it becomes dead_letter",
      dead_letter: "leased message becomes dead_letter immediately and records last_error",
      release_expired: "expired leased messages become ready and clear lease owner/deadline without changing attempt_count",
    },
    stats: {
      counters: ["total", "ready", "leased", "acked", "dead_letter", "ready_available", "leased_expired"],
      snapshot_summary: ["total", "ready", "leased", "acked", "dead_letter", "paused_ready", "active_ready"],
    },
    snapshot_policy: {
      drain: "default seal policy; requires no ready or leased delivery work",
      paused: "allows ready messages only when their queues are paused; leased messages are never allowed",
    },
    adapter_guidance: [
      "create queues explicitly before enqueueing integration work",
      "use dedupe keys for idempotent delivery",
      "treat message payloads as refs and redacted envelopes, not canonical runtime state",
      "settle or pause queues before committing sealed project DB state",
      "use stats/list/show for operator review and avoid direct SQL coupling",
    ],
  };
}
