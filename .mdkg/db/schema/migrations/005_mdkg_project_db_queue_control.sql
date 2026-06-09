CREATE TABLE IF NOT EXISTS project_queue (
  queue_name TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('active', 'paused')),
  paused_reason TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
) STRICT;

INSERT OR IGNORE INTO project_queue (queue_name, status, paused_reason, created_at_ms, updated_at_ms)
SELECT DISTINCT
  queue_name,
  'active',
  NULL,
  CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER),
  CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
FROM project_queue_message;
