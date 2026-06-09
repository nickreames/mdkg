CREATE TABLE IF NOT EXISTS project_event (
  event_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  schema_version INTEGER NOT NULL CHECK(schema_version > 0),
  idempotency_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  actor TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('received', 'validated', 'applied', 'rejected', 'dead_letter')),
  occurred_at_ms INTEGER NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  last_error TEXT
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS project_event_idempotency_unique
ON project_event(project_id, branch_id, idempotency_key);

CREATE INDEX IF NOT EXISTS project_event_branch_status_idx
ON project_event(project_id, branch_id, status, occurred_at_ms, event_id);

CREATE TABLE IF NOT EXISTS project_receipt (
  receipt_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('applied', 'rejected', 'duplicate', 'conflict', 'replay', 'dead_letter')),
  event_id TEXT,
  idempotency_key TEXT,
  payload_hash TEXT,
  base_snapshot_hash TEXT,
  result_snapshot_hash TEXT,
  reducer_name TEXT,
  reducer_version TEXT,
  lease_id TEXT,
  actor TEXT,
  artifact_path TEXT NOT NULL,
  artifact_hash TEXT NOT NULL,
  details_json TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS project_receipt_branch_status_idx
ON project_receipt(project_id, branch_id, status, created_at_ms, receipt_id);

CREATE INDEX IF NOT EXISTS project_receipt_event_idx
ON project_receipt(event_id, created_at_ms, receipt_id)
WHERE event_id IS NOT NULL;
