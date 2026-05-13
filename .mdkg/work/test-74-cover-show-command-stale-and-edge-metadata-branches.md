---
id: test-74
type: test
title: Cover show command stale and edge metadata branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, show, test]
owners: []
links: []
artifacts: [tests/commands/show_nodes.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-122]
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

Validate low-frequency show command warning and metadata rendering branches
identified by the residual coverage matrix.

# Target / Scope

`src/commands/show.ts` stale warning and edge metadata branches.

# Preconditions / Environment

Use temporary mdkg roots with existing show command fixture helpers.

# Test Cases

- stale cached index emits a warning when `noReindex` is set
- text output includes `epic`, `parent`, `prev`, `next`, `relates`,
  `blocked_by`, and `blocks` lines

# Results / Evidence

- `npm test -- --test-name-pattern 'ShowCommand|show'`: 238 passed.
- `npm run test:coverage`: 238 passed; all-files coverage `92.73%` line /
  `84.56%` branch.
- `src/commands/show.ts` now reports `100.00%` line / `96.43%` branch
  coverage.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a show command redesign.
