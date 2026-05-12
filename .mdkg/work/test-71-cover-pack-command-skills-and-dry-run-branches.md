---
id: test-71
type: test
title: Cover pack command skills and dry-run branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, pack, test]
owners: []
links: []
artifacts: [tests/commands/pack_additional.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-119]
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

Validate additional `pack` command branches for skills policy, stale skill-index
fallback, and dry-run truncation reporting.

# Target / Scope

`src/commands/pack.ts` branch coverage.

# Preconditions / Environment

Use temporary mdkg roots and existing pack command fixture helpers.

# Test Cases

- explicit empty skills policy omits skill nodes
- stale skill index with missing `SKILL.md` falls back to metadata body
- dry-run summary reports latest checkpoint metadata, dropped nodes, and
  body-truncated nodes

# Results / Evidence

- `npm test -- --test-name-pattern "pack"`: 229 tests passed.
- `npm run test:coverage`: 229 tests passed.
- `src/commands/pack.ts` coverage improved to `96.26%` line / `87.23%`
  branch.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a pack behavior redesign.
