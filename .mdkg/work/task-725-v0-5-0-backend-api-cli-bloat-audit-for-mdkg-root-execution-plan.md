---
id: task-725
type: task
title: v0.5.0 backend API CLI bloat audit for mdkg root execution plan
status: done
priority: 1
parent: loop-6
tags: [loop-template, audit, backend, api, cli, loop-fork, loop-child, task]
owners: []
links: []
artifacts: []
relates: [loop-6, spike-31, prop-5, task-728, test-399, goal-60]
blocked_by: []
blocks: []
refs: [loop-6, template://loops/backend-api-cli-bloat-audit, spike-31, prop-5, task-728, test-399]
context_refs: [root:goal-61, goal-59, goal-60]
evidence_refs: [spike-31, prop-5]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Execute the authorized read-only backend/API/CLI audit, quantify the current command surface and ownership hotspots, and preserve a bounded future simplification path without refactoring the v0.5.0 release candidate.

# Acceptance Criteria

- Inventory public commands, categories, parser helper concentration, flag-heavy commands, and the largest command modules.
- Evaluate ownership boundaries, duplicated parsing/dispatch logic, descriptor coverage, and compatibility risk from current source and generated contracts.
- Record at least three viable simplification paths and one recommendation in `prop-5`.
- Preserve future planning as `task-728` and `test-399` under paused `goal-60`; do not perform the decomposition in this read-only loop.
- Confirm no current correctness defect requires widening `goal-61` beyond its release hardening scope.

# Test Plan

Validate the measurements in `spike-31`, proposal alternatives in `prop-5`, future ownership in `goal-60`, and identity-scoped evidence for all six audit lanes.

# Execution Evidence

- Inventory: 116 public commands in 35 categories.
- `src/cli.ts`: 3,677 lines, 217 `requireFlagValue` calls, and 145 `parseBooleanFlag` calls.
- Largest command hotspot: `src/commands/loop.ts` at 2,035 lines; the descriptor pilot is useful but does not yet generalize command dispatch.
- Recommendation: incremental loop-owned decomposition before broader descriptor rollout, deferred to `goal-60` through `prop-5`, `task-728`, and `test-399`.

# Files Affected

# Implementation Notes

# Links / Artifacts
