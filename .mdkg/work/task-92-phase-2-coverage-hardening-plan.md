---
id: task-92
type: task
title: phase 2 coverage hardening plan
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, reliability]
owners: []
links: []
artifacts: [COVERAGE_HARDENING_MATRIX.md]
relates: [epic-13, epic-8]
blocked_by: []
blocks: [test-50]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-05-08
---

# Overview

Track residual coverage work that is explicitly non-blocking for `0.0.4`.
The matrix was refreshed after the config hardening pass so future coverage
work can start from current evidence instead of the March baseline.

# Acceptance Criteria

- remaining coverage targets are documented and scoped

# Files Affected

- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- this follow-up stays below active release work
- current hardening priority is `format`, `pack`, `cli`, `show`,
  `skill_mirror`, `export_xml`, and `profile`

# Test Plan

- `test-50`
- `npm run test:coverage`

# Links / Artifacts

- `epic-13`
- `COVERAGE_HARDENING_MATRIX.md`
