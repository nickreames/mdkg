---
id: chk-17
type: checkpoint
title: guide list command coverage
status: backlog
priority: 3
tags: [0_0_4x, coverage, commands]
owners: []
links: []
artifacts: [tests/commands/guide.test.ts, tests/commands/list.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-126, test-78, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-126, test-78]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Guide and list command coverage was hardened with focused regression tests for
empty guide output, list workspace normalization, missing workspace errors,
empty list output, and stale-cache warnings. Both commands now clear the
command-level line target.

# Scope Covered

- `task-126`: Harden guide and list command coverage.
- `test-78`: Cover guide empty output and list diagnostics.

# Decisions Captured

- Kept runtime behavior unchanged; this slice only adds direct command tests.
- Preserved the existing list convention that count and empty-state notes are
  written to stderr.

# Implementation Summary

- Added guide coverage for empty guide files emitting a blank line.
- Added a focused list command test file covering workspace `all`
  normalization, unknown workspaces, empty-result notes, and stale cached index
  warnings.
- Refreshed `COVERAGE_HARDENING_MATRIX.md` with the measured guide/list
  coverage results and moved both commands out of the active gap list.

# Verification / Testing

- `npm test -- --test-name-pattern 'GuideCommand|ListCommand|guide|list'`: 256 passed.
- `npm run test:coverage`: 256 passed.
- Current coverage: all files `94.39%` line / `86.37%` branch.
- Current `src/commands/guide.ts` coverage: `100.00%` line / `85.71%`
  branch.
- Current `src/commands/list.ts` coverage: `91.43%` line / `95.24%` branch.

# Known Issues / Follow-ups

- Overall line coverage remains below the `95%` target at `94.39%`.
- Remaining user-facing command modules below `90%` line coverage:
  `checkpoint` and `event`.

# Links / Artifacts

- `tests/commands/guide.test.ts`
- `tests/commands/list.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
- `task-126`
- `test-78`
- `epic-13`
