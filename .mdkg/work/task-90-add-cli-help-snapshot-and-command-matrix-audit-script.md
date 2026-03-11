---
id: task-90
type: task
title: add cli help snapshot and command matrix audit script
status: done
priority: 1
epic: epic-12
tags: [0_0_4, docs, cli, audit]
owners: []
links: []
artifacts: [scripts/cli_help_snapshot.js, package.json, CLI_COMMAND_MATRIX.md]
relates: [dec-14, dec-15, epic-12]
blocked_by: []
blocks: [test-49]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add a stable CLI snapshot and parity check so the manual command matrix remains trustworthy.

# Acceptance Criteria

- `npm run cli:snapshot` emits stable JSON
- `npm run cli:check` verifies the command matrix against live help

# Files Affected

- `scripts/cli_help_snapshot.js`
- `package.json`
- `CLI_COMMAND_MATRIX.md`

# Implementation Notes

- the snapshot captures usage lines only, not quickstart examples

# Test Plan

- `test-49`
- `tests/commands/task_event.test.ts`

# Links / Artifacts

- `dec-14`
