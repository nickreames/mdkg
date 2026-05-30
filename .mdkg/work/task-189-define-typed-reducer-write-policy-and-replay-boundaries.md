---
id: task-189
type: task
title: define typed reducer write policy and replay boundaries
status: todo
priority: 1
epic: epic-29
tags: [project-db, reducers, policy, replay]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-32, task-183, task-187]
blocked_by: [task-183, task-187]
blocks: [task-190, task-193]
refs: []
aliases: [typed-reducer-policy]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define the agent-safe write policy: agents may reason and propose, but project
DB writes flow through deterministic typed reducers and policy checks.

# Acceptance Criteria

- Reducers validate event envelopes and apply short SQLite transactions.
- Read-only SQL, schema introspection, safe aggregates, and canonical exports
  can be allowed directly.
- Writes require typed tools/reducers, policy checks, idempotency, and receipts.
- Replay boundaries define which events can reproduce materialized state from a
  sealed snapshot.

# Explicit Exclusions

- No arbitrary agent SQL writes.
- No long-running LLM calls inside database transactions.
- No cross-runtime determinism guarantee until explicitly tested.

# Files Affected

- Future reducer registry, policy checks, replay tooling, and tests.

# Implementation Notes

Agents can propose or request changes, but durable writes should flow through
typed reducers with receipts and short transactions.

# Test Plan

- Future tests cover reducer validation, rejected event receipts, replay from
  snapshot plus events, and blocked arbitrary write attempts.

# Links / Artifacts

- `epic-32`
- `task-187`
