---
id: task-185
type: task
title: define sealed snapshot manifest hash and integrity contract
status: done
priority: 1
epic: epic-29
tags: [project-db, snapshot, manifest, integrity]
owners: []
links: []
artifacts: [.mdkg/design/edd-13-project-db-sealed-snapshot-and-canonical-dump-architecture.md, .mdkg/work/task-237-snapshot-manifest-contract-and-integrity-helpers.md, .mdkg/work/task-238-implement-db-snapshot-seal.md, .mdkg/work/task-239-implement-db-snapshot-verify-and-status.md]
relates: [epic-29, epic-31, task-182]
blocked_by: []
blocks: [task-186, task-190, task-192, task-193]
refs: [edd-13]
aliases: [sealed-snapshot-contract]
skills: []
created: 2026-05-27
updated: 2026-06-03
---

# Overview

Define sealed snapshots as clean, checkpointed, verified SQLite artifacts with
manifests and content hashes.

# Acceptance Criteria

- Seal flow acquires a writer lease or requires stopped writers, commits pending
  work, runs integrity checks, checkpoints or backups the DB, writes a clean
  snapshot, computes hashes and table counts, writes a manifest, and updates the
  snapshot pointer via compare-and-swap.
- Active WAL files are never treated as sealed artifacts.
- Sealed snapshots are opt-in for Git commits.

# Explicit Exclusions

- No active WAL commits.
- No direct public exposure of private project snapshots.

# Files Affected

- Future seal/verify commands, manifest schema, Git policy docs, and tests.

# Implementation Notes

Seal from a clean/checkpointed database state and record enough manifest data to
verify the snapshot without trusting runtime sidecars.

# Test Plan

- Future tests verify manifest hash matching, corrupt snapshot detection,
  missing manifest errors, and stale base snapshot rejection.
- Temp repo smoke seals and verifies a small project DB.

# Links / Artifacts

- `epic-31`
- `task-182`

# Closeout Evidence

This broad roadmap task is closed as decomposition work. The sealed snapshot
manifest and integrity requirements are now captured in `edd-13` and the
granular implementation tasks:

- `task-237`: manifest contract and integrity helpers.
- `task-238`: snapshot seal.
- `task-239`: snapshot verify and status.
