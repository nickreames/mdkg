---
id: chk-9
type: checkpoint
title: format id and date coverage
status: backlog
priority: 3
tags: []
owners: []
links: []
artifacts: [tests/commands/format_matrix.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-118, test-70, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-118, test-70]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Added focused `format` command coverage for malformed id/date branches and
no-body formatting behavior without changing command behavior.

# Scope Covered

- `root:task-118`
- `root:test-70`

# Decisions Captured

- This remains a coverage-hardening slice only; `format` behavior and release
  gates were not changed.

# Implementation Summary

- Added a `format_matrix` regression case for no-body files with trailing
  newlines and preserved-case list sorting.
- Added a `format_matrix` regression case for malformed ids, malformed
  created/updated date shapes, invalid work statuses, scope id validation, and
  non-work status/priority/supersedes policy errors.
- Updated `COVERAGE_HARDENING_MATRIX.md` with the new coverage measurement and
  moved `format` out of the highest-value remaining gaps.

# Verification / Testing

- `npm test -- --test-name-pattern "format"`: 227 tests passed.
- `npm run test:coverage`: 227 tests passed.
- `src/commands/format.ts` coverage improved to `96.62%` line / `96.40%`
  branch.

# Known Issues / Follow-ups

- `format` still has unreadable-file and missing-schema fallback lines
  uncovered; these are low-value relative to the next `pack`, `cli`, `show`,
  and `skill_mirror` gaps.

# Links / Artifacts

- `tests/commands/format_matrix.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
