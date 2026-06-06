---
id: test-85
type: test
title: project db graph consolidation and next-goal selection contract
status: done
priority: 1
epic: epic-29
parent: goal-5
tags: [project-db, alignment, goal, selection]
owners: []
links: []
artifacts: []
relates: [goal-5, task-249, task-191, task-193]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Validate that the project DB graph consolidation produces one active umbrella
goal and routes future work to the intended materializer design node.

# Target / Scope

- `goal-5`
- `task-249`
- `task-191`
- `task-193`

# Preconditions / Environment

- Alignment edits are complete and indexed.
- Functional source files are unchanged by this pass.

# Test Cases

- `node dist/cli.js validate` passes.
- `node dist/cli.js goal current --json` shows `goal-5` after selection.
- `node dist/cli.js goal next goal-5 --json` returns `task-191` after
  `task-249` closes.
- `git diff --check` passes.

# Results / Evidence

- `node dist/cli.js index` completed after alignment edits.
- `node dist/cli.js validate` passed.
- `node dist/cli.js goal select goal-5 --json` selected the active umbrella goal.
- `node dist/cli.js goal next goal-5 --json` returned `task-249` before
  alignment closeout.
- `node dist/cli.js task done task-249 --checkpoint "project db roadmap alignment" --json`
  closed the alignment task and created `chk-28`.
- `node dist/cli.js goal current --json` shows selected `goal-5` with
  `active_node: task-191`.
- `node dist/cli.js goal next goal-5 --json` returns `task-191` with no
  warnings.
- `node dist/cli.js goal claim goal-5 task-191 --json` succeeds after explicit
  project DB scope includes the materializer epic.

# Notes / Follow-ups

- This test is mdkg-only and does not require package or runtime changes.
