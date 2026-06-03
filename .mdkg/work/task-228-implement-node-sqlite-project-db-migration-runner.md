---
id: task-228
type: task
title: implement node sqlite project db migration runner
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, sqlite, migrations, node-sqlite]
owners: []
links: []
artifacts: [src/core/project_db_migrations.ts, src/commands/db.ts, src/cli.ts, tests/commands/db_index.test.ts, scripts/smoke-init.js, CLI_COMMAND_MATRIX.md]
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

- Implemented `mdkg db migrate [--json]`.
- The command uses Node's built-in `node:sqlite` and the configured
  `db.runtime_path`.
- The command requires `db.enabled: true`, a supported project DB schema
  version, and the scaffold directories created by `mdkg db init`.
- The command writes mdkg-owned generic migration files under
  `db.migrations_path` and fails on migration-file checksum drift.
- The command creates the active runtime SQLite database, creates the configured
  migration metadata table, applies `mdkg.project_db.foundation.v1`, and records
  migration key, ordinal, checksum, mdkg version, and applied timestamp.
- Repeated `mdkg db migrate --json` is idempotent: no new migrations apply and
  existing rows are reported as `already_applied`.
- The command fails clearly for disabled DB config, missing schema directories,
  corrupt SQLite files, local migration-file drift, and stored migration checksum
  drift.
- Verification passed:
  - focused `db` and CLI tests
  - `npm run test` (401 tests)
  - `npm run cli:check`
  - `npm run smoke:init`
  - `npm run smoke:upgrade`

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
