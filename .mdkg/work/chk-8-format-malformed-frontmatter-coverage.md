---
id: chk-8
type: checkpoint
title: format malformed frontmatter coverage
status: backlog
priority: 3
tags: []
owners: []
links: []
artifacts: [tests/commands/format_matrix.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-117, test-69, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-117, test-69]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Added focused `format` command coverage for malformed frontmatter branches
without changing command behavior.

# Scope Covered

- `root:task-117`
- `root:test-69`

# Decisions Captured

- This is a coverage-hardening slice only; no release gate or behavior contract
  changed.

# Implementation Summary

- Added a `format_matrix` regression case that covers boolean values in scalar
  fields, a custom boolean template key receiving a string value, array values
  where scalars are required, and invalid files remaining untouched.
- Updated `COVERAGE_HARDENING_MATRIX.md` with the new coverage measurement.

# Verification / Testing

- `npm test -- --test-name-pattern "format"`: 225 tests passed.
- `npm run test:coverage`: 225 tests passed.
- `node dist/cli.js validate`: passed.
- Root `node third_party/mdkg-local/dist/cli.js validate`: passed.

# Known Issues / Follow-ups

- `src/commands/format.ts` line coverage remains below the command target at
  `87.84%`; branch coverage is now above the target at `85.44%`.

# Links / Artifacts

- `tests/commands/format_matrix.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
