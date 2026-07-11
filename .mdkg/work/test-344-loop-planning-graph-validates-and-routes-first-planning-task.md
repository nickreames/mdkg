---
id: test-344
type: test
title: Loop planning graph validates and routes first planning task
status: done
priority: 1
parent: goal-57
tags: [loop, planning, validation, goal-routing]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-667]
blocks: []
refs: [goal-57, task-667, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Validate that the mdkg-only planning lane is internally consistent and routes to
a concrete first planning task without activating the implementation goal.

# Target / Scope

- `goal-57`
- `goal-58`
- `task-667`
- `edd-66`
- `dec-65`

# Preconditions / Environment

- Planning graph nodes exist.
- Source implementation has not begun.
- The selected goal does not need to be changed to run this check.

# Test Cases

- `mdkg validate --changed-only --json` passes for the new/changed graph nodes.
- `mdkg validate --summary --json --limit 20` has no loop-planning validation
  errors.
- `mdkg goal show goal-57 --json` reports `goal_state: paused`, expected scope
  refs, required skills, and required checks.
- `mdkg goal show goal-58 --json` reports `status: blocked`,
  `goal_state: paused`, `blocked_by: [goal-57]`, and empty scope refs.
- `mdkg goal next goal-57 --json` returns the first concrete planning task.
- `mdkg pack task-667 --pack-profile concise --dry-run --stats` succeeds.

# Results / Evidence

Passed for the planning lane.

- `mdkg goal show goal-57 --json` reports `goal_state: active` after explicit
  activation, expected scope refs, required skills, and required checks.
- `mdkg goal show goal-58 --json` reports `status: blocked`,
  `goal_state: paused`, and empty executable `scope_refs`.
- `mdkg goal next goal-57 --json` routed first to `task-667`, then advanced
  through the planning tasks as each one closed.
- `mdkg pack task-667 --pack-profile concise --dry-run --stats` succeeded with
  5 included nodes and no files written.
- `mdkg validate --changed-only --json` passed with 0 warnings and 0 errors.

# Notes / Follow-ups

- This test is for the graph-only planning pass, not the source implementation.
