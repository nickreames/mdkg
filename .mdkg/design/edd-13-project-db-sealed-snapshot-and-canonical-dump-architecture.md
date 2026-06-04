---
id: edd-13
type: edd
title: project db sealed snapshot and canonical dump architecture
tags: [project-db, snapshot, sqlite, canonical-dump, architecture]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-31, epic-30, epic-34]
refs: [edd-12, rule-4]
aliases: [project-db-snapshots, sqlite-snapshot-reviewability, canonical-db-dump]
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Project DB sealed snapshots make `.mdkg/db` application state portable and
reviewable without treating active runtime/WAL files as committed truth.

The runtime database stays local and mutable:

- `.mdkg/db/runtime/project.sqlite`

The sealed state is an explicit checkpoint:

- `.mdkg/db/state/project.sqlite`
- `.mdkg/db/state/project.manifest.json`

Canonical dumps and diffs are review aids for binary SQLite state. They are not
new sources of truth.

# Architecture

`mdkg db snapshot ...` is the project-state snapshot surface. It is separate
from `mdkg db verify`, which continues to verify the active runtime DB, and
separate from `mdkg db index ...`, which manages rebuildable graph caches.

Snapshot sealing uses the repo mutation lock, verifies runtime DB health,
checkpoints transient state where possible, writes a clean SQLite copy to a temp
path, verifies that copy, writes the manifest, and atomically replaces the
configured state snapshot and manifest paths.

# Data Model

The manifest records deterministic metadata needed to verify a sealed snapshot:

- manifest version and mdkg version
- project DB schema version and migration table
- runtime path and snapshot path
- snapshot SHA-256 and byte size
- generated timestamp
- table counts
- migration keys, ordinals, checksums, and applied timestamps
- source runtime hash when safely available

The manifest must not include WAL contents, secrets, live payment or ledger
state, marketplace state, or arbitrary runtime scratch data.

# APIs / Interfaces

First implementation command surface:

- `mdkg db snapshot seal [--json]`
- `mdkg db snapshot verify [--json]`
- `mdkg db snapshot status [--json]`
- `mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]`
- `mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]`

`mdkg db snapshot dump` defaults to the sealed snapshot when `--snapshot` is not
provided. `--output` writes the canonical dump to a repo-contained file;
otherwise the dump is printed to stdout for human review.

# Failure Modes

- Missing project DB init or migration fails with existing DB verify guidance.
- Missing sealed snapshot or manifest fails snapshot verification.
- Hash, byte-size, migration, table-count, or SQLite integrity drift fails
  verification.
- Dump and diff fail for corrupt snapshots or paths outside the repo.
- Active runtime transient files may warn, but sealing should checkpoint or copy
  from a verified clean database state.

# Observability

Every command returns deterministic JSON receipts with `--json`. Human output
should be short and command-oriented.

# Security / Privacy

Sealed snapshots are opt-in commit artifacts. Active runtime DB, WAL, SHM,
journal, lock, and temp files remain ignored. This pass does not implement
profile-level PII redaction; public exports and profile redaction are deferred
to `epic-34` and `task-234`.

# Testing Strategy

Use unit/CLI tests for manifest integrity, corrupt snapshots, stable dumps,
diffs, and unchanged existing DB behavior. Add a packed temp smoke that proves
init, migrate, seal, verify, dump, diff, validate, and index verification.

# Rollout Plan

Implement under `goal-2`, one `epic-31` task at a time. Finish with dry-run
publish readiness only; no real npm publish without explicit approval.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `task-235`
- `task-243`
