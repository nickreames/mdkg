CREATE TABLE IF NOT EXISTS project_queue_message (
  queue_name TEXT NOT NULL,
  message_id TEXT NOT NULL,
  dedupe_key TEXT,
  payload_json TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('ready', 'leased', 'acked', 'dead_letter')),
  available_at_ms INTEGER NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count >= 0),
  max_attempts INTEGER NOT NULL CHECK(max_attempts > 0),
  lease_owner TEXT,
  lease_deadline_ms INTEGER,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  last_error TEXT,
  CHECK (
    (status = 'leased' AND lease_owner IS NOT NULL AND lease_deadline_ms IS NOT NULL)
    OR
    (status <> 'leased' AND lease_owner IS NULL AND lease_deadline_ms IS NULL)
  ),
  PRIMARY KEY (queue_name, message_id)
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS project_queue_message_dedupe_unique
ON project_queue_message(queue_name, dedupe_key)
WHERE dedupe_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS project_queue_message_ready_idx
ON project_queue_message(queue_name, status, available_at_ms, created_at_ms, message_id);

CREATE INDEX IF NOT EXISTS project_queue_message_lease_idx
ON project_queue_message(queue_name, status, lease_deadline_ms, created_at_ms, message_id);
