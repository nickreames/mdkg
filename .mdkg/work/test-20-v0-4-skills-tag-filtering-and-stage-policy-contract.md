---
id: test-20
type: test
title: v0.4 skills tag filtering and stage policy contract
status: done
priority: 1
epic: epic-5
tags: [v0_4, skills, query, policy]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:mdkg_validate_ok_2026_03_05]
relates: [prd-1, dec-10, edd-2, edd-5, edd-7, task-50, task-51, implement-1, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [stage:plan]
cases: [skills-type-list-contract, tags-filter-any-all-contract, stage-policy-gating-contract]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Validate planned contracts for skill discovery with stage-aware tag filtering and policy gating.

# Target / Scope

Covers planned query/filter interfaces and policy semantics for stage-constrained skill visibility.

# Preconditions / Environment

- `dec-10`, `edd-5`, and `edd-7` are integrated
- skills command namespace remains unintroduced in v0.4 docs

# Test Cases

- Verify planned command-surface stays within existing command families.
- Verify `--tags` and `--tags-mode any|all` contracts are documented for skills discovery.
- Verify stage-tag examples (including `stage:plan`) are documented and searchable.
- Verify policy gating responsibility is assigned to external orchestrators.

# Results / Evidence

Capture `mdkg show` outputs for `task-50`, `task-51`, `edd-5`, and `edd-7`.

- `npm run test` passes with Stream A command + filter coverage.
- `mdkg validate` passes after Stream A implementation.

# Notes / Follow-ups

- Add runtime filter-behavior tests when command flags are implemented.
