---
id: task-124
type: task
title: Harden pack XML and profile coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, pack]
owners: []
links: []
artifacts: [tests/pack/exporters.test.ts, tests/pack/profile.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [test-76, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for the low-frequency XML exporter and pack
profile shaping branches called out by the residual coverage matrix.

# Acceptance Criteria

- Cover XML optional metadata, truncation dropped nodes, list frontmatter, scalar
  and list attributes, and XML escaping.
- Cover profile invalid input, default/uppercase normalization, max code-line
  truncation, empty body summaries, fallback summaries, and concise/strip
  interactions.
- Keep the change test-only unless pack behavior is demonstrably wrong.

# Files Affected

- `tests/pack/exporters.test.ts`
- `tests/pack/profile.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Prefer direct unit tests for the pure exporter/profile helpers.
- Avoid command-level fixture expansion unless unit tests miss behavior at the
  helper boundary.

# Test Plan

- `npm test -- --test-name-pattern "exportXml|PackProfile|shapePackBodies|resolvePackProfile"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- Added XML coverage for optional profile/body/checkpoint metadata, truncation
  dropped nodes, list frontmatter, scalar/list attributes, and escaping.
- Added profile coverage for invalid inputs, default and uppercase
  normalization, fallback summaries, empty bodies, max-code-line truncation, and
  strip-code interactions.
- `npm test -- --test-name-pattern 'exportXml|PackProfile|shapePackBodies|resolvePackProfile'`: 248 passed.
- `npm run test:coverage`: 248 passed; all-files coverage `94.02%` line /
  `85.96%` branch; `src/pack/export_xml.ts` coverage `100.00%` line /
  `100.00%` branch; `src/pack/profile.ts` coverage `96.85%` line / `93.51%`
  branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
