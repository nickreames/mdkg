---
id: task-128
type: task
title: Harden checkpoint command coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, checkpoint]
owners: []
links: []
artifacts: [tests/commands/checkpoint.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [test-80, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for the remaining checkpoint command validation
and slug/id edge branches identified by the residual coverage matrix.

# Acceptance Criteria

- Cover blank title, invalid workspace, invalid status, invalid priority,
  invalid scope, invalid relates, and missing relates diagnostics.
- Cover checkpoint slug fallback/truncation and non-numeric checkpoint id
  scanning.
- Keep the change test-only unless checkpoint behavior is demonstrably wrong.

# Files Affected

- `tests/commands/checkpoint.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Reuse existing checkpoint command temporary workspace fixtures.
- Prefer direct `runCheckpointNewCommand` assertions over CLI subprocess
  coverage for validation branches.

# Test Plan

- `npm test -- --test-name-pattern "checkpoint"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- `npm test -- --test-name-pattern "checkpoint"` passed with 261 tests.
- `npm run test:coverage` passed with 261 tests.
- Coverage moved to all-files `94.85%` line / `87.36%` branch.
- `src/commands/checkpoint.ts` moved to `98.61%` line / `94.83%` branch.
- No user-facing command modules remain below `90%` line coverage.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
