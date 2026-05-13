---
id: test-72
type: test
title: Cover pack engine traversal and verbose warnings
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, pack, test]
owners: []
links: []
artifacts: [tests/pack/pack.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-120]
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

Validate pack engine traversal, verbose-core warning, and missing-file fallback
branches so future pack engine changes preserve current behavior.

# Target / Scope

`src/pack/pack.ts` line and branch coverage.

# Preconditions / Environment

Use temporary mdkg roots and the existing pack engine fixture helpers.

# Test Cases

- traversal includes `prev`, `next`, `blocked_by`, and `blocks` edges while
  ignoring duplicate and missing neighbors
- verbose core list reports ambiguous and missing ids
- missing source files for selected nodes fail deterministically
- latest checkpoint resolver breaks equal date ties by qid

# Results / Evidence

- `npm test -- --test-name-pattern "pack"`: 233 tests passed.
- `npm run test:coverage`: 233 tests passed.
- `src/pack/pack.ts` coverage improved to `95.85%` line / `88.57%` branch.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a pack engine redesign.
