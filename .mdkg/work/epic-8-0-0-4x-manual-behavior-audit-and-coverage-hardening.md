---
id: epic-8
type: epic
title: 0.0.4x manual behavior audit and coverage hardening
status: done
priority: 1
tags: [0_0_4x, reliability, coverage, audit]
owners: []
links: []
artifacts: [MANUAL_BEHAVIOR_AUDIT.md, COVERAGE_HARDENING_MATRIX.md, package.json, implement-9, implement-12]
relates: [dec-11, dec-14, edd-9, epic-6, epic-7, epic-13]
blocked_by: []
blocks: [task-63, task-67, implement-9, implement-12, test-32]
refs: []
aliases: [coverage-hardening, behavior-audit]
created: 2026-03-05
updated: 2026-03-08
---

# Goal

Record the completed manual behavior audit and first coverage hardening phase, then hand residual coverage work to `epic-13`.

# Scope

- completed manual audit of first-run human and agent workflows
- completed coverage gap inventory and threshold plan
- residual coverage moved to explicit follow-up tracking

# Milestones

- M1: manual behavior audit completed
- M2: coverage plan and thresholds reviewed
- M3: residual coverage follow-up created

# Out of Scope

- making residual coverage blocking for `0.0.4`

# Risks

- coverage work can still drift if follow-up ownership stays implicit

# Links / Artifacts

- `implement-9`
- `implement-12`
- `epic-13`
