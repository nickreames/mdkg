---
id: test-348
type: test
title: Seeded reusable loop catalog contract
status: done
priority: 1
parent: goal-57
tags: [loop, implementation-contract, seeds, templates, audits]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-671]
blocks: []
refs: [goal-57, goal-58, task-671, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Future implementation contract: prove the initial reusable loop catalog is
seeded, discoverable, and read-only/planning-oriented.

# Target / Scope

- `task-671`
- Future mdkg-owned seed/template folders.
- Initial reusable loop templates.

# Preconditions / Environment

- `loop` node scaffolding exists.
- Seed/template folder policy is selected.

# Test Cases

- Seed catalog includes security audit.
- Seed catalog includes design/frontend UX audit.
- Seed catalog includes backend/API/CLI design-bloat audit.
- Seed catalog includes tech-stack best-practices audit.
- Seed catalog includes duplicate-code/linting audit.
- Seed catalog includes test/CI/SKILL.md infrastructure audit.
- Seed catalog includes user-story audit and recommendations.
- Seeded loops can be listed, shown, searched, and packed.
- Seeded loops are not runtime jobs and do not imply write capability by
  default.

# Results / Evidence

Contract authored for `goal-58`.

This test node is complete for the planning pass because it defines the future
seed-catalog acceptance contract. It is not evidence that seed templates already
exist.

# Notes / Follow-ups

- Write-capable implementation loops can come later after read-only and planning
  loops are dogfooded.
- Execute this contract after `goal-58` expands into source work.
