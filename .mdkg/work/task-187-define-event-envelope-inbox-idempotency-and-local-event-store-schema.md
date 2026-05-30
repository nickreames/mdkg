---
id: task-187
type: task
title: define event envelope inbox idempotency and local event store schema
status: todo
priority: 1
epic: epic-29
tags: [project-db, events, inbox, idempotency]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-32, task-183]
blocked_by: [task-183]
blocks: [task-188, task-189, task-190]
refs: []
aliases: [project-event-envelope]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define local durable event storage and idempotency handling for project DB state
transitions.

# Acceptance Criteria

- Event envelope includes event id, project id, branch id, event type, schema
  version, idempotency key, payload hash, actor, occurred time, and payload.
- Local SQLite event inbox tracks received, validated, applied, rejected,
  duplicate, and dead-lettered states.
- Duplicate delivery is safe.
- Conflicting duplicate submissions produce durable receipts.

# Explicit Exclusions

- Queue is not canonical history.
- No hosted event store requirement in the first implementation phase.

# Files Affected

- Future project DB schema migrations, event validation, receipts, and tests.

# Implementation Notes

Persist durable events before worker execution. Treat queues as wake-up
mechanisms, not audit history.

# Test Plan

- Future tests cover duplicate idempotency keys, conflicting duplicates,
  payload hash mismatch, invalid schema version, and replay from local events.

# Links / Artifacts

- `epic-32`
- `task-183`
