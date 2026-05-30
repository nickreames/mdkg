---
id: task-188
type: task
title: define receipt storage in sqlite and reviewable artifacts
status: todo
priority: 1
epic: epic-29
tags: [project-db, receipts, audit, artifacts]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-32, task-187]
blocked_by: [task-187]
blocks: [task-190, task-193]
refs: []
aliases: [project-db-receipts]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define receipts as both SQLite rows for queryability and reviewable mdkg/JSON
artifacts for Git/audit workflows.

# Acceptance Criteria

- Receipts record project, branch, batch, status, base snapshot hash, result
  snapshot hash, event batch hash, reducer version, sandbox/runtime identity,
  checks, changes, and created time.
- Applied, rejected, duplicate, conflict, replay, repair, and dead-letter
  outcomes have receipt paths.
- Artifact receipts are deterministic and safe to review.

# Explicit Exclusions

- Receipts do not imply payment, ledger, marketplace, or canonical production
  execution state unless a project profile explicitly defines those semantics.
- No secrets or credentials in receipt artifacts.

# Files Affected

- Future receipt schema, receipt artifact writer, validation, and docs.

# Implementation Notes

Keep SQLite receipt rows and reviewable artifacts consistent through shared
receipt generation and verification logic.

# Test Plan

- Future tests assert receipt row/artifact consistency, deterministic hashing,
  and validation failures for missing required receipt fields.

# Links / Artifacts

- `epic-32`
- `task-187`
