---
id: task-237
type: task
title: snapshot manifest contract and integrity helpers
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, manifest, integrity]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-235]
blocked_by: [task-235]
blocks: [task-238, task-239, task-240, task-241, task-243]
refs: [edd-13]
aliases: [snapshot-manifest-contract]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement shared helpers for sealed snapshot manifests, hashing, SQLite
integrity checks, table counts, and migration metadata.

# Acceptance Criteria

- Manifest includes version, mdkg version, project DB schema version, runtime
  path, snapshot path, snapshot SHA-256, byte size, generated timestamp, table
  counts, migration keys/checksums, and source runtime hash when available.
- Helpers verify manifest hash, size, SQLite integrity, table counts, and
  migration metadata.
- Path handling stays repo-contained and deterministic.

# Explicit Exclusions

- No profile-level redaction model.
- No event/reducer receipt manifest fields.

# Files Affected

- Project DB snapshot helper module.
- DB command tests.

# Implementation Notes

Use `node:sqlite` and existing project DB migration verification helpers where
possible. Keep manifest fields stable and JSON-friendly.

# Test Plan

- Unit tests cover valid manifests, missing manifests, hash drift, size drift,
  corrupt snapshots, and migration drift.

# Closeout Evidence

- 2026-06-03: Added `src/core/project_db_snapshot.ts` with sealed snapshot
  manifest, hashing, SQLite integrity, migration metadata, table counts, and
  repo-contained path helpers.
- 2026-06-03: Unit coverage verifies manifest drift, hash/size mismatch,
  corrupt snapshots, and deterministic metadata.
- 2026-06-03: Focused DB tests passed with `node --test
  dist/tests/commands/db_index.test.js`.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
