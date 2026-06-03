---
id: task-228
type: task
title: implement node sqlite project db migration runner
status: todo
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, sqlite, migrations, node-sqlite]
owners: []
links: []
artifacts: []
relates: [goal-1, epic-30, edd-12, task-183, task-184, task-225, task-226]
blocked_by: [task-225, task-226]
blocks: [task-229, task-230, task-231]
refs: [edd-12]
aliases: [project-db-migrations]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement `mdkg db migrate` using Node's built-in `node:sqlite` for deterministic
local project DB schema migrations.

# Acceptance Criteria

- Uses `node:sqlite` and respects the package Node engine requirement.
- Tracks migration keys, checksums, order, and applied timestamps in project DB
  metadata.
- Applies only mdkg-owned generic foundation migrations in this pass.
- Fails clearly on checksum drift, missing schema directory, incompatible
  version, or corrupt SQLite file.
- Emits deterministic human and JSON receipts.

# Explicit Exclusions

- No profile-specific migrations.
- No arbitrary agent SQL.
- No Rust sidecar.

# Files Affected

- Project DB migration runner.
- SQLite helpers.
- CLI tests and temp repo smoke.

# Implementation Notes

Use `node:sqlite` directly and keep migrations deterministic. This runner is
for mdkg-owned generic foundation migrations only.

# Test Plan

- Unit tests cover first migration, repeated no-op migration, checksum drift,
  corrupt DB, and missing directories.
- Temp repo smoke proves `mdkg db migrate` after `mdkg db init`.

# Closeout Evidence

- Record migration receipt, schema version, and failure-mode tests.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
