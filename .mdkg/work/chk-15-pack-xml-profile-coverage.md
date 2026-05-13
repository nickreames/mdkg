---
id: chk-15
type: checkpoint
title: pack XML profile coverage
status: backlog
priority: 3
tags: [0_0_4x, coverage, pack]
owners: []
links: []
artifacts: [tests/pack/exporters.test.ts, tests/pack/profile.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-124, test-76, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-124, test-76]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Pack XML exporter and profile helper coverage was hardened with focused unit
tests for optional XML rendering, escaping, profile validation, fallback
summaries, empty bodies, and code-block truncation. Both modules now clear the
module line and branch targets.

# Scope Covered

- `task-124`: Harden pack XML and profile coverage.
- `test-76`: Cover pack XML metadata and profile branches.

# Decisions Captured

- Kept runtime behavior unchanged; the slice only adds direct pure-helper tests.
- Covered helper boundaries directly instead of expanding command fixtures.

# Implementation Summary

- Added XML exporter coverage for optional profile/body/checkpoint metadata,
  truncation dropped nodes, list frontmatter, scalar/list attributes, and XML
  escaping.
- Added profile helper coverage for invalid profile/max-code-line input, default
  and uppercase normalization, fallback summaries, empty bodies, max-code-line
  truncation, and strip-code behavior.
- Refreshed `COVERAGE_HARDENING_MATRIX.md` with the measured coverage results
  and moved `export_xml`/`profile` out of the active gap list.

# Verification / Testing

- `npm test -- --test-name-pattern 'exportXml|PackProfile|shapePackBodies|resolvePackProfile'`: 248 passed.
- `npm run test:coverage`: 248 passed.
- Current coverage: all files `94.02%` line / `85.96%` branch.
- Current `src/pack/export_xml.ts` coverage: `100.00%` line / `100.00%`
  branch.
- Current `src/pack/profile.ts` coverage: `96.85%` line / `93.51%` branch.

# Known Issues / Follow-ups

- Overall line coverage remains below the `95%` target at `94.02%`.
- Remaining user-facing command modules below `90%` line coverage:
  `checkpoint`, `doctor`, `event`, `guide`, and `list`.

# Links / Artifacts

- `tests/pack/exporters.test.ts`
- `tests/pack/profile.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
- `task-124`
- `test-76`
- `epic-13`
