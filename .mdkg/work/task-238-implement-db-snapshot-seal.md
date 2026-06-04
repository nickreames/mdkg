---
id: task-238
type: task
title: implement db snapshot seal
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, seal, sqlite]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-236, task-237]
blocked_by: [task-236, task-237]
blocks: [task-239, task-240, task-241, task-243]
refs: [edd-13]
aliases: [db-snapshot-seal]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement `mdkg db snapshot seal [--json]` for explicit sealed project DB
checkpoint creation.

# Acceptance Criteria

- Command fails before `mdkg db init` and `mdkg db migrate`.
- Command uses the repo mutation lock.
- Command verifies runtime DB health, checkpoints transient state where
  possible, creates a clean temp snapshot, verifies the snapshot, writes a
  manifest, and atomically replaces state files.
- JSON receipt includes old/new snapshot hashes, manifest path, snapshot path,
  table counts, warnings, and errors.

# Explicit Exclusions

- No automatic Git commit.
- No active WAL file commit.

# Files Affected

- `src/commands/db.ts`
- Project DB snapshot helper module.
- DB command tests.

# Implementation Notes

Prefer SQLite backup or `VACUUM INTO` semantics from the verified runtime DB.
Ensure temp files are cleaned up on failure.

# Test Plan

- Tests cover missing runtime DB, successful seal, repeated seal, manifest
  creation, and transient runtime warning behavior.

# Closeout Evidence

- 2026-06-03: Implemented `mdkg db snapshot seal [--json]` using the workspace
  mutation lock, runtime DB verification, WAL checkpoint attempt, `VACUUM INTO`
  temp snapshot creation, snapshot verification, and atomic state writes.
- 2026-06-03: Unit tests prove seal fails before migration, succeeds after
  migration, writes a manifest, and supports repeated seals.
- 2026-06-03: `npm run smoke:db-snapshot` passed and proved seal behavior in a
  packed fresh temp repo.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
