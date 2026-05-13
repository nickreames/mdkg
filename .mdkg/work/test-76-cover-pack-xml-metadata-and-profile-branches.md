---
id: test-76
type: test
title: Cover pack XML metadata and profile branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, pack, test]
owners: []
links: []
artifacts: [tests/pack/exporters.test.ts, tests/pack/profile.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-124]
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

Validate low-frequency XML exporter and pack profile branches identified by the
residual coverage matrix.

# Target / Scope

`src/pack/export_xml.ts` optional rendering branches and `src/pack/profile.ts`
profile resolution/body shaping branches.

# Preconditions / Environment

Use direct pure-helper fixtures; no mdkg workspace is required.

# Test Cases

- XML output includes optional profile/body/checkpoint metadata and dropped qids
- XML output renders list frontmatter, scalar attributes, list attributes, and
  escaped text
- profile resolution handles uppercase/default profiles and invalid profile or
  max-code-line input
- profile shaping covers fallback summaries, empty bodies, max-code-line
  truncation, and strip-code interactions

# Results / Evidence

- `npm test -- --test-name-pattern 'exportXml|PackProfile|shapePackBodies|resolvePackProfile'`: 248 passed.
- `npm run test:coverage`: 248 passed; all-files coverage `94.02%` line /
  `85.96%` branch.
- `src/pack/export_xml.ts` now reports `100.00%` line / `100.00%` branch
  coverage.
- `src/pack/profile.ts` now reports `96.85%` line / `93.51%` branch coverage.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a pack format redesign.
