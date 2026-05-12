---
id: task-122
type: task
title: Harden show command metadata coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, show]
owners: []
links: []
artifacts: [tests/commands/show_nodes.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for `src/commands/show.ts` stale-index warning
and optional edge metadata rendering branches.

# Acceptance Criteria

- Cover stale cached index warning behavior when reindex is disabled.
- Cover text output for `epic`, `parent`, `prev`, `next`, `relates`,
  `blocked_by`, and `blocks` metadata.
- Keep the change test-only unless show command behavior is demonstrably wrong.

# Files Affected

- `tests/commands/show_nodes.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Reuse the existing show node fixture style and console capture helper.
- Prefer direct `runShowCommand` assertions over CLI subprocess coverage.

# Test Plan

- `npm test -- --test-name-pattern "ShowCommand|show"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- Added direct `runShowCommand` coverage for stale cached index warnings when
  `noReindex` is set.
- Added metadata rendering coverage for `epic`, `parent`, `prev`, `next`,
  `relates`, `blocked_by`, and `blocks` text output.
- `npm test -- --test-name-pattern 'ShowCommand|show'`: 238 passed.
- `npm run test:coverage`: 238 passed; all-files coverage `92.73%` line /
  `84.56%` branch; `src/commands/show.ts` coverage `100.00%` line / `96.43%`
  branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
