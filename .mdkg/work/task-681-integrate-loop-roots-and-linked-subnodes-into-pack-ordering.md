---
id: task-681
type: task
title: integrate loop roots and linked subnodes into pack ordering
status: done
priority: 1
epic: epic-216
parent: goal-58
tags: [loop, pack, context, ordering]
owners: []
links: []
artifacts: [src/pack/pack.ts, tests/pack/pack.test.ts]
relates: []
blocked_by: [task-675, task-677]
blocks: []
refs: [goal-58, edd-66, dec-65, task-673, test-357]
context_refs: []
evidence_refs: [chk-387]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Make loop nodes useful as context-pack roots and related context nodes without
allowing unbounded graph expansion.

# Acceptance Criteria

- A loop-root pack includes the loop, applicable goals/subgoals, linked child
  tasks/tests/spikes/proposals/checkpoints/receipts, evidence, and decisions in
  deterministic order.
- Pack truncation and visibility behavior remain bounded and explicit.
- Existing task, goal, manifest, and work packs are unchanged except where they
  intentionally include loop refs.

# Files Affected

- `src/pack/pack.ts`
- `src/pack/order.ts`
- pack tests and fixtures

# Implementation Notes

- Treat current loop state as a projection over durable graph nodes and events.
- Avoid hidden runtime state or semantic-search retrieval.

# Test Plan

- Loop-root pack tests.
- Bounded context/truncation tests.
- Regression tests for existing pack roots.

# Links / Artifacts

- `task-673`
- `test-357`
