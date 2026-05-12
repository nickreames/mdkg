---
id: chk-18
type: checkpoint
title: event command coverage
status: backlog
priority: 3
tags: [0_0_4x, coverage, event]
owners: []
links: []
artifacts: [tests/commands/task_event.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-127, test-79, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-127, test-79]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Event command coverage was hardened with focused regression tests for repeated
enable, invalid append inputs, missing event log setup, and workspace
diagnostics. `src/commands/event.ts` now reports full line and branch coverage,
and `event_support` clears the module line and branch targets.

# Scope Covered

- `task-127`: Harden event command coverage.
- `test-79`: Cover event command validation branches.

# Decisions Captured

- Kept runtime behavior unchanged; this slice only adds direct command tests.
- Preserved the existing event setup model: append fails with guidance until
  `mdkg event enable` creates `events.jsonl`.

# Implementation Summary

- Added console-capture helper coverage for the event enable already-present
  branch.
- Added event append validation coverage for blank kind, blank refs, invalid
  status, and missing event log setup.
- Added workspace diagnostic coverage for `--ws all` and missing workspace names.
- Refreshed `COVERAGE_HARDENING_MATRIX.md` with the measured event coverage
  results and moved `event` out of the active command gap list.

# Verification / Testing

- `npm test -- --test-name-pattern 'event'`: 259 passed.
- `npm run test:coverage`: 259 passed.
- Current coverage: all files `94.65%` line / `86.99%` branch.
- Current `src/commands/event.ts` coverage: `100.00%` line / `100.00%`
  branch.
- Current `src/commands/event_support.ts` coverage: `94.92%` line / `91.11%`
  branch.

# Known Issues / Follow-ups

- Overall line coverage remains below the `95%` target at `94.65%`.
- Remaining user-facing command module below `90%` line coverage: `checkpoint`.

# Links / Artifacts

- `tests/commands/task_event.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
- `task-127`
- `test-79`
- `epic-13`
