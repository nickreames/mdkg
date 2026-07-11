---
id: task-703
type: task
title: Add nonpersisting index projection for read only loop commands
status: done
priority: 1
epic: epic-225
prev: task-702
next: task-704
tags: [loop, index, read-only, descriptor]
owners: []
links: []
artifacts: []
relates: [goal-61, test-376]
blocked_by: []
blocks: [task-704]
refs: [test-376]
context_refs: [goal-61, epic-225, edd-70, dec-67, task-702]
evidence_refs: [chk-409]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Give descriptor-declared loop read commands an in-memory index projection that
does not rewrite compatibility caches, SQLite, events, or graph files when the
index is missing or stale.

# Acceptance Criteria

- `loop list/show/plan/runs/next` work without persistent writes.
- Projection results match a normal persisted index for the same graph.
- Non-loop callers keep compatible behavior unless they explicitly adopt the
  reusable non-persisting option.

# Files Affected

List files/directories expected to change.

- Loop command read path and graph index loader
- Descriptor metadata and read-path tests

# Implementation Notes

- Prefer a reusable `persist: false` projection over command-specific parsing.
- Do not silently change generic command behavior tracked by `goal-60`.

# Test Plan

Use `test-376` to snapshot all durable state around each loop read command and
compare output with persisted-index mode.

# Links / Artifacts

- `edd-70`
- `dec-67`
- Evidence: missing and stale index fixtures snapshot the complete `.mdkg` tree
  around loop list/show/plan/next/runs for JSON and SQLite.
- Verification: all four observational backend tests and the complete 14-test
  loop command suite passed on 2026-07-10.
