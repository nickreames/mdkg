---
id: chk-10
type: checkpoint
title: pack skills and dry-run coverage
status: backlog
priority: 3
tags: []
owners: []
links: []
artifacts: [tests/commands/pack_additional.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-119, test-71, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-119, test-71]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Added focused `pack` command coverage for skills policy, stale skill-index
fallback, and dry-run truncation summary branches without changing command
behavior.

# Scope Covered

- `root:task-119`
- `root:test-71`

# Decisions Captured

- This remains a coverage-hardening slice only; `pack` behavior and release
  gates were not changed.

# Implementation Summary

- Added a `pack_additional` regression case for explicit empty skills policy
  and full skill-body fallback when a stale skills index points at a missing
  `SKILL.md`.
- Added a `pack_additional` dry-run regression case that reports latest
  checkpoint metadata, dropped nodes, and body-truncated nodes.
- Updated `COVERAGE_HARDENING_MATRIX.md` with the new coverage measurement and
  moved `commands/pack` out of the highest-value remaining command gaps.

# Verification / Testing

- `npm test -- --test-name-pattern "pack"`: 229 tests passed.
- `npm run test:coverage`: 229 tests passed.
- `src/commands/pack.ts` coverage improved to `96.26%` line / `87.23%`
  branch.

# Known Issues / Follow-ups

- `src/pack/pack.ts` still remains below target at `88.48%` line / `74.07%`
  branch; remaining work is in traversal and verbose-core fallback branches.

# Links / Artifacts

- `tests/commands/pack_additional.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
