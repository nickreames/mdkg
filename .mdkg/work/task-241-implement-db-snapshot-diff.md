---
id: task-241
type: task
title: implement db snapshot diff
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, diff, review]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-240]
blocked_by: [task-240]
blocks: [task-242, task-243]
refs: [edd-13]
aliases: [db-snapshot-diff]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement `mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]`
over canonical dumps rather than raw SQLite bytes.

# Acceptance Criteria

- Diff compares deterministic canonical dump lines.
- Human output reports added, removed, and changed lines in stable order.
- JSON output includes left/right paths, hashes, added/removed counts, and a
  deterministic change list.
- Identical snapshots produce an empty diff and exit zero.

# Explicit Exclusions

- No binary byte-level SQLite diff.
- No semantic row-level conflict resolution.

# Files Affected

- Project DB snapshot helper module.
- `src/commands/db.ts`
- Tests.

# Implementation Notes

Compute diffs from canonical dump lines so output is stable across identical
SQLite binary layouts.

# Test Plan

- Tests cover identical snapshots and snapshots with changed deterministic
  fixture rows.

# Closeout Evidence

- 2026-06-03: Implemented `mdkg db snapshot diff <left-snapshot>
  <right-snapshot> [--json]` over canonical dump lines instead of raw SQLite
  bytes.
- 2026-06-03: Unit and packed-package smoke coverage prove identical snapshots
  produce an empty diff and changed fixture rows produce deterministic added
  lines.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
