---
id: test-132
type: test
title: status json operator summary contract
status: done
priority: 1
epic: epic-74
parent: goal-13
tags: [status, json, test, 0-3-2]
owners: []
links: []
artifacts: []
relates: [task-331]
blocked_by: [task-331]
blocks: []
refs: [edd-17]
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate the public `mdkg status --json` operator summary contract.

# Target / Scope

- `task-331`
- `edd-17`

# Preconditions / Environment

- Fresh temp repo initialized with `mdkg init --agent`.

# Test Cases

- Clean repo returns `ok: true`.
- Dirty tracked and untracked files are counted.
- No upstream branch does not crash.
- Selected achieved goal is reported as stale.
- DB disabled and DB enabled states are represented.

# Results / Evidence

- Passed targeted command tests:
  `node --test dist/tests/commands/status.test.js dist/tests/commands/cli_dispatch.test.js dist/tests/commands/cli_help_matrix.test.js`.
- Passed `npm run cli:check`.
- Passed `node dist/cli.js validate --json`.
- Manual `node dist/cli.js status --json` reported the current dirty release
  worktree as `level: warn`, with graph and project DB health still valid.

# Notes / Follow-ups

- Selected achieved goal and DB enabled happy-path variants should be included
  in the broader temp-repo smoke under `task-333`.
