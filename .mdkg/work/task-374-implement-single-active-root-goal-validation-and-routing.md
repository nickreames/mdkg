---
id: task-374
type: task
title: implement single-active root goal validation and routing
status: done
priority: 1
epic: epic-85
parent: goal-16
tags: [0.3.3, goal-lifecycle, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-373]
blocks: [test-159, test-160, task-378]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Implement single-active root goal enforcement and route default goal commands away from archived or conflicting states.

# Acceptance Criteria

- Multiple active root goals fail strict validation with typed diagnostics.
- Subgraphs can independently validate their own active goal without mutating root state.
- Default current/next routing is deterministic.

# Files Affected

- src/**
- tests/**
- scripts/**

# Implementation Notes

- Keep JSON diagnostics machine-readable.
- Avoid changing child repo state.

# Test Plan

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/goal.test.js`
- `node --test dist/tests/graph/validate_graph.test.js`
- `node --test dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/command_contract.test.js`
- Temp-repo smoke remains in task-378.

# Results / Evidence

- Implemented `mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]`.
- `goal activate` sets the target goal to `status: progress`, `goal_state: active`, pauses competing local active root goals in the same workspace, writes selected-goal state, and returns paused-goal receipt data.
- Added graph validation for multiple active local root goals, ignoring imported subgraph goals.
- Updated CLI help, command contract target metadata, README, command matrix, and init assets.
- `npm run build` passed and regenerated `dist/command-contract.json`.
- `npm run build:test` passed.
- `node --test dist/tests/commands/goal.test.js` passed 12 tests.
- `node --test dist/tests/graph/validate_graph.test.js` passed 5 tests.
- `node --test dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/command_contract.test.js` passed 9 tests.

# Links / Artifacts

- `test-159`
- `test-160`
