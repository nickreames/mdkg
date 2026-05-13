---
id: test-80
type: test
title: Cover checkpoint validation branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, checkpoint, test]
owners: []
links: []
artifacts: [tests/commands/checkpoint.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-128]
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

Validate low-frequency checkpoint command validation and slug/id edge branches
identified by the residual coverage matrix.

# Target / Scope

`src/commands/checkpoint.ts` validation, slug, and checkpoint id scanning paths.

# Preconditions / Environment

Use temporary mdkg roots with direct checkpoint command invocation.

# Test Cases

- checkpoint creation rejects blank title, `--ws all`, missing workspace,
  invalid status, invalid priority, invalid scope, invalid relates, and missing
  related nodes
- checkpoint creation falls back to `checkpoint` slug for punctuation-only
  titles and truncates very long slugs
- checkpoint id scanning ignores non-numeric `chk-*` ids

# Results / Evidence

- `npm test -- --test-name-pattern "checkpoint"` passed with 261 tests.
- `npm run test:coverage` passed with 261 tests.
- `src/commands/checkpoint.ts` reports `98.61%` line / `94.83%` branch.
- All-files coverage reports `94.85%` line / `87.36%` branch.
- No user-facing command modules remain below `90%` line coverage.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a checkpoint command redesign.
