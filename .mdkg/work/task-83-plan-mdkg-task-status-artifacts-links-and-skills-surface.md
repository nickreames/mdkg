---
id: task-83
type: task
title: plan mdkg task status artifacts links and skills surface
status: done
priority: 1
epic: epic-12
tags: [0_0_4, cli, tasks, lifecycle]
owners: []
links: []
artifacts: [src/commands/task.ts, src/cli.ts, README.md, CLI_COMMAND_MATRIX.md]
relates: [dec-13, dec-15, epic-12, task-88]
blocked_by: []
blocks: [test-43, test-47]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

The focused `mdkg task ...` surface is now implemented for task-like node mutation.

# Acceptance Criteria

- `mdkg task` supports routine lifecycle mutation for task-like nodes
- docs and command matrix reflect the surface

# Files Affected

- `src/commands/task.ts`
- `src/cli.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`

# Implementation Notes

- additive list mutation is used for routine metadata/evidence updates
- generic node mutation remains out of scope

# Test Plan

- `test-43`
- `test-47`

# Links / Artifacts

- `task-88`
