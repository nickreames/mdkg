---
id: task-225
type: task
title: define and validate mdkg db layout ignore policy
status: todo
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, filesystem, gitignore, wal]
owners: []
links: []
artifacts: []
relates: [goal-1, epic-30, edd-12, task-182, epic-31]
blocked_by: [task-223]
blocks: [task-227, task-228, task-229, task-230, task-231]
refs: [edd-12, rule-4]
aliases: [db-layout-ignore-policy]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement the generic `.mdkg/db/{schema,runtime,state,receipts}` layout and
ignore policy for project application databases.

# Acceptance Criteria

- Fresh init/upgrade guidance includes `.mdkg/db` directory policy.
- Runtime DB files, WAL, SHM, journal, lock, and temp files are ignored by
  default.
- Schema files, manifests, receipt artifacts, and opt-in sealed snapshots are
  commit-eligible by explicit policy.
- The layout remains separate from `.mdkg/index` and does not affect graph index
  scanning.
- `doctor` or validation guidance catches obviously unsafe active runtime files
  when practical.

# Explicit Exclusions

- No default commit of active runtime DBs.
- No sealed snapshot implementation beyond policy needed for this phase.

# Files Affected

- Init/upgrade ignore generation.
- Project DB layout helpers.
- Doctor/validation diagnostics.

# Implementation Notes

Keep `.mdkg/db` files distinct from `.mdkg/index` caches and from mdkg graph
Markdown scanning.

# Test Plan

- Unit tests cover ignore entries and contained paths.
- Temp repo smoke proves fresh init plus `mdkg db init` creates coherent layout.
- Validation confirms `.mdkg/db/runtime` is not treated as mdkg graph content.

# Closeout Evidence

- Record temp repo layout and ignore-policy proof.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
- `rule-4`
