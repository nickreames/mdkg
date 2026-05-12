---
id: test-78
type: test
title: Cover guide empty output and list diagnostics
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, commands, test]
owners: []
links: []
artifacts: [tests/commands/guide.test.ts, tests/commands/list.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-126]
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

Validate low-frequency guide and list command diagnostics identified by the
residual coverage matrix.

# Target / Scope

`src/commands/guide.ts` empty-output branch and `src/commands/list.ts`
workspace, stale-cache, and empty-result branches.

# Preconditions / Environment

Use temporary mdkg roots with direct command invocation.

# Test Cases

- empty guide files print a blank line without errors
- list treats `--ws all` like an unscoped workspace filter
- list reports missing workspaces
- list prints the empty-result count/note
- list warns when cached indexes are stale and reindex is disabled

# Results / Evidence

- `npm test -- --test-name-pattern "GuideCommand|ListCommand|guide|list"` passed with 256 tests.
- `npm run test:coverage` passed with 256 tests.
- `src/commands/guide.ts` reports `100.00%` line / `85.71%` branch.
- `src/commands/list.ts` reports `91.43%` line / `95.24%` branch.
- All-files coverage reports `94.39%` line / `86.37%` branch.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a list or guide command redesign.
