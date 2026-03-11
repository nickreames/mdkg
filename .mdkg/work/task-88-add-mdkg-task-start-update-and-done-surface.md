---
id: task-88
type: task
title: add mdkg task start update and done surface
status: done
priority: 1
epic: epic-12
tags: [0_0_4, tasks, cli, ux]
owners: []
links: []
artifacts: [src/commands/task.ts, src/cli.ts, README.md, CLI_COMMAND_MATRIX.md]
relates: [dec-15, epic-12, task-83, task-84]
blocked_by: []
blocks: [test-47]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Ship focused task lifecycle mutation commands for task, bug, and test nodes.

# Acceptance Criteria

- `mdkg task start` sets progress
- `mdkg task update` performs additive task metadata mutation
- `mdkg task done` sets done and can create a checkpoint explicitly

# Files Affected

- `src/commands/task.ts`
- `src/cli.ts`
- `README.md`

# Implementation Notes

- mutation scope is intentionally limited to task-like nodes in this wave

# Test Plan

- `test-47`
- `tests/commands/task_event.test.ts`

# Links / Artifacts

- `dec-15`
