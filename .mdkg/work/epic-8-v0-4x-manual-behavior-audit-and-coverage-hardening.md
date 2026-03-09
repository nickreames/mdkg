---
id: epic-8
type: epic
title: v0.4x manual behavior audit and coverage hardening
status: todo
priority: 1
tags: [v0_4x, reliability, coverage, audit]
owners: []
links: []
artifacts: [MANUAL_BEHAVIOR_AUDIT.md, COVERAGE_HARDENING_MATRIX.md, package.json, implement-9, implement-12]
relates: [dec-11, edd-9, epic-6, epic-7]
blocked_by: []
blocks: [task-63, task-67, implement-9, implement-12, test-32]
refs: []
aliases: [coverage-hardening, behavior-audit]
created: 2026-03-05
updated: 2026-03-06
---

# Goal

Confirm the simplified primary workflow through manual behavior audits, then harden the codebase with near-full coverage and explicit thresholds.

# Scope

- manual audit of first-run human and agent workflows
- coverage gap inventory and threshold plan
- post-audit reliability hardening

# Milestones

- M1: manual behavior audit completed
- M2: coverage plan and thresholds reviewed
- M3: reliability/coverage implementation complete

# Out of Scope

- changing the v0.4 command contracts before manual audit results

# Risks

- coverage goals can produce low-value tests if behavior expectations are not clarified first

# Links / Artifacts

- dec-11
- edd-9
- implement-9
- implement-12
