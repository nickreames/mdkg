---
id: task-249
type: task
title: consolidate project db 0.1.9 graph state and close achieved foundations
status: done
priority: 1
epic: epic-29
parent: goal-5
tags: [project-db, alignment, roadmap, closeout]
owners: []
links: []
artifacts: []
relates: [goal-5, epic-20, epic-29, epic-32, epic-33, epic-34]
blocked_by: []
blocks: [test-85]
refs: [goal-1, goal-2, goal-3, goal-4]
aliases: [project-db-roadmap-alignment]
skills: [verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Perform a mdkg-only alignment pass after the 0.1.9 release so achieved project
DB foundation work is no longer presented as active work and the next functional
slice routes through `goal-5` to `task-191`.

# Acceptance Criteria

- `goal-5` exists as the one active project DB roadmap goal.
- Achieved project DB foundation epics and stale blockers reflect the 0.1.9
  release state.
- Future materializer and profile/export tasks and tests are explicit without
  starting functional implementation.
- `mdkg goal next goal-5` returns `task-191` after this task and `test-85` close.

# Files Affected

- `.mdkg/work`

# Implementation Notes

- Do not edit `src/**`, `scripts/**`, package files, release docs, npm state,
  tags, pushes, or functional implementation files.
- Use manual markdown edits for epic status/body changes because `mdkg task ...`
  does not close epics.

# Test Plan

- `node dist/cli.js validate`
- `node dist/cli.js goal next goal-5 --json` before and after closeout
- `node dist/cli.js goal current --json`
- `git diff --check`

# Links / Artifacts

- `goal-5`
- `goal-1`
- `goal-2`
- `goal-3`
- `goal-4`
- `test-85`
- `task-191`
