---
id: test-77
type: test
title: Cover doctor config and index branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, doctor, test]
owners: []
links: []
artifacts: [tests/commands/doctor.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-125]
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

Validate low-frequency doctor command diagnostics identified by the residual
coverage matrix.

# Target / Scope

`src/commands/doctor.ts` config and index diagnostic branches.

# Preconditions / Environment

Use temporary mdkg roots and cached index fixtures.

# Test Cases

- missing config emits config/config-schema failures
- invalid config emits config-schema failure without template/index checks
- healthy text output includes index loaded/rebuilt details and final `doctor ok`
- stale cached index with reindex disabled reports stale detail
- malformed cached index reports index failure

# Results / Evidence

- `npm test -- --test-name-pattern "DoctorCommand|doctor"` passed with 251 tests.
- `npm run test:coverage` passed with 251 tests.
- `src/commands/doctor.ts` reports `91.03%` line / `81.48%` branch.
- All-files coverage reports `94.32%` line / `86.12%` branch.

# Notes / Follow-ups

- This is a coverage-hardening slice, not a doctor command redesign.
