---
id: task-376
type: task
title: archive superseded legacy roadmap goals
status: done
priority: 1
epic: epic-86
parent: goal-16
tags: [0.3.3, archived, legacy]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-375]
blocks: [test-161, task-377]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Archive `goal-11`, `goal-12`, and `goal-15` after the new archived state is supported.

# Acceptance Criteria

- `goal-11` links to `goal-19` and relevant `goal-21` work.
- `goal-12` links to `goal-18`.
- `goal-15` links to `goal-21`.
- Archived goals retain historical notes and remain auditable.

# Files Affected

- .mdkg/work/goal-11*.md
- .mdkg/work/goal-12*.md
- .mdkg/work/goal-15*.md

# Implementation Notes

- This task is intentionally blocked until archived is valid.
- Do not delete legacy files.

# Test Plan

- Validate archived goals.
- Show/search explicit archived filters.

# Links / Artifacts

- 2026-06-16 execution:
  - `node dist/cli.js goal archive goal-11 --json` archived `root:goal-11`; it remains related to `goal-19` and `goal-21`.
  - `node dist/cli.js goal archive goal-12 --json` archived `root:goal-12`; it remains related to `goal-18`.
  - `node dist/cli.js goal archive goal-15 --json` archived `root:goal-15`; it remains related to `goal-21`.
- Verification:
  - `node dist/cli.js index` rebuilt JSON, capability, subgraph, and SQLite indexes.
  - `node dist/cli.js validate --json` passed with 0 warnings/errors.
  - `node dist/cli.js list --type goal --status archived --json` returned exactly `goal-11`, `goal-12`, and `goal-15`.
  - `node dist/cli.js search "deferred execution" --type goal --status archived --json` returned `root:goal-11`.
  - `node dist/cli.js show goal-15 --json` returned archived `root:goal-15` with supersession body text intact.
  - `node dist/cli.js goal current --json` still returned active `root:goal-16`.
  - `node dist/cli.js goal next goal-11 --json` returned `node: null` with archived warning.
  - `node dist/cli.js goal activate goal-11 --json` failed with `cannot activate archived goal root:goal-11`.
  - `git diff --check` passed.
