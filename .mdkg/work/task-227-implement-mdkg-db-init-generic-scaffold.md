---
id: task-227
type: task
title: implement mdkg db init generic scaffold
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, db-cli, init, scaffold]
owners: []
links: []
artifacts: [src/commands/db.ts, src/cli.ts, scripts/smoke-init.js, tests/commands/db_index.test.ts, CLI_COMMAND_MATRIX.md]
relates: [goal-1, epic-30, edd-12, task-184, task-225, task-226]
blocked_by: [task-225, task-226]
blocks: [task-229, task-230, task-231]
refs: [edd-12]
aliases: [project-db-init]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement `mdkg db init` for the generic project DB foundation.

# Acceptance Criteria

- Creates `.mdkg/db/schema`, `.mdkg/db/runtime`, `.mdkg/db/state`, and
  `.mdkg/db/receipts` when missing.
- Writes deterministic baseline metadata or manifest files needed by later
  verify/stats commands.
- Is idempotent and emits deterministic human and JSON receipts.
- Does not create committed active runtime SQLite/WAL state by default.
- Respects config path containment and disabled DB settings.

# Explicit Exclusions

- No project DB profile selection.
- No seed business-domain tables.
- No raw SQL execution interface.

# Files Affected

- DB command implementation.
- Init/upgrade docs.
- CLI tests.

# Implementation Notes

Make `mdkg db init` idempotent and generic. It should prepare local project DB
structure without choosing a domain profile.

# Test Plan

- Tests cover fresh init, repeated init, disabled config, custom contained paths,
  and invalid existing filesystem state.
- Packed temp repo smoke runs `mdkg init --agent` followed by `mdkg db init`.

# Closeout Evidence

- Implemented `mdkg db init [--json]`.
- The command creates the configured project DB scaffold directories, including
  schema, migrations, runtime dir, state dir, and receipts dir.
- The command writes deterministic project DB metadata at
  `<db.root_path>/project-db.json`.
- The command explicitly sets `db.enabled: true` and records
  `enabled_before`, `enabled_after`, and `config_updated` in JSON receipts.
- The command does not create `project.sqlite`, WAL, SHM, journal, lock, or temp
  runtime files.
- Repeated `mdkg db init --json` is idempotent: no created or updated paths
  after the first run.
- Custom contained `db.root_path` values derive omitted child paths under that
  root.
- Invalid existing filesystem state, such as a file where a scaffold directory
  is expected, fails with a validation error.
- Verification passed:
  - focused `db` and CLI tests
  - `npm run test` (399 tests)
  - `npm run cli:check`
  - `npm run smoke:init`
  - `npm run smoke:upgrade`

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
