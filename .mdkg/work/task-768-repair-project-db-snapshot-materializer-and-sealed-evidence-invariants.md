---
id: task-768
type: task
title: Repair project DB snapshot materializer and sealed evidence invariants
status: done
priority: 1
epic: epic-242
tags: [security, remediation, v0.5.0]
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
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Make snapshot and materializer receipts prove the state and authority they claim,
including queue policy, source runtime identity, and writer project/branch scope.

# Acceptance Criteria

- Close exactly `cand-review-008-003`, `cand-review-008-004`, and
  `review-007-cand-001`.
- Verify queue policy against the copied/sealed database, not only before copy.
- Missing source runtime hash cannot turn stale state into valid release evidence.
- Reducer/materializer application is constrained to the project and branch owned
  by the writer lease before effects commit.
- Existing snapshot/CAS/retry semantics remain deterministic.

# Files Affected

List files/directories expected to change.

- Project DB snapshot, events, materializer, reducer, and writer-lease modules
- Snapshot schema/manifest and focused integration tests

# Implementation Notes

- Treat temporal state changes during seal as an integrity failure or retry.
- Ensure validation uses the exact consumed database and runtime identity.
- Coordinate path handling with `task-764` but keep state proof separate.

# Test Plan

Exercise queue-state changes during seal, removed/changed runtime hashes, and
cross-project/branch event delivery. Require fail-closed receipts and run project
DB event/materializer/snapshot smokes plus `test-427` and compatibility tests.

# Links / Artifacts

- `epic-242`, `task-764`, `test-427`
