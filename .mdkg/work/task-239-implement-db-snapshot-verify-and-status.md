---
id: task-239
type: task
title: implement db snapshot verify and status
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, verify, status]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-237, task-238]
blocked_by: [task-237, task-238]
blocks: [task-240, task-241, task-243]
refs: [edd-13]
aliases: [db-snapshot-verify-status]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement `mdkg db snapshot verify [--json]` and `mdkg db snapshot status
[--json]`.

# Acceptance Criteria

- `verify` exits nonzero for missing snapshot, missing manifest, corrupt
  snapshot, hash mismatch, byte-size mismatch, table-count mismatch, or
  migration metadata mismatch.
- `status` is non-mutating and reports missing, valid, invalid, stale, and
  warning states without throwing for ordinary missing snapshot state.
- Human and JSON outputs are deterministic.

# Explicit Exclusions

- No runtime DB repair behavior.
- No public/private redaction enforcement.

# Files Affected

- `src/commands/db.ts`
- Project DB snapshot helper module.
- DB command tests.

# Implementation Notes

Keep `status` tolerant and non-mutating. Keep `verify` strict and nonzero on
invalid sealed snapshot state.

# Test Plan

- Tests cover valid snapshot, missing files, corrupt snapshot, manifest drift,
  and status behavior.

# Closeout Evidence

- 2026-06-03: Implemented `mdkg db snapshot verify [--json]` with strict
  nonzero failure for missing, corrupt, drifted, or manifest-invalid sealed
  snapshot state.
- 2026-06-03: Implemented `mdkg db snapshot status [--json]` as tolerant
  non-mutating health reporting for missing, valid, invalid, and stale states.
- 2026-06-03: Unit tests and `npm run smoke:db-snapshot` cover missing,
  valid, stale, manifest drift, and corrupt snapshot cases.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
