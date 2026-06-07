---
id: test-106
type: test
title: goal-9 recursive loop and next-node validation
status: done
priority: 1
epic: epic-53
parent: goal-9
next: test-107
tags: [goal, validation, recursive-loop]
owners: []
links: []
artifacts: []
relates: [goal-9, task-280]
blocked_by: []
blocks: []
refs: [edd-15]
aliases: [goal-9-loop-validation]
skills: []
cases: [goal-show, goal-next, active-node]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that `goal-9` is routable and starts at `task-280`.

# Test Cases

- `node dist/cli.js goal show goal-9 --json` returns the expected goal.
- `node dist/cli.js goal next goal-9 --json` returns `task-280`.
- Scope refs include epics, tasks, and tests for the full 0.3.0 lane.

# Result

Closed as historical routing validation for the start of `goal-9`.

- `task-280` records that `node dist/cli.js goal next goal-9 --json`
  selected `task-280` during the initial current-state audit.
- `chk-58` records the same audit closeout and notes that the graph validated
  with no warnings or errors after index refresh.
- Current `goal next goal-9 --json` no longer returns `task-280` because the
  goal has progressed through the scoped chain; the initial route was proven
  before functional work began.
