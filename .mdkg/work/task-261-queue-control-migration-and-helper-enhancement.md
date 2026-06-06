---
id: task-261
type: task
title: queue control migration and helper enhancement
status: done
priority: 1
epic: epic-33
parent: goal-7
tags: [project-db, queue, sqlite, migration, implementation]
owners: []
links: []
artifacts: []
relates: [goal-7, epic-33, task-244, task-247, test-96]
blocked_by: [task-260]
blocks: [task-262, task-263]
refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Add first-class queue control state on top of the existing durable queue message
table.

# Acceptance Criteria

- Migration `005_mdkg_project_db_queue_control.sql` applies after writer leases.
- Queue control table records active/paused state and optional pause reason.
- Existing queue names in `project_queue_message` are backfilled.
- Helpers can create, pause, resume, list, show, and inspect queue readiness.
- Paused queues reject enqueue and claim but allow ack, fail, dead-letter, and
  release-expired transitions.

# Files Affected

- `src/core/project_db_migrations.ts`
- `src/core/project_db_queue.ts`
- `tests/commands/db_index.test.ts`

# Implementation Notes

- Preserve existing message table compatibility.
- Keep transaction boundaries short and deterministic.

# Test Plan

- Unit tests cover migration idempotency, pause/resume, paused enqueue/claim
  rejection, and settlement actions while paused.

# Links / Artifacts

- related docs
- related issues
- references
