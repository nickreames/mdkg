---
id: task-683
type: task
title: seed reusable read only and planning loop templates
status: done
priority: 1
epic: epic-218
parent: goal-58
tags: [loop, seeds, audit, planning]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, task-671]
context_refs: []
evidence_refs: [chk-383]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Seed the first reusable loop catalog with read-only and planning-oriented loop
templates suitable for repeated repo improvement work.

# Acceptance Criteria

- Seed catalog includes security audit, design/frontend UX audit,
  backend/API/CLI bloat audit, tech-stack best-practices audit,
  duplicate-code/linting audit, test/CI/SKILL.md infrastructure audit, and
  user-story audit/recommendations.
- Each seed declares mode, scope expectations, definition of done, expected
  linked child nodes, evidence requirements, and blocker-continuation behavior.
- Seeds validate as loop nodes and do not execute runtime jobs.

# Files Affected

- mdkg-owned seed/template folders selected during implementation
- seed fixtures and smoke tests

# Implementation Notes

- Keep seeds generic and public-safe.
- Do not include repo secrets, provider payloads, or product-specific runtime
  policy.

# Test Plan

- Seed catalog validation smoke.
- Search/show/list discoverability checks for seed loops.

# Links / Artifacts

- `task-671`
- `test-358`
