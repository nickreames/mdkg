---
id: task-320
type: task
title: design strict subgraph validation and refresh receipt helpers
status: todo
priority: 2
epic: epic-68
parent: goal-12
prev: task-319
next: task-321
tags: [design, strict-validation, refresh-receipt, subgraph]
owners: []
links: []
artifacts: []
relates: [goal-12]
blocked_by: [task-319]
blocks: [task-321, test-127]
refs: []
aliases: [strict-subgraph-validation, refresh-receipt-helpers]
skills: []
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Design stricter subgraph validation modes and receipt helpers for accepted
refresh workflows.

# Acceptance Criteria

- Strict mode can fail on stale bundle age, dirty source paths, source HEAD
  drift, missing validation receipt, or unaccepted local SHA.
- Receipt helper records accepted SHA, bundle hash, verification result,
  source refs, and no-secret summary.
- Helper does not push child repos or apply child upgrades.
- Failure messages are actionable.

# Files Affected

- Future CLI design and tests; none in this paused planning task.

# Implementation Notes

Strict validation should be opt-in until downstream repos have migrated.

# Test Plan

- Stale bundle failure fixture.
- Missing accepted SHA failure fixture.
- Valid refresh receipt fixture.

# Links / Artifacts

- `test-127`

# Completion Evidence

Pending.
