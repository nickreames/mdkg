---
id: task-182
type: task
title: define mdkg db layout and ignore rules
status: todo
priority: 1
epic: epic-29
tags: [project-db, filesystem, gitignore, wal]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-30, epic-31]
blocked_by: []
blocks: [task-184, task-185, task-192]
refs: [rule-4]
aliases: [project-db-layout]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define the default generic project DB layout under `.mdkg/db/`.

# Acceptance Criteria

- Layout includes `.mdkg/db/schema`, `.mdkg/db/runtime`, `.mdkg/db/state`, and
  `.mdkg/db/receipts`.
- Runtime databases and WAL/SHM/journal sidecars are ignored.
- Schema, manifests, receipt artifacts, and opt-in sealed snapshots are
  commit-eligible by explicit policy.
- Layout stays separate from `.mdkg/index`.

# Explicit Exclusions

- No active WAL commits.
- No default commit of sealed snapshots.

# Files Affected

- Future init assets, config, gitignore policy, and repo safety rule docs.

# Implementation Notes

Keep runtime files disposable and ignored. Treat sealed snapshots and manifests
as opt-in review artifacts, never active runtime state.

# Test Plan

- Future init/upgrade tests assert ignore rules and directories are coherent.
- Doctor tests warn on active WAL sidecars staged for commit.

# Links / Artifacts

- `epic-29`
- `epic-30`
- `epic-31`
- `rule-4`
