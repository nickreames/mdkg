---
id: chk-11
type: checkpoint
title: pack engine traversal coverage
status: backlog
priority: 3
tags: []
owners: []
links: []
artifacts: [tests/pack/pack.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-120, test-72, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-120, test-72]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Added focused `buildPack` engine regression coverage for traversal edges,
verbose core-list diagnostics, missing selected-node source files, and latest
checkpoint tie-break behavior.

# Scope Covered

- `root:task-120`
- `root:test-72`

# Decisions Captured

- This remains a coverage-hardening slice only; pack engine behavior was not
  redesigned or changed.

# Implementation Summary

- Added a traversal regression case covering `prev`, `next`, `blocked_by`, and
  `blocks` edges, including duplicate edge de-duplication and ignored missing
  neighbors.
- Added verbose core-list warning coverage for ambiguous ids across workspaces
  and missing ids.
- Added deterministic error coverage for a selected node whose source file has
  been removed after index creation.
- Added latest-checkpoint date tie-break coverage so equal dates resolve by
  qid.
- Updated `COVERAGE_HARDENING_MATRIX.md` with the new coverage measurement and
  moved pack engine traversal out of the highest-value remaining gaps.

# Verification / Testing

- `npm test -- --test-name-pattern "pack"`: 233 tests passed.
- `npm run test:coverage`: 233 tests passed.
- `src/pack/pack.ts` coverage improved to `95.85%` line / `88.57%` branch.

# Known Issues / Follow-ups

- `src/pack/pack.ts` still has low-frequency private defensive guards outside
  the public `buildPack` path uncovered (`32-33`, `67`, `83-84`, `106-107`,
  `146-147`), but the module now exceeds the line and branch targets.

# Links / Artifacts

- `tests/pack/pack.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
