---
id: test-79
type: test
title: Cover event command validation branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, event, test]
owners: []
links: []
artifacts: [tests/commands/task_event.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-127]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Validate low-frequency event command validation and event-support diagnostics
identified by the residual coverage matrix.

# Target / Scope

`src/commands/event.ts` and related validation paths in
`src/commands/event_support.ts`.

# Preconditions / Environment

Use temporary mdkg roots with direct event command invocation.

# Test Cases

- enabling events twice reports the already-present branch
- event append rejects blank kind, blank refs, and invalid status
- event append rejects missing event logs with setup guidance
- event commands reject `--ws all` and missing workspaces

# Results / Evidence

- `npm test -- --test-name-pattern "event"` passed with 259 tests.
- `npm run test:coverage` passed with 259 tests.
- `src/commands/event.ts` reports `100.00%` line / `100.00%` branch.
- `src/commands/event_support.ts` reports `94.92%` line / `91.11%` branch.
- All-files coverage reports `94.65%` line / `86.99%` branch.

# Notes / Follow-ups

- This is a coverage-hardening slice, not an event command redesign.
