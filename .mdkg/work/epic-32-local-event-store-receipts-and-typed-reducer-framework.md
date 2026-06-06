---
id: epic-32
type: epic
title: local event store receipts and typed reducer framework
status: done
priority: 1
tags: [project-db, events, receipts, reducers]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-25, epic-26, goal-4, goal-5]
blocked_by: []
blocks: [task-187, task-188, task-189, task-190]
refs: []
aliases: [project-event-store, typed-reducers]
skills: []
created: 2026-05-27
updated: 2026-06-04
---

# Overview

Define local durable event storage, idempotency, receipts, and typed reducers so
project DB writes are explainable and replayable.

# Goal

Plan the local event, receipt, and typed reducer model for project DB state
transitions.

# Scope

- Event envelopes and local event inbox.
- Idempotency and duplicate/conflict behavior.
- Receipt rows and reviewable artifacts.
- Typed reducer policy and replay boundaries.

# Acceptance Criteria

- Event envelopes include identity, actor, schema version, idempotency key,
  payload hash, and payload.
- Applied events produce receipts stored in SQLite and reviewable artifacts.
- Writes flow through typed reducers and policy checks, not arbitrary agent SQL.
- Replay boundaries and conflict receipt behavior are defined.

# Milestones

- Event schema is defined.
- Receipt storage is defined.
- Reducer write policy and replay model are ready for implementation.
- Local event, receipt, reducer, writer lease, and CAS helpers shipped in
  `mdkg@0.1.9` with `smoke:db-events` coverage.

# Out of Scope

- No queue-only persistence.
- No LLM calls inside database transactions.
- No hosted queue dependency in the first implementation phase.

# Risks

- Queue delivery being mistaken for durable event history.
- Receipt artifacts diverging from SQLite receipt rows.
- Unsafe agent writes bypassing reducers and policy checks.

# Links / Artifacts

- `epic-29`
- `goal-4`
- `goal-5`
- `task-187`
- `task-188`
- `task-189`
- `task-190`
