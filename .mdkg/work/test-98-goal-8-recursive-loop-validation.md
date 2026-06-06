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

Validate that `goal-8` is selectable and starts at `task-266`.

# Test Cases

- `mdkg goal show goal-8 --json`
- `mdkg goal next goal-8 --json`
- `mdkg validate`
