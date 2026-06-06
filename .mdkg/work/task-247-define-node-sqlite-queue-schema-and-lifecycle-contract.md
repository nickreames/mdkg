---
id: task-247
type: task
title: define node sqlite queue schema and lifecycle contract
status: done
priority: 1
epic: epic-33
parent: goal-3
tags: [project-db, queue, sqlite, contract]
owners: []
links: []
artifacts: [src/core/project_db_migrations.ts, src/core/project_db_queue.ts, tests/commands/db_index.test.ts]
relates: [goal-3, epic-33, task-184, task-190, task-191]
blocked_by: []
blocks: [task-244, task-246, task-245]
refs: [edd-12]
aliases: [node-sqlite-queue-contract]
skills: [select-work-and-ground-context]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Define the internal local node:sqlite queue schema and lifecycle contract for
mdkg project DB delivery state.

# Acceptance Criteria

- Contract defines `project_queue_message` fields, statuses, timestamps, retry
  policy, lease ownership, dedupe behavior, and payload hashing.
- Contract states that queue state is delivery infrastructure, not canonical
  event history.
- Contract explicitly defers public `mdkg db queue ...` CLI commands and hosted
  queue adapters.

# Files Affected

List files/directories expected to change.

- `src/core/project_db_migrations.ts`
- `src/core/project_db_queue.ts`
- `tests/commands/db_index.test.ts`
- `scripts/smoke-db-queue.js`

# Implementation Notes

- Helpers must accept deterministic `now_ms` injection for tests.
- Queue transactions must be short and must not wrap worker/LLM execution.

# Test Plan

- Unit tests for migration, dedupe, claim order, lease validation, retry,
  dead-letter, and stats.
- Packed queue smoke in a fresh temp repo.

# Links / Artifacts

- `goal-3`
- `epic-33`
- `task-244`
- `task-246`
