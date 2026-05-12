---
id: test-69
type: test
title: Cover format command malformed frontmatter branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, format, test]
owners: []
links: []
artifacts: [tests/commands/format_matrix.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-117]
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

Validate additional `format` command malformed frontmatter branches so future
format cleanup does not regress error reporting.

# Target / Scope

`src/commands/format.ts` branch coverage.

# Preconditions / Environment

Use temporary mdkg roots and the existing test config/templates helpers.

# Test Cases

- malformed frontmatter key kinds report deterministic errors
- sparse or malformed work node fields do not rewrite invalid files

# Results / Evidence

- `npm test -- --test-name-pattern "format"`: 225 tests passed.
- `npm run test:coverage`: 225 tests passed.
- `src/commands/format.ts` coverage improved to `87.84%` line / `85.44%`
  branch.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a behavior redesign.
