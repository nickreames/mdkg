CREATE TABLE IF NOT EXISTS project_branch_state (
  project_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  current_snapshot_hash TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (project_id, branch_id)
) STRICT;

CREATE TABLE IF NOT EXISTS project_writer_lease (
  project_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  lease_id TEXT NOT NULL,
  lease_owner TEXT NOT NULL,
  base_snapshot_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'committed', 'released', 'expired', 'conflict')),
  lease_deadline_ms INTEGER NOT NULL,
  result_snapshot_hash TEXT,
  receipt_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  last_error TEXT,
  PRIMARY KEY (project_id, branch_id, lease_id)
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS project_writer_lease_active_unique
ON project_writer_lease(project_id, branch_id)
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS project_writer_lease_status_idx
ON project_writer_lease(project_id, branch_id, status, lease_deadline_ms, lease_id);
