---
id: test-75
type: test
title: Cover skill mirror audit and prune branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, skills, test]
owners: []
links: []
artifacts: [tests/commands/skill_mirrors.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-123]
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

Validate low-frequency skill mirror audit and sync branches identified by the
residual coverage matrix.

# Target / Scope

`src/commands/skill_mirror.ts` audit warning and stale managed mirror prune
branches.

# Preconditions / Environment

Use temporary mdkg roots with agent bootstrap markers so mirror auditing is
enabled.

# Test Cases

- missing `.agents/skills` and `.claude/skills` roots warn during validation
- missing manifest plus unmanaged mirror warn during validation
- missing mirrored skill plus stale manifest slug warn during validation
- `skill sync` prunes stale managed mirror directories and removes unexpected
  root entries from managed mirrors

# Results / Evidence

- `npm test -- --test-name-pattern 'skill mirror|skills'`: 244 passed.
- `npm run test:coverage`: 244 passed; all-files coverage `93.27%` line /
  `85.31%` branch.
- `src/commands/skill_mirror.ts` now reports `90.71%` line / `93.10%` branch
  coverage.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a mirror behavior redesign.
