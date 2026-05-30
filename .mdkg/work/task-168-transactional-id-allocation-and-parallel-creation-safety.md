---
id: task-168
type: task
title: transactional id allocation and parallel creation safety
status: done
priority: 1
epic: epic-20
tags: [0_1_3, sqlite, id-allocation, parallel-safety]
owners: []
links: [src/commands/new.ts, src/commands/checkpoint.ts, src/graph/sqlite_index.ts]
artifacts: []
relates: [epic-20, task-166, task-170]
blocked_by: [task-166, task-167]
blocks: [task-170]
refs: []
aliases: [sqlite-id-reservation, parallel-new-safety]
skills: []
created: 2026-05-20
updated: 2026-05-20
---

# Overview

Use SQLite transactions to reserve numeric ids before writing Markdown in
SQLite mode, while keeping exclusive file creation and retry behavior available
to JSON-mode workspaces.

# Acceptance Criteria

- Parallel `mdkg new task ...` calls create unique task ids.
- Parallel checkpoint creation creates unique checkpoint ids.
- A failed write may skip an id, but must not create duplicate ids.
- JSON-mode workspaces still get lock/exclusive-write race hardening.

# Files Affected

- `src/commands/new.ts`
- `src/commands/checkpoint.ts`
- `src/graph/sqlite_index.ts`
- `tests/commands/sqlite_dal.test.ts`
- `scripts/smoke-parallel.js`

# Implementation Notes

Markdown remains canonical. SQLite id reservations are a coordination layer,
not a replacement for graph validation.

# Test Plan

- Unit test with repeated parallel new/checkpoint calls.
- Packed/local smoke with 32+ parallel task creations.
- `npm run smoke:parallel`

# Links / Artifacts

- `epic-20`

# Verification Evidence

- `npm run test`
- `npm run smoke:parallel`
