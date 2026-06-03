---
id: task-184
type: task
title: define project db init migrate verify stats commands
status: todo
priority: 1
epic: epic-30
tags: [project-db, db-cli, init, migrate, verify]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-30, task-181, task-182, task-183]
blocked_by: [task-181, task-182, task-183]
blocks: [task-193]
refs: []
aliases: [project-db-lifecycle-commands]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define the first project DB lifecycle commands under the future `mdkg db`
surface.

# Acceptance Criteria

- Command plan covers project DB init, migrate, verify, and stats.
- Commands use Node `node:sqlite` for the first implementation.
- Verify checks schema migrations, integrity, runtime/state layout, and receipt
  policy.
- Stats reports table counts, DB size, WAL state, snapshot pointer, and profile.

# Explicit Exclusions

- No arbitrary agent SQL write command.
- No queue materializer command in this foundation task.

# Files Affected

- Future `mdkg db` command implementation, CLI help, command matrix, and tests.

# Implementation Notes

Use Node `node:sqlite` for the first implementation and keep write operations
behind typed lifecycle commands rather than raw SQL.

# Test Plan

- Future CLI tests cover human and JSON output for init/migrate/verify/stats.
- Temp repo smoke proves commands work in a fresh mdkg project.

# Links / Artifacts

- `epic-30`
- `task-181`
- `task-182`
- `task-183`
