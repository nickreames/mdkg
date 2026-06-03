---
id: task-229
type: task
title: implement mdkg db verify and stats
status: todo
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, db-cli, verify, stats]
owners: []
links: []
artifacts: []
relates: [goal-1, epic-30, edd-12, task-184, task-227, task-228]
blocked_by: [task-227, task-228]
blocks: [task-230, task-231]
refs: [edd-12]
aliases: [project-db-verify-stats]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement project DB health and summary commands under `mdkg db verify` and
`mdkg db stats`.

# Acceptance Criteria

- `mdkg db verify` checks config, layout, migration table, SQLite integrity,
  active WAL state, and receipt directory policy.
- `mdkg db stats` reports table counts, DB size, WAL state, migration version,
  state/snapshot pointers when present, and receipt counts.
- Both commands support deterministic human and JSON output.
- Verify exits nonzero for corrupt or policy-invalid state and reports clear
  remediation guidance.

# Explicit Exclusions

- No privacy redaction/export feature.
- No sealed snapshot verification beyond foundation fields.

# Files Affected

- DB command implementation.
- SQLite health helpers.
- CLI tests.

# Implementation Notes

Prefer precise diagnostics over mutation. `verify` and `stats` should not repair
state unless a future command explicitly asks for repair.

# Test Plan

- Tests cover valid, missing, corrupt, stale migration, WAL-present, and disabled
  config cases.
- Temp repo smoke proves `init`, `migrate`, `verify`, and `stats` together.

# Closeout Evidence

- Record representative JSON receipts and failure diagnostics.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
