---
id: test-88
type: test
title: goal 6 graph and validation loop
status: done
priority: 1
epic: epic-39
parent: goal-6
tags: [goal, validation, mdkg]
owners: []
links: []
artifacts: []
relates: [goal-6, task-252, task-258]
blocked_by: [task-258]
blocks: [task-259]
refs: []
aliases: [goal-6-loop-validation]
skills: []
cases: []
created: 2026-06-04
updated: 2026-06-05
---
# Overview

Validate that `goal-6` recursively routes to the next concrete work item and
that graph validation passes.

# Test Cases

- `mdkg index`
- `mdkg validate`
- `mdkg goal show goal-6 --json`
- `mdkg goal next goal-6 --json`
