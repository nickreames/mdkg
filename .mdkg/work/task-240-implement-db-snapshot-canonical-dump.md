---
id: task-240
type: task
title: implement db snapshot canonical dump
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, canonical-dump, review]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-237, task-239]
blocked_by: [task-237, task-239]
blocks: [task-241, task-242, task-243]
refs: [edd-13]
aliases: [db-snapshot-dump]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement `mdkg db snapshot dump [--snapshot <path>] [--output <path>]
[--json]` as a deterministic human-review aid.

# Acceptance Criteria

- Defaults to the configured sealed snapshot.
- Orders schema, tables, columns, and rows deterministically.
- Summarizes BLOB values by hash and size.
- Writes to `--output` atomically when supplied, otherwise prints the dump.
- JSON receipt includes snapshot path, output path, line count, and SHA-256.

# Explicit Exclusions

- No profile redaction flags in this pass.
- No arbitrary live runtime SQL dump command.

# Files Affected

- Project DB snapshot helper module.
- `src/commands/db.ts`
- Tests.

# Implementation Notes

Use deterministic table, column, and row ordering. Treat output as review text,
not source truth.

# Test Plan

- Tests prove stable dump output for identical DBs and safe BLOB summaries.

# Closeout Evidence

- 2026-06-03: Implemented `mdkg db snapshot dump [--snapshot <path>]
  [--output <path>] [--json]`.
- 2026-06-03: Canonical dump orders schema, tables, columns, and rows
  deterministically and summarizes BLOB values by SHA-256 plus byte size.
- 2026-06-03: Tests and `npm run smoke:db-snapshot` prove dump output and
  output-file receipt behavior.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
