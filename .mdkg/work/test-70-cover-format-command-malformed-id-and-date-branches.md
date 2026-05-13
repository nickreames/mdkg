---
id: test-70
type: test
title: Cover format command malformed id and date branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, format, test]
owners: []
links: []
artifacts: [tests/commands/format_matrix.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-118]
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

Validate additional `format` command id, date, and id-reference malformed
frontmatter branches so future normalization changes preserve error reporting.

# Target / Scope

`src/commands/format.ts` line and branch coverage.

# Preconditions / Environment

Use temporary mdkg roots and the existing config/templates helpers.

# Test Cases

- malformed node ids report canonical id errors
- malformed id-reference scalar/list entries report deterministic errors
- invalid created/updated date shapes report deterministic errors
- invalid files remain untouched

# Results / Evidence

- `npm test -- --test-name-pattern "format"`: 227 tests passed.
- `npm run test:coverage`: 227 tests passed.
- `src/commands/format.ts` coverage improved to `96.62%` line / `96.40%`
  branch.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a behavior redesign.
