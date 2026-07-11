---
id: test-350
type: test
title: CocoIndex remains separate from loop-node implementation contract
status: done
priority: 1
parent: goal-57
tags: [loop, planning, cocoindex, boundary, semantic-search]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-674]
blocks: []
refs: [goal-57, goal-53, goal-58, task-674, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Validate that CocoIndex, semantic search, remote references, and optional index
provider planning stay outside the loop-node implementation goal.

# Target / Scope

- `goal-57`
- `goal-58`
- `goal-53`
- `task-674`

# Preconditions / Environment

- `goal-53` remains the separate project-memory/CocoIndex planning lane.
- `goal-58` remains placeholder or later source implementation scope.

# Test Cases

- `goal-57` explicitly marks CocoIndex out of scope.
- `goal-58` explicitly excludes CocoIndex and semantic search.
- Future implementation scope does not include CocoIndex provider work.
- Any future CocoIndex work is routed to `goal-53` or a separately approved
  successor.
- JSON/SQLite first-party index behavior for loops is planned separately from
  optional semantic provider work.

# Results / Evidence

Passed for the planning lane.

- `goal-57` explicitly marks CocoIndex, semantic search, embeddings, remote
  refs, JSON provider, and SQLite provider work out of loop-node scope.
- `goal-58` explicitly excludes CocoIndex and semantic search from the future
  loop-node implementation goal.
- `goal-53` remains the separate project-memory/CocoIndex planning lane.
- `task-674` records the CocoIndex separation in the implementation handoff.

# Notes / Follow-ups

- A later project-memory/index-provider planning lane should decide visibility,
  privacy, local-only behavior, remote references, and semantic retrieval.
