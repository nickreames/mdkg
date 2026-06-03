---
id: task-224
type: task
title: implement mdkg db index rebuild status verify
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, index, sqlite, cli]
owners: []
links: []
artifacts: [src/commands/db.ts, src/commands/index.ts, src/cli.ts, src/graph/sqlite_index.ts, src/graph/skills_index_cache.ts, tests/commands/db_index.test.ts, CLI_COMMAND_MATRIX.md]
relates: [goal-1, epic-30, edd-12, task-181, task-223, epic-20]
blocked_by: [task-223]
blocks: [task-230, task-231]
refs: [edd-12]
aliases: [db-index-commands]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Expose index-cache inspection and rebuild behavior under `mdkg db index ...`
while preserving `mdkg index` as the compatibility shortcut.

# Acceptance Criteria

- `mdkg db index rebuild` writes the same derived indexes as `mdkg index`.
- `mdkg index` delegates to the same rebuild implementation.
- `mdkg db index status` reports JSON and human health for JSON index files and
  `.mdkg/index/mdkg.sqlite` when enabled.
- `mdkg db index verify` checks cache presence, staleness, SQLite schema
  version, and source fingerprint without mutating by default.
- Human and JSON receipts are deterministic.

# Explicit Exclusions

- No `.mdkg/db` project application state mutation.
- No change to cache source-of-truth semantics.

# Files Affected

- Index command implementation.
- SQLite index health helpers.
- CLI tests for index status and verify.

# Implementation Notes

Share implementation with `mdkg index` so compatibility behavior cannot drift.

# Test Plan

- Unit/CLI tests compare `mdkg index` and `mdkg db index rebuild` behavior.
- Tests cover fresh, stale, missing, JSON-backend, and SQLite-backend cache
  states.
- Temp repo smoke proves deleting `.mdkg/index/mdkg.sqlite` is recoverable.

# Closeout Evidence

- Implemented `mdkg db index rebuild`, `mdkg db index status`, and `mdkg db
  index verify` in `src/commands/db.ts`.
- Refactored `mdkg index` through shared rebuild behavior so the compatibility
  shortcut and `mdkg db index rebuild` cannot drift.
- Added non-mutating JSON/human status and verify receipts for global, skills,
  capabilities, subgraphs, and SQLite index cache state.
- Added SQLite schema/source-fingerprint verification helpers for the derived
  `.mdkg/index/mdkg.sqlite` cache.
- Added `tests/commands/db_index.test.ts` covering JSON backend parity,
  missing and stale cache failures, SQLite cache rebuild recovery, and corrupt
  SQLite detection.
- Verification passed: `npm run test` with 391 passing tests, `npm run
  cli:check`, `node dist/cli.js db index verify --json`, `npm run
  smoke:sqlite`, `node dist/cli.js validate`, and `git diff --check`.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
- `epic-20`
