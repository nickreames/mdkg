---
id: test-98
type: test
title: goal 8 recursive loop validation
status: todo
priority: 1
epic: epic-46
parent: goal-8
tags: [goal, validation, mdkg]
owners: []
links: []
artifacts: []
relates: [goal-8, task-266]
blocked_by: []
blocks: [task-279]
refs: []
aliases: [goal-8-loop-validation]
skills: []
cases: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that `goal-8` is selectable and routes through the scoped recursive
loop. The initial route to `task-266` is recorded in goal completion evidence;
current routing reflects the progressed active node.

# Test Cases

- `mdkg goal show goal-8 --json`
- `mdkg goal next goal-8 --json`
- `mdkg validate`

# Validation Evidence

- `node dist/cli.js goal show goal-8 --json` showed `goal_state: active`.
- `node dist/cli.js goal next goal-8 --json` returned scoped work from
  `goal-8`.
- `node dist/cli.js validate --json` passed with zero warnings and zero
  errors.
- `goal-8` completion evidence records the initial `task-266` handoff and the
  later active-node progression.
