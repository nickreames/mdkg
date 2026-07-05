# mdkg project db canonical dump v1
snapshot: .mdkg/db/state/project.sqlite
snapshot_sha256: sha256:22d30967b8b85c69e747baa9d663318b963adbbb6db1d96aa6d37521a9ea2a7f

# Schema
schema index project_event_branch_status_idx: CREATE INDEX project_event_branch_status_idx ON project_event(project_id, branch_id, status, occurred_at_ms, event_id)
schema index project_event_idempotency_unique: CREATE UNIQUE INDEX project_event_idempotency_unique ON project_event(project_id, branch_id, idempotency_key)
schema index project_queue_message_dedupe_unique: CREATE UNIQUE INDEX project_queue_message_dedupe_unique ON project_queue_message(queue_name, dedupe_key) WHERE dedupe_key IS NOT NULL
schema index project_queue_message_lease_idx: CREATE INDEX project_queue_message_lease_idx ON project_queue_message(queue_name, status, lease_deadline_ms, created_at_ms, message_id)
schema index project_queue_message_ready_idx: CREATE INDEX project_queue_message_ready_idx ON project_queue_message(queue_name, status, available_at_ms, created_at_ms, message_id)
schema index project_receipt_branch_status_idx: CREATE INDEX project_receipt_branch_status_idx ON project_receipt(project_id, branch_id, status, created_at_ms, receipt_id)
schema index project_receipt_event_idx: CREATE INDEX project_receipt_event_idx ON project_receipt(event_id, created_at_ms, receipt_id) WHERE event_id IS NOT NULL
schema index project_writer_lease_active_unique: CREATE UNIQUE INDEX project_writer_lease_active_unique ON project_writer_lease(project_id, branch_id) WHERE status = 'active'
schema index project_writer_lease_status_idx: CREATE INDEX project_writer_lease_status_idx ON project_writer_lease(project_id, branch_id, status, lease_deadline_ms, lease_id)
schema table mdkg_schema_migration: CREATE TABLE mdkg_schema_migration ( migration_key TEXT PRIMARY KEY, ordinal INTEGER NOT NULL UNIQUE, checksum TEXT NOT NULL, applied_at_ms INTEGER NOT NULL, mdkg_version TEXT NOT NULL ) STRICT
schema table project_branch_state: CREATE TABLE project_branch_state ( project_id TEXT NOT NULL, branch_id TEXT NOT NULL, current_snapshot_hash TEXT NOT NULL, updated_at_ms INTEGER NOT NULL, PRIMARY KEY (project_id, branch_id) ) STRICT
schema table project_event: CREATE TABLE project_event ( event_id TEXT PRIMARY KEY, project_id TEXT NOT NULL, branch_id TEXT NOT NULL, event_type TEXT NOT NULL, schema_version INTEGER NOT NULL CHECK(schema_version > 0), idempotency_key TEXT NOT NULL, payload_json TEXT NOT NULL, payload_hash TEXT NOT NULL, actor TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('received', 'validated', 'applied', 'rejected', 'dead_letter')), occurred_at_ms INTEGER NOT NULL, created_at_ms INTEGER NOT NULL, updated_at_ms INTEGER NOT NULL, last_error TEXT ) STRICT
schema table project_meta: CREATE TABLE project_meta ( key TEXT PRIMARY KEY, value TEXT NOT NULL ) STRICT
schema table project_queue: CREATE TABLE project_queue ( queue_name TEXT PRIMARY KEY, status TEXT NOT NULL CHECK(status IN ('active', 'paused')), paused_reason TEXT, created_at_ms INTEGER NOT NULL, updated_at_ms INTEGER NOT NULL ) STRICT
schema table project_queue_message: CREATE TABLE project_queue_message ( queue_name TEXT NOT NULL, message_id TEXT NOT NULL, dedupe_key TEXT, payload_json TEXT NOT NULL, payload_hash TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('ready', 'leased', 'acked', 'dead_letter')), available_at_ms INTEGER NOT NULL, attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count >= 0), max_attempts INTEGER NOT NULL CHECK(max_attempts > 0), lease_owner TEXT, lease_deadline_ms INTEGER, created_at_ms INTEGER NOT NULL, updated_at_ms INTEGER NOT NULL, last_error TEXT, CHECK ( (status = 'leased' AND lease_owner IS NOT NULL AND lease_deadline_ms IS NOT NULL) OR (status <> 'leased' AND lease_owner IS NULL AND lease_deadline_ms IS NULL) ), PRIMARY KEY (queue_name, message_id) ) STRICT
schema table project_receipt: CREATE TABLE project_receipt ( receipt_id TEXT PRIMARY KEY, project_id TEXT NOT NULL, branch_id TEXT NOT NULL, kind TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('applied', 'rejected', 'duplicate', 'conflict', 'replay', 'dead_letter')), event_id TEXT, idempotency_key TEXT, payload_hash TEXT, base_snapshot_hash TEXT, result_snapshot_hash TEXT, reducer_name TEXT, reducer_version TEXT, lease_id TEXT, actor TEXT, artifact_path TEXT NOT NULL, artifact_hash TEXT NOT NULL, details_json TEXT NOT NULL, created_at_ms INTEGER NOT NULL ) STRICT
schema table project_writer_lease: CREATE TABLE project_writer_lease ( project_id TEXT NOT NULL, branch_id TEXT NOT NULL, lease_id TEXT NOT NULL, lease_owner TEXT NOT NULL, base_snapshot_hash TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('active', 'committed', 'released', 'expired', 'conflict')), lease_deadline_ms INTEGER NOT NULL, result_snapshot_hash TEXT, receipt_id TEXT, created_at_ms INTEGER NOT NULL, updated_at_ms INTEGER NOT NULL, last_error TEXT, PRIMARY KEY (project_id, branch_id, lease_id) ) STRICT

