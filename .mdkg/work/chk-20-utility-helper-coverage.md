---
id: chk-20
type: checkpoint
title: utility helper coverage
status: backlog
priority: 3
tags: [0_0_4x, coverage, util]
owners: []
links: []
artifacts: [tests/util/id.test.ts, tests/core/paths.test.ts, tests/core/migrate.test.ts, tests/graph/edges.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-129, test-81, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-129, test-81]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Utility/helper coverage was hardened for id/ref validation, root path helpers,
config migration guards, and graph edge extraction. The all-files coverage gate
now clears the residual `95%` line threshold.

# Scope Covered

- `task-129`
- `test-81`

# Decisions Captured

- Kept the slice test-only; no helper behavior changed.
- Used direct pure-helper unit tests instead of command fixture setup.

# Implementation Summary

- Added unit coverage for canonical and portable id/ref helpers.
- Added path helper coverage for explicit root resolution, cwd fallback, and
  mdkg config path construction.
- Added migration coverage for defensive schema-version and legacy workspace
  handling.
- Added graph edge extraction coverage for scalar/list normalization, malformed
  shapes, uppercase refs, canonical validation, and portable-ref mode.
- Updated `COVERAGE_HARDENING_MATRIX.md` with the post-slice coverage numbers.

# Verification / Testing

- `npm test -- --test-name-pattern "id helper|path helper|migrateConfig|extractEdges"` passed with 269 tests.
- `npm run test:coverage` passed with 269 tests.
- Coverage result: `95.10%` line / `87.88%` branch across all files.
- Helper highlights:
  - `src/util/id.ts`: `100.00%` line / `77.27%` branch
  - `src/core/paths.ts`: `100.00%` line / `85.71%` branch
  - `src/core/migrate.ts`: `93.75%` line / `91.67%` branch
  - `src/graph/edges.ts`: `100.00%` line / `100.00%` branch

# Known Issues / Follow-ups

- Remaining gaps are low-value defensive paths and branch-only hardening.
- No production behavior change was made in this slice.

# Links / Artifacts

- `tests/util/id.test.ts`
- `tests/core/paths.test.ts`
- `tests/core/migrate.test.ts`
- `tests/graph/edges.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
