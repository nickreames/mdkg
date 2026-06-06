---
id: task-187
type: task
title: implement event envelope inbox idempotency and local event store schema
status: done
priority: 1
epic: epic-32
parent: goal-4
tags: [project-db, events, inbox, idempotency]
owners: []
links: []
artifacts: [src/core/project_db_events.ts, src/core/project_db_migrations.ts]
relates: [epic-29, epic-32, task-183, goal-4]
blocked_by: []
blocks: [task-188, task-189, task-190]
refs: [goal-4]
aliases: [project-event-envelope]
skills: []
created: 2026-05-27
updated: 2026-06-04
---

# Overview

Implement local durable event storage and idempotency handling for project DB
state transitions.

# Acceptance Criteria

- Event migration follows the queue migration and creates an internal local
  event table.
- Event envelope includes event id, project id, branch id, event type, schema
  version, idempotency key, payload hash, actor, occurred time, and payload.
- Local SQLite event inbox tracks received, validated, applied, rejected,
  duplicate, and dead-lettered states.
- Duplicate delivery with the same idempotency key and payload hash returns the
  existing event.
- Conflicting duplicate submissions produce durable conflict receipts.
- Helpers use deterministic `now_ms` injection for tests.

# Explicit Exclusions

- Queue is not canonical history.
- No hosted event store requirement in the first implementation phase.

# Files Affected

- `src/core/project_db_migrations.ts`
- `src/core/project_db_events.ts`
- Unit tests for event idempotency and conflict behavior.

# Implementation Notes

Persist durable events before worker execution. Treat queues as wake-up
mechanisms, not audit history. Do not expose a public event CLI in this pass.

# Test Plan

- Unit tests cover duplicate idempotency keys, conflicting duplicates, payload
  hash mismatch, invalid schema version, and stats table visibility.

# Links / Artifacts

- `epic-32`
- `epic-29`
- `task-183`
- `goal-4`

# Completion Evidence

- Added event/receipt migrations after the queue migration in
  `src/core/project_db_migrations.ts`.
- Added `src/core/project_db_events.ts` with durable local event envelopes,
  stable JSON payload hashing, deterministic `now_ms` injection, idempotent
  duplicate handling, and conflict receipt creation.
- Covered by `tests/commands/db_index.test.ts`, `npm run test`, and packed
  `npm run smoke:db-events`.
