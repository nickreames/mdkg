---
id: task-181
type: task
title: define mdkg db cli taxonomy and index alias policy
status: todo
priority: 1
epic: epic-30
tags: [project-db, db-cli, index, taxonomy]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-30, epic-20]
blocked_by: []
blocks: [task-184]
refs: []
aliases: [db-cli-taxonomy]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define `mdkg db ...` as the future umbrella for database-related workflows while
preserving `mdkg index` as a familiar shortcut for current index rebuilds.

# Acceptance Criteria

- Plan distinguishes `.mdkg/index/mdkg.sqlite` rebuildable graph cache from
  `.mdkg/db` project application databases.
- `mdkg db index ...` is planned for index-cache inspection/rebuild workflows.
- `mdkg index` remains a compatibility shortcut.
- `mdkg db project ...` or equivalent project DB subcommands are scoped without
  colliding with graph index semantics.

# Explicit Exclusions

- No source implementation in this planning task.
- No removal of `mdkg index`.

# Files Affected

- Future CLI, docs, and command matrix files.

# Implementation Notes

Keep database terminology explicit: `.mdkg/index` is a rebuildable graph cache,
while `.mdkg/db` is project application state.

# Test Plan

- Future CLI help snapshot proves `mdkg db` and `mdkg index` remain clear.
- Command matrix parity covers both command surfaces.

# Links / Artifacts

- `epic-29`
- `epic-30`
- `epic-20`
