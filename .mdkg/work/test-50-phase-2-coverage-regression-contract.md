---
id: test-50
type: test
title: phase 2 coverage regression contract
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, regression]
owners: []
links: []
artifacts: [COVERAGE_HARDENING_MATRIX.md]
relates: [task-92, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-05-08
---

# Overview

Protect future coverage hardening work from regressing after the `0.0.4` release wave.

# Regression Contract

- `npm run test:coverage` must continue to pass before closing future coverage
  hardening slices.
- `COVERAGE_HARDENING_MATRIX.md` records current measured coverage, target
  thresholds, and the next module order.
- Future coverage work should update the matrix when it materially changes
  module ordering, thresholds, or measured coverage.

# Current Evidence

- `npm run test:coverage`: 224 tests passed.
- Current all-files coverage reported by Node experimental coverage:
  `88.87%` line / `81.09%` branch.
- Target thresholds remain unmet, so this is a planning/regression contract,
  not a threshold completion claim.

# Covered Artifact

- `COVERAGE_HARDENING_MATRIX.md`
