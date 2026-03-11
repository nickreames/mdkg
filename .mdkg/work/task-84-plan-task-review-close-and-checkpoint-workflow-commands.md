---
id: task-84
type: task
title: plan task review close and checkpoint workflow commands
status: done
priority: 1
epic: epic-12
tags: [0_0_4, cli, tasks, review]
owners: []
links: []
artifacts: [src/commands/task.ts, src/commands/checkpoint.ts, README.md]
relates: [dec-15, epic-12, task-88]
blocked_by: []
blocks: [test-43, test-47]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

The review/close/checkpoint workflow is now implemented through `mdkg task done` plus explicit checkpoint creation.

# Acceptance Criteria

- review/close flow uses focused commands instead of manual markdown editing
- checkpoint creation remains explicit and milestone-oriented

# Files Affected

- `src/commands/task.ts`
- `src/commands/checkpoint.ts`
- `README.md`

# Implementation Notes

- `mdkg task done --checkpoint "..."` is the single-writer closeout path in this wave

# Test Plan

- `test-43`
- `test-47`

# Links / Artifacts

- `task-88`
