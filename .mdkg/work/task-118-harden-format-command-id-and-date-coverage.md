---
id: task-118
type: task
title: Harden format command id and date coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, format]
owners: []
links: []
artifacts: [tests/commands/format_matrix.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for remaining `format` command malformed id,
date, and id-reference branches identified by the phase 2 coverage matrix.

# Acceptance Criteria

- Cover malformed canonical id and id-reference paths in `runFormatCommand`.
- Cover invalid created/updated date shape paths without changing command
  behavior.
- Keep the change test-only unless implementation behavior is demonstrably
  wrong.

# Files Affected

- `tests/commands/format_matrix.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Prefer existing temporary repo helpers.
- Keep assertions on deterministic error substrings and unchanged invalid
  file contents.
- Added a no-body normalization regression to cover trailing newline preservation
  and preserved-case list sorting.
- Added an error aggregation regression for malformed ids, malformed dates,
  invalid work status, scope id validation, and non-work status/priority/
  supersedes policy checks.

# Test Plan

- `npm test -- --test-name-pattern "format"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- `npm test -- --test-name-pattern "format"`: 227 tests passed.
- `npm run test:coverage`: 227 tests passed.
- `src/commands/format.ts` coverage improved to `96.62%` line / `96.40%`
  branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
