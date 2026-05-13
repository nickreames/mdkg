---
id: task-129
type: task
title: Harden utility id path coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, util]
owners: []
links: []
artifacts: [tests/util/id.test.ts, tests/core/paths.test.ts, tests/core/migrate.test.ts, tests/graph/edges.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [test-81, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused unit coverage for low-level id, path, migration, and graph edge
helper branches that were keeping the all-files line coverage just below the
residual `95%` target.

# Acceptance Criteria

- Cover canonical/portable id helper true and false branches, including
  workspace-qualified refs and malformed multi-colon refs.
- Cover root resolution with explicit roots and process cwd fallback.
- Cover migration helper defensive branches for non-object and negative schema
  versions.
- Cover graph edge scalar/list normalization, malformed shapes, uppercase refs,
  invalid canonical refs, and portable ref mode.
- Keep the change test-only unless helper behavior is demonstrably wrong.

# Files Affected

- `tests/util/id.test.ts`
- `tests/core/paths.test.ts`
- `tests/core/migrate.test.ts`
- `tests/graph/edges.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Add direct pure-helper unit tests; avoid command fixture setup.
- Preserve current helper semantics around lowercase portable ids.

# Test Plan

- `npm test -- --test-name-pattern "id helper|path helper|migrateConfig|extractEdges"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- Focused helper test command passed with 269 tests.
- Coverage gate passed with 269 tests.
- All-files coverage is now `95.10%` line / `87.88%` branch.
- Helper module coverage:
  - `src/util/id.ts`: `100.00%` line / `77.27%` branch
  - `src/core/paths.ts`: `100.00%` line / `85.71%` branch
  - `src/core/migrate.ts`: `93.75%` line / `91.67%` branch
  - `src/graph/edges.ts`: `100.00%` line / `100.00%` branch

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
