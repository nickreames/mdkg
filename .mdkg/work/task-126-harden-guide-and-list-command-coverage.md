---
id: task-126
type: task
title: Harden guide and list command coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, commands]
owners: []
links: []
artifacts: [tests/commands/guide.test.ts, tests/commands/list.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [test-78, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for the remaining low-frequency guide and list
command branches identified by the coverage matrix.

# Acceptance Criteria

- Cover `guide` output for empty guide files.
- Cover `list` workspace normalization and missing-workspace diagnostics.
- Cover `list` empty-result output and stale-cache warning behavior.
- Keep the change test-only unless command behavior is demonstrably wrong.

# Files Affected

- `tests/commands/guide.test.ts`
- `tests/commands/list.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Reuse existing direct command helpers and temporary mdkg roots.
- Prefer direct `runGuideCommand` and `runListCommand` assertions over CLI
  subprocess coverage.

# Test Plan

- `npm test -- --test-name-pattern "GuideCommand|ListCommand|guide|list"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- `npm test -- --test-name-pattern "GuideCommand|ListCommand|guide|list"` passed with 256 tests.
- `npm run test:coverage` passed with 256 tests.
- Coverage moved to all-files `94.39%` line / `86.37%` branch.
- `src/commands/guide.ts` moved to `100.00%` line / `85.71%` branch.
- `src/commands/list.ts` moved to `91.43%` line / `95.24%` branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
