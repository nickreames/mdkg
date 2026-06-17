---
id: task-411
type: task
title: implement import-template selected-goal activation semantics
status: done
priority: 1
epic: epic-104
parent: goal-19
tags: [0.3.6, graph-import, selected-goal]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-410]
blocks: [test-178, task-412]
refs: []
aliases: []
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Implement lifecycle-safe selected-goal semantics for `mdkg graph import-template`.

# Acceptance Criteria

- `--select-goal --apply` activates the rewritten imported start goal.
- Competing active local root goals and non-selected imported active root goals are paused.
- Dry-run receipts report planned activation and pauses without writing files.
- Invalid achieved or archived selected start goals fail before writing.
- Active-goal conflicts without `--select-goal` fail before writing with guidance.

# Files Affected

- `src/commands/graph.ts`
- `tests/commands/graph.test.ts`

# Implementation Notes

- Match `mdkg goal activate` lifecycle shape: selected goal `status: progress`, `goal_state: active`; paused goals `status: blocked`, `goal_state: paused`.
- Write selected-goal state only after indexes rebuild and validation succeeds.

# Test Plan

- `npm run test`
- `node dist/cli.js validate --json`

# Links / Artifacts

- test-178
