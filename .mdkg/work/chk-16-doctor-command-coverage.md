---
id: chk-16
type: checkpoint
title: doctor command coverage
status: backlog
priority: 3
tags: [0_0_4x, coverage, doctor]
owners: []
links: []
artifacts: [tests/commands/doctor.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-125, test-77, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-125, test-77]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Doctor command coverage was hardened with focused diagnostics coverage for
missing/invalid config, healthy text output, no-cache rebuilds, stale cached
indexes, and malformed cached index failures. `src/commands/doctor.ts` now
clears the command-level line target.

# Scope Covered

- `task-125`: Harden doctor command coverage.
- `test-77`: Cover doctor config and index branches.

# Decisions Captured

- Kept runtime behavior unchanged; this slice only adds command regression
  tests.
- Exercised `runDoctorCommand` directly to cover diagnostic branches without
  broadening subprocess fixture coverage.

# Implementation Summary

- Added console-capture helpers for doctor text-output assertions.
- Added coverage for missing config and invalid config failures.
- Added coverage for healthy text output, no-cache index rebuild detail, stale
  cache detail with reindex disabled, and cached-index read failures.
- Refreshed `COVERAGE_HARDENING_MATRIX.md` with the measured doctor coverage
  results and moved `doctor` out of the active command gap list.

# Verification / Testing

- `npm test -- --test-name-pattern 'DoctorCommand|doctor'`: 251 passed.
- `npm run test:coverage`: 251 passed.
- Current coverage: all files `94.32%` line / `86.12%` branch.
- Current `src/commands/doctor.ts` coverage: `91.03%` line / `81.48%`
  branch.

# Known Issues / Follow-ups

- Overall line coverage remains below the `95%` target at `94.32%`.
- Remaining user-facing command modules below `90%` line coverage:
  `checkpoint`, `event`, `guide`, and `list`.

# Links / Artifacts

- `tests/commands/doctor.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
- `task-125`
- `test-77`
- `epic-13`
