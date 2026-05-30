---
id: task-186
type: task
title: define canonical dump and sqlite diff review aids
status: todo
priority: 1
epic: epic-29
tags: [project-db, canonical-dump, diff, review]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-31, task-185]
blocked_by: [task-185]
blocks: [task-192, task-193]
refs: []
aliases: [sqlite-canonical-diff]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define deterministic human-review aids for binary SQLite snapshots.

# Acceptance Criteria

- Canonical dump orders schema, tables, and rows deterministically.
- BLOBs are summarized by hash unless small and safe.
- Volatile fields can be omitted or normalized.
- Private fields can be redacted for public review.
- Diff command compares canonical dumps, not raw binary bytes.

# Explicit Exclusions

- No default public export of full SQLite snapshots.
- No embeddings or approximate retrieval output.

# Files Affected

- Future dump/diff commands, redaction helpers, docs, and tests.

# Implementation Notes

Canonical output is for review and diffability. It is not a new source of truth
and should be reproducible from the sealed snapshot.

# Test Plan

- Future tests prove stable dump output for identical DBs.
- Diff tests cover added, removed, changed, redacted, and binary summarized rows.

# Links / Artifacts

- `epic-31`
- `task-185`
