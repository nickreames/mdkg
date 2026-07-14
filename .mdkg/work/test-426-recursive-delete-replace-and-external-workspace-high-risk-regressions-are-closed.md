---
id: test-426
type: test
title: Recursive delete replace and external workspace high-risk regressions are closed
status: done
priority: 0
epic: epic-241
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Independently prove closure of the five high findings and the project-DB migration
containment instance through real command/API entrypoints.

# Target / Scope

`task-764`; mirror manifest cleanup/replacement, workspace aliases, snapshots,
SQLite index/ID reservation, and project DB migration/runtime paths.

# Preconditions / Environment

Disposable linked roots and external sentinel files/databases; exact built source.

# Test Cases

- Recursive mirror delete/replace through slug/root links is rejected pre-delete.
- Workspace aliases cannot route external persistent read/write state.
- Snapshot dump/diff and SQLite rebuild/reservation reject linked ancestors.
- DB migration/runtime opens reject linked migration and runtime DB paths.
- Error receipts are stable and no partial state remains.

# Results / Evidence

- Mirror cleanup rejects invalid manifest slugs and linked mirror ancestry.
- Workspace registration and stored aliases reject linked ancestry before
  external state access.
- Snapshot dump/diff, SQLite rebuild/reservation, and project DB
  migration/runtime paths reject links without changing outside sentinels.
- Dedicated high-risk and containment suites, full package tests, SQLite/DB
  smokes, and changed-only validation passed. See `chk-499` and `chk-500`.

# Notes / Follow-ups

- Closed for the assigned high-risk instances. Goal 64 remains blocked by the
  still-active remainder of Goal 69, not by these containment regressions.
