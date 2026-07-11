---
id: test-358
type: test
title: seeded reusable loop catalog validation contract
status: done
priority: 1
epic: epic-218
parent: goal-58
tags: [loop, seeds, catalog, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-348]
context_refs: []
evidence_refs: [chk-383, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate the initial reusable read-only/planning loop seed catalog.

# Target / Scope

- `task-683`
- seeded loop templates

# Preconditions / Environment

Seeded loops have been added to mdkg-owned template/seed locations.

# Test Cases

- Security audit seed validates.
- Design/frontend UX audit seed validates.
- Backend/API/CLI bloat audit seed validates.
- Tech-stack, duplicate/lint, test/CI/SKILL.md, and user-story seeds validate.
- Seeds are read-only or planning-oriented and do not imply runtime execution.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- Write-capable/autonomous loops can be planned later after dogfooding.
