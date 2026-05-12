---
id: chk-13
type: checkpoint
title: show command metadata coverage
status: backlog
priority: 3
tags: [0_0_4x, coverage, show]
owners: []
links: []
artifacts: [tests/commands/show_nodes.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-122, test-74, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-122, test-74]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Show command metadata coverage was hardened with focused regression tests for
stale cached index warnings and optional graph metadata rendering. The command
now clears the current command-level coverage targets.

# Scope Covered

- `task-122`: Harden show command metadata coverage.
- `test-74`: Cover show command stale and edge metadata branches.

# Decisions Captured

- Kept the change test-only; show command behavior matched the intended
  warning and metadata output semantics.
- Used direct `runShowCommand` tests so the low-frequency branches are covered
  without adding subprocess-only noise.

# Implementation Summary

- Added console capture for both stdout and stderr in
  `tests/commands/show_nodes.test.ts`.
- Added a stale-index fixture that builds a cached index, advances the task file
  mtime, disables reindexing, and asserts the warning path plus normal output.
- Added a graph metadata fixture for `epic`, `parent`, `prev`, `next`,
  `relates`, `blocked_by`, and `blocks`, including reciprocal chain edges for
  validator consistency.
- Refreshed `COVERAGE_HARDENING_MATRIX.md` with the measured coverage results
  and moved `show` out of the active gap list.

# Verification / Testing

- `npm test -- --test-name-pattern 'ShowCommand|show'`: 238 passed.
- `npm run test:coverage`: 238 passed.
- Current coverage: all files `92.73%` line / `84.56%` branch.
- Current `src/commands/show.ts` coverage: `100.00%` line / `96.43%` branch.

# Known Issues / Follow-ups

- Overall branch coverage remains below the `85%` target at `84.56%`.
- Remaining user-facing command modules below `90%` line coverage:
  `checkpoint`, `doctor`, `event`, `guide`, and `list`.
- `src/commands/skill_mirror.ts` is now the highest-priority measured gap.

# Links / Artifacts

- `tests/commands/show_nodes.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
- `task-122`
- `test-74`
- `epic-13`
