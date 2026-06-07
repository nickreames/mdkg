---
id: task-305
type: task
title: audit current 0.3.0 CLI UX polish gaps and lock release boundary
status: done
priority: 1
epic: epic-64
parent: goal-10
next: task-306
tags: [audit, polish, release]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-306]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Record the current 0.3.0 CLI UX polish gaps before source mutation and lock
the no-publish release boundary for `goal-10`.

# Acceptance Criteria

- Confirm `goal-9` is achieved and `goal-10` is the active polish lane.
- Capture the concrete docs/help gaps: mismatched README/init work-order ids,
  sparse `work` top-level help, sparse trigger/status/verify help, and unclear
  `spec validate` no-arg behavior.
- Confirm safe-to-defer work lives in paused `goal-11`.
- Record that no real `npm publish`, tag, or push is in scope.

# Files Affected

- Graph evidence only for this task.

# Implementation Notes

- This task is read-only except for evidence updates.

# Test Plan

- `node dist/cli.js goal current --json`
- `node dist/cli.js goal next goal-10 --json`
- `node dist/cli.js validate --json`
- `git diff --check`

# Links / Artifacts

- `goal-10`
- `goal-11`

# Audit Evidence

Recorded before source polish work.

- `node dist/cli.js validate --json` passed with no errors before graph
  scaffolding; after scaffolding, the only transient warning was stale SQLite
  cache until `mdkg index` is rerun.
- `goal-9` is `done` and `achieved`; `goal-10` is now the active polish lane.
- Preflight found requested `epic-63` was skipped by a failed forward-ref
  scaffold attempt, so the actual polish epic is `epic-64`; no `epic-63` file
  exists.
- CLI/docs gaps confirmed:
  - README and init README examples mix trigger-created order ids with manual
    order ids.
  - `mdkg work --help` does not list `work order status` or
    `work receipt verify`.
  - `work trigger/status/verify` help is accurate but sparse for first-run UX.
  - `spec validate --help` does not clearly explain no-arg validation.
- Deferred work is captured under paused `goal-11` and remains out of scope for
  0.3.0 polish.
- Stop condition remains: no real `npm publish`, no tag, no push.
