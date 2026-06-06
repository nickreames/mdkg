---
id: task-189
type: task
title: implement typed reducer write policy and replay boundaries
status: done
priority: 1
epic: epic-32
parent: goal-4
tags: [project-db, reducers, policy, replay]
owners: []
links: []
artifacts: [src/core/project_db_events.ts]
relates: [epic-29, epic-32, task-183, task-187, goal-4]
blocked_by: []
blocks: [task-190, task-193]
refs: [goal-4]
aliases: [typed-reducer-policy]
skills: []
created: 2026-05-27
updated: 2026-06-04
---

# Overview

Implement the first agent-safe write policy: agents may reason and propose, but
project DB writes flow through deterministic typed reducers and policy checks.

# Acceptance Criteria

- Reducers validate event envelopes and apply short SQLite transactions.
- Read-only SQL, schema introspection, safe aggregates, and canonical exports
  can be allowed directly.
- Writes require typed tools/reducers, policy checks, idempotency, and receipts.
- Replay boundaries define which events can reproduce materialized state from a
  sealed snapshot.
- The first reducer implementation is intentionally small and test-oriented,
  proving the helper contract without introducing public reducer CLI commands.

# Explicit Exclusions

- No arbitrary agent SQL writes.
- No long-running LLM calls inside database transactions.
- No cross-runtime determinism guarantee until explicitly tested.

# Files Affected

- `src/core/project_db_events.ts`
- Reducer registry/helper tests.

# Implementation Notes

Agents can propose or request changes, but durable writes should flow through
typed reducers with receipts and short transactions. No LLM calls or long-running
work happens inside SQLite transactions.

# Test Plan

- Unit tests cover reducer validation, rejected event receipts, replay from
  local events, and no public arbitrary write surface.

# Links / Artifacts

- `epic-32`
- `epic-29`
- `task-187`
- `goal-4`

# Completion Evidence

- Added an internal reducer registry/helper with typed reducer validation and
  short SQLite transactions.
- Implemented the initial `project_meta.set` reducer for deterministic local
  writes and replay from recorded events.
- Rejected/unsupported reducer events emit receipts, and no public reducer or
  arbitrary SQL CLI was introduced.
