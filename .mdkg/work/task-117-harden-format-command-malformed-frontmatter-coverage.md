---
id: task-117
type: task
title: Harden format command malformed frontmatter coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, format]
owners: []
links: []
artifacts: [tests/commands/format_matrix.test.ts, COVERAGE_HARDENING_MATRIX.md]
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

Add focused regression coverage for low-frequency `format` command malformed
frontmatter branches identified by the phase 2 coverage matrix.

# Acceptance Criteria

- Cover additional scalar/list/boolean mismatch paths in `runFormatCommand`.
- Cover at least one sparse or malformed node path without changing command
  behavior.
- Keep the change test-only unless implementation behavior is demonstrably
  wrong.

# Files Affected

- `tests/commands/format_matrix.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Prefer existing test helpers and temporary repositories.
- Do not broaden release gates in this slice.

# Test Plan

- `npm test -- --test-name-pattern "format"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
