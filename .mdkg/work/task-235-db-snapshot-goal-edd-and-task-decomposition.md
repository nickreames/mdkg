---
id: task-235
type: task
title: db snapshot goal edd and task decomposition
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, planning, graph]
owners: []
links: []
artifacts: [.mdkg/design/edd-13-project-db-sealed-snapshot-and-canonical-dump-architecture.md, .mdkg/work/goal-2-complete-mdkg-db-snapshot-and-reviewability-foundation.md]
relates: [goal-2, epic-31, epic-29, edd-13, task-185, task-186, task-192]
blocked_by: []
blocks: [task-236, task-237, task-238, task-239, task-240, task-241, task-242, task-243]
refs: [edd-13, edd-12]
aliases: [db-snapshot-decomposition]
skills: [select-work-and-ground-context]
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Create the goal, EDD, and granular implementation tasks for project DB sealed
snapshot and canonical dump work.

# Acceptance Criteria

- `goal-2` scopes `epic-31` and required checks.
- `edd-13` records snapshot, manifest, canonical dump, and diff architecture.
- `task-185`, `task-186`, and `task-192` are closed as broad decomposition
  tasks after their requirements move into `edd-13` and implementation tasks.
- `mdkg goal next` returns `task-235` before source implementation begins.

# Explicit Exclusions

- No source code implementation in this decomposition task.
- No npm publish.

# Files Affected

- `.mdkg/design/edd-13-project-db-sealed-snapshot-and-canonical-dump-architecture.md`
- `.mdkg/work/goal-2-complete-mdkg-db-snapshot-and-reviewability-foundation.md`
- `.mdkg/work/task-235-*` through `.mdkg/work/task-243-*`

# Implementation Notes

Keep `epic-31` as the implementation epic. The older `task-185`, `task-186`,
and `task-192` remain historical planning records under `epic-29`.

# Test Plan

- `node dist/cli.js validate`
- `node dist/cli.js show goal-2 --json`
- `node dist/cli.js goal next --json`
- `git diff --check`

# Closeout Evidence

- Created `goal-2` with `scope_refs: [epic-31]` and the required dry-run
  publish checks.
- Created `edd-13` for sealed snapshot, manifest, canonical dump, and diff
  architecture.
- Created granular implementation tasks `task-236` through `task-243` under
  `epic-31`.
- Marked broad roadmap tasks `task-185`, `task-186`, and `task-192` done as
  decomposition work with links to the granular implementation tasks.
- Ran `node dist/cli.js index`.
- Ran `node dist/cli.js validate`; validation passed.
- Ran `node dist/cli.js goal select goal-2 --json`.
- Ran `node dist/cli.js goal next --json`; it returned `task-235` as the first
  actionable item.
- Ran `git diff --check`; no whitespace errors were reported.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
