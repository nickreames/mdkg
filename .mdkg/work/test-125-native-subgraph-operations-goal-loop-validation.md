---
id: test-125
type: test
title: native subgraph operations goal loop validation
status: todo
priority: 2
epic: epic-68
tags: [test, goal-12, recursive-loop]
owners: []
links: []
artifacts: []
relates: [goal-12, task-316]
blocked_by: [task-316]
blocks: [task-321]
refs: []
aliases: [goal-12-loop-validation]
skills: []
cases: [goal-show, goal-next, paused-state]
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Validate that the native subgraph operations goal is discoverable and starts at
`task-316` when resumed.

# Target / Scope

- `goal-12`
- `task-316`

# Preconditions / Environment

- Graph is indexed.

# Test Cases

- `mdkg goal show goal-12 --json` returns the goal.
- `mdkg goal next goal-12 --json` returns `task-316`.
- Goal is paused until the 0.3.0 release lane is closed.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None.
