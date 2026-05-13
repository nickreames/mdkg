---
id: task-127
type: task
title: Harden event command coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, event]
owners: []
links: []
artifacts: [tests/commands/task_event.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [test-79, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for low-frequency event command validation and
event-support branches identified by the residual coverage matrix.

# Acceptance Criteria

- Cover repeated event-enable output for already-created event logs.
- Cover event append validation for blank kind, blank refs, invalid status, and
  missing event log setup.
- Cover event workspace diagnostics for `--ws all` and missing workspace names.
- Keep the change test-only unless event behavior is demonstrably wrong.

# Files Affected

- `tests/commands/task_event.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Reuse the existing task/event command fixtures.
- Prefer direct command assertions over CLI subprocess coverage for validation
  branches.

# Test Plan

- `npm test -- --test-name-pattern "event"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- `npm test -- --test-name-pattern "event"` passed with 259 tests.
- `npm run test:coverage` passed with 259 tests.
- Coverage moved to all-files `94.65%` line / `86.99%` branch.
- `src/commands/event.ts` moved to `100.00%` line / `100.00%` branch.
- `src/commands/event_support.ts` moved to `94.92%` line / `91.11%` branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
