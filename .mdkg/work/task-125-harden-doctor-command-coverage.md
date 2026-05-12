---
id: task-125
type: task
title: Harden doctor command coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, doctor]
owners: []
links: []
artifacts: [tests/commands/doctor.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [test-77, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for low-frequency doctor command config and
index diagnostic branches.

# Acceptance Criteria

- Cover missing and invalid config diagnostics.
- Cover text output for healthy workspaces, no-cache rebuild detail, and
  stale-cache detail when reindex is disabled.
- Cover index diagnostic failure when cached index loading fails.
- Keep the change test-only unless doctor behavior is demonstrably wrong.

# Files Affected

- `tests/commands/doctor.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Reuse existing doctor command temporary workspace fixtures.
- Prefer direct `runDoctorCommand` assertions over CLI subprocess coverage.

# Test Plan

- `npm test -- --test-name-pattern "DoctorCommand|doctor"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- `npm test -- --test-name-pattern "DoctorCommand|doctor"` passed with 251 tests.
- `npm run test:coverage` passed with 251 tests.
- Coverage moved to all-files `94.32%` line / `86.12%` branch.
- `src/commands/doctor.ts` moved to `91.03%` line / `81.48%` branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
