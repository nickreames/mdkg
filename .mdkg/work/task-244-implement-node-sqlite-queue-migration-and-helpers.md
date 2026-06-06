---
id: task-244
type: task
title: implement node sqlite queue migration and helpers
status: done
priority: 1
epic: epic-33
parent: goal-3
tags: [project-db, queue, sqlite, implementation]
owners: []
links: []
artifacts: [src/core/project_db_migrations.ts, src/core/project_db_queue.ts]
relates: [goal-3, epic-33, task-247]
blocked_by: [task-247]
blocks: [task-246, task-245]
refs: [edd-12]
aliases: [node-sqlite-queue-helpers]
skills: [build-pack-and-execute-task]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Implement the mdkg-owned queue migration and internal queue helper module for
local project DB delivery state.

# Acceptance Criteria

- `mdkg.project_db.queue.v1` migration creates queue tables and indexes after
  the foundation migration.
- Internal helpers support enqueue, claim, ack, fail/retry, dead-letter, expired
  lease release, and stats.
- Helpers validate lease ownership on ack/fail and preserve dedupe semantics.
- No public queue CLI is added.

# Files Affected

List files/directories expected to change.

- `src/core/project_db_migrations.ts`
- `src/core/project_db_queue.ts`
- `package.json`

# Implementation Notes

- Keep the queue module dependency-free and compatible with packaged CommonJS
  output.
- Use SQLite transactions around state transitions only.

# Test Plan

- Targeted queue unit tests.
- `npm run smoke:db-queue`.

# Links / Artifacts

- `goal-3`
- `task-247`
- `task-246`