# Tables
table mdkg_schema_migration
columns ["migration_key","ordinal","checksum","applied_at_ms","mdkg_version"]
row {"migration_key":"mdkg.project_db.events_receipts.v1","ordinal":3,"checksum":"sha256:543e4713ecd52005ff301d121d877486dfc962d1c374fd2ec65d5b93fde2f2da","applied_at_ms":1780967938468,"mdkg_version":"0.3.0"}
row {"migration_key":"mdkg.project_db.foundation.v1","ordinal":1,"checksum":"sha256:90245c6932d9a1bfddafd89365de8859667ce1bed825cfabf81003df167a98ae","applied_at_ms":1780967938466,"mdkg_version":"0.3.0"}
row {"migration_key":"mdkg.project_db.queue.v1","ordinal":2,"checksum":"sha256:c2439de64131f3183591cd3144d3a196962ed049452cc148ef44fc72997a7111","applied_at_ms":1780967938467,"mdkg_version":"0.3.0"}
row {"migration_key":"mdkg.project_db.queue_control.v1","ordinal":5,"checksum":"sha256:4a3082a1bc71644a1235b1dc55e841021880f5a448348c8904efa12d5a40adac","applied_at_ms":1780967938470,"mdkg_version":"0.3.0"}
row {"migration_key":"mdkg.project_db.writer_leases.v1","ordinal":4,"checksum":"sha256:e2a37376fb5afa056d636fb2b2fc11334c233e71cb921da88e4f57fba8e6113f","applied_at_ms":1780967938469,"mdkg_version":"0.3.0"}

table project_branch_state
columns ["project_id","branch_id","current_snapshot_hash","updated_at_ms"]

table project_event
columns ["event_id","project_id","branch_id","event_type","schema_version","idempotency_key","payload_json","payload_hash","actor","status","occurred_at_ms","created_at_ms","updated_at_ms","last_error"]

table project_meta
columns ["key","value"]
row {"key":"last_migration_key","value":"mdkg.project_db.queue_control.v1"}
row {"key":"mdkg_version","value":"0.3.0"}
row {"key":"migration_table","value":"mdkg_schema_migration"}
row {"key":"schema_version","value":"1"}
row {"key":"tool","value":"mdkg"}

table project_queue
columns ["queue_name","status","paused_reason","created_at_ms","updated_at_ms"]

table project_queue_message
columns ["queue_name","message_id","dedupe_key","payload_json","payload_hash","status","available_at_ms","attempt_count","max_attempts","lease_owner","lease_deadline_ms","created_at_ms","updated_at_ms","last_error"]

table project_receipt
columns ["receipt_id","project_id","branch_id","kind","status","event_id","idempotency_key","payload_hash","base_snapshot_hash","result_snapshot_hash","reducer_name","reducer_version","lease_id","actor","artifact_path","artifact_hash","details_json","created_at_ms"]

table project_writer_lease
columns ["project_id","branch_id","lease_id","lease_owner","base_snapshot_hash","status","lease_deadline_ms","result_snapshot_hash","receipt_id","created_at_ms","updated_at_ms","last_error"]
