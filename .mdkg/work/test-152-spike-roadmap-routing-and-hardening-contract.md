---
id: test-152
type: test
title: spike roadmap routing and hardening contract
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, alignment, routing, contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-364]
blocks: []
refs: []
aliases: []
skills: []
cases: [goal-14 routes to task-364 during alignment, goal-14 routes to task-348 after closeout, hardening nodes are scoped]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that the spike hardening alignment routes cleanly through `goal-14`
without creating a parallel umbrella goal or confusing future mdkg.dev work.

# Target / Scope

- `goal-14`
- `task-364`
- `task-348`
- `epic-84`

# Preconditions / Environment

- Graph-only alignment edits have been applied.
- No source/package/changelog changes are included.

# Test Cases

- `mdkg validate --json` passes with no warnings or errors.
- `mdkg goal next goal-14 --json` returns `task-364` during alignment.
- After `task-364` is done and `goal claim goal-14 task-348` runs, `goal next`
  returns `task-348` with no warnings.
- `goal-15` remains paused and is not returned as actionable work in `goal-14`.
- `git diff --check` passes.

# Results / Evidence

- Passed during alignment.
- `/opt/homebrew/bin/mdkg validate --json`: ok, zero warnings, zero errors.
- `/opt/homebrew/bin/mdkg goal next goal-14 --json`: returned `task-364` with no
  warnings.
- `git diff --check`: passed.
- Final `goal claim goal-14 task-348` is performed after `task-364` closes.

# Notes / Follow-ups

- This test can be closed during the graph-only alignment pass.
