---
id: task-319
type: task
title: design subgraph capability sync summary command
status: todo
priority: 2
epic: epic-68
parent: goal-12
prev: task-318
next: task-320
tags: [design, capability-sync, subgraph, visibility]
owners: []
links: []
artifacts: []
relates: [goal-12]
blocked_by: [task-318]
blocks: [task-320, test-127]
refs: []
aliases: [subgraph-capability-sync-summary]
skills: []
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Design a capability sync summary that compares root and subgraph capability
indexes without leaking private content.

# Acceptance Criteria

- Summary includes counts, kinds, aliases, stale status, and visibility-safe
  source refs.
- Summary avoids raw private node bodies unless explicitly authorized.
- Output helps root decide whether subgraph refresh is needed.
- Output supports downstream script consumption.

# Files Affected

- Future CLI design and tests; none in this paused planning task.

# Implementation Notes

Capability summaries should be safe for orchestration evidence and should not
be confused with source-of-truth child graph writes.

# Test Plan

- Mixed public/private capability fixture.
- Stale subgraph fixture.
- Visibility boundary assertion.

# Links / Artifacts

- `test-127`

# Completion Evidence

Pending.
