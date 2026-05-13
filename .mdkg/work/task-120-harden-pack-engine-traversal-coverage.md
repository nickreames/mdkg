---
id: task-120
type: task
title: Harden pack engine traversal coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, pack]
owners: []
links: []
artifacts: [tests/pack/pack.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-12, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for low-frequency `src/pack/pack.ts` traversal,
missing-file, and verbose-core warning branches identified by the phase 2
coverage matrix.

# Acceptance Criteria

- Cover `prev`, `next`, `blocked_by`, and `blocks` traversal branches with
  de-duplication behavior.
- Cover verbose core ambiguous and missing-id warnings.
- Cover missing packed-node source file errors.
- Keep the change test-only unless implementation behavior is demonstrably
  wrong.

# Files Affected

- `tests/pack/pack.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Prefer existing pack engine fixture helpers.
- Keep assertions on `buildPack` results and warnings.
- Added traversal coverage for `prev`, `next`, `blocked_by`, and `blocks`,
  including duplicate edge de-duplication and an unavailable neighbor ignored
  during collection.
- Added verbose-core ambiguity coverage by indexing duplicate ids across
  workspaces without a workspace hint.
- Added selected-node missing file coverage and latest-checkpoint qid
  tie-break coverage.

# Test Plan

- `npm test -- --test-name-pattern "pack"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- `npm test -- --test-name-pattern "pack"`: 233 tests passed.
- `npm run test:coverage`: 233 tests passed.
- `src/pack/pack.ts` coverage improved to `95.85%` line / `88.57%` branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
