---
id: task-167
type: task
title: sqlite schema and index rebuild backend
status: done
priority: 1
epic: epic-20
tags: [0_1_3, sqlite, index, dal, cache]
owners: []
links: [src/graph/sqlite_index.ts, src/graph/reindex.ts]
artifacts: []
relates: [epic-20, task-165, task-169]
blocked_by: [task-165]
blocks: [task-170]
refs: [epic-19, epic-22, epic-23, epic-24]
aliases: [sqlite-index-backend]
skills: []
created: 2026-05-20
updated: 2026-05-20
---

# Overview

Build `.mdkg/index/mdkg.sqlite` as a rebuildable derived cache over Markdown,
skills, capabilities, archives, bundle imports, source hashes, and schema
metadata.

# Acceptance Criteria

- `mdkg index` writes JSON compatibility indexes in all modes.
- SQLite mode also writes `.mdkg/index/mdkg.sqlite`.
- SQLite cache includes nodes, edges, skills, capabilities, archives, bundle
  imports, source hashes, and schema metadata.
- SQLite is rebuilt from source files and never treated as canonical storage.
- Missing SQLite cache is recoverable through `mdkg index`.

# Files Affected

- `src/graph/sqlite_index.ts`
- `src/graph/reindex.ts`
- `src/commands/index.ts`
- `src/commands/doctor.ts`
- `src/commands/validate.ts`

# Implementation Notes

Read command JSON shapes stay unchanged. SQLite is introduced as a DAL/cache
foundation, not as a public output contract break.

# Test Plan

- Unit coverage for SQLite index creation and legacy JSON-mode config.
- `npm run smoke:sqlite`
- Delete SQLite in a temp repo and confirm `mdkg index` restores it.

# Links / Artifacts

- `epic-20`

# Verification Evidence

- `npm run test`
- `npm run smoke:sqlite`
- `node dist/cli.js index`
