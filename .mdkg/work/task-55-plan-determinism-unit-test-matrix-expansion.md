---
id: task-55
type: task
title: plan determinism unit test matrix expansion
status: done
priority: 1
epic: epic-5
tags: [v0_4, tests, determinism]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, edd-2, edd-3, edd-6, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [determinism-tests]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Plan expanded deterministic unit/integration test coverage for 0.0.4 features without introducing runtime code changes in this pass.

# Acceptance Criteria

- Skills index determinism test matrix is documented.
- Pack ordering/truncation determinism scenarios are documented.
- Hybrid checkpoint selection determinism scenarios are documented.
- Docs/source-parity audit scenarios are documented for manual execution.
- Planned tests are linked to explicit task and decision nodes.

# Files Affected

- tests/
- .mdkg/work/test-20-v0-4-skills-tag-filtering-and-stage-policy-contract.md
- .mdkg/work/test-21-v0-4-checkpoint-hybrid-selection-determinism-contract.md
- .mdkg/work/test-22-v0-4-index-latest-checkpoint-hint-consistency-contract.md

# Implementation Notes

- Keep this planning-only; runtime tests to be added in implementation phase.
- Preserve reproducibility assumptions from existing pack/index design docs.

# Test Plan

Track and validate completeness of planned matrix using linked test nodes (`test-20` through `test-25`).

# Links / Artifacts

- prd-1
- dec-10
- edd-2
- edd-3
- edd-6
- epic-5
