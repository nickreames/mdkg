---
id: chk-102
type: checkpoint
title: fix plan dry-run receipt contract designed
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-327]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-327]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Designed the `0.3.3` dry-run fix-planning lane for `goal-13`. The graph now
has a concrete architecture EDD, implementation tasks, and test contracts for
`mdkg fix plan --json` before any repair apply behavior is allowed.

# Scope Covered

- `task-327`
- `epic-70`
- `edd-19`
- `task-335` through `task-339`
- `test-135` through `test-137`

# Decisions Captured

- `mdkg fix plan --json` is read-only and receipt-shaped.
- Initial repair families are `index`, `refs`, `ids`, and aggregate `all`.
- The first implementation must not add `fix apply`.
- Every planned change reports affected paths, risk, reason code, and
  `apply_supported: false`.
- Dirty worktrees are allowed for planning, but the receipt records dirty state
  so future apply behavior can refuse unsafe conditions.

# Implementation Summary

- Added `.mdkg/design/edd-19-fix-plan-and-repair-receipt-architecture.md`.
- Expanded `epic-70` from placeholder scope into the `0.3.3` fix-planning lane.
- Added implementation tasks:
  - `task-335`: command skeleton and receipt schema
  - `task-336`: index/cache repair planning
  - `task-337`: graph reference repair planning
  - `task-338`: duplicate-id repair planning
  - `task-339`: temp-repo smoke, docs, and publish gate
- Added validation nodes:
  - `test-135`: JSON receipt contract
  - `test-136`: no-mutation temp-repo contract
  - `test-137`: repair-family fixture contract
- Updated `goal-13` scope to include the new tasks/tests and recorded the
  `0.3.3` lane in the iteration log.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json` returned `ok: true` with zero warnings and
  zero errors.
- `node dist/cli.js goal next goal-13 --json` selected `task-327` before
  closeout with no warnings.
- `git diff --check` passed.

# Known Issues / Follow-ups

- Implement `task-335` next.
- `task-334` was skipped by the id allocator after a failed validated creation
  attempt; live graph ids are `task-335` through `task-339`.
- `fix apply` remains intentionally deferred.

# Links / Artifacts

- `.mdkg/design/edd-19-fix-plan-and-repair-receipt-architecture.md`
- `.mdkg/work/epic-70-fix-planning-and-repair-receipts.md`
