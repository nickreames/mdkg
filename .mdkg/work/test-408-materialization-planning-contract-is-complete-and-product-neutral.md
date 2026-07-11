---
id: test-408
type: test
title: materialization planning contract is complete and product neutral
status: done
priority: 1
parent: goal-65
tags: [goal-65, test, materialization, naming]
owners: []
links: []
artifacts: []
relates: [task-743, task-744, goal-66]
blocked_by: []
blocks: []
refs: [goal-65, edd-73, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-52, dec-61, dec-63, dec-64]
evidence_refs: [chk-480]
aliases: [materialization-planning-contract-test]
skills: []
cases: [request-shape, identity, atomicity, auth, discovery, submodules, redaction, compatibility]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Validates that the seeded implementation contract covers every root handoff gap
with generic public names and explicit deferrals.

# Target / Scope

- `edd-73`
- `dec-75` through `dec-78`
- `goal-66`

# Preconditions / Environment

Current `src/commands/git.ts`, help, tests, and root handoff were read.

# Test Cases

- JSON request fields and policy enums are exact.
- Identity, atomic publication, failure cleanup, and no-push are required.
- Auth and evidence exclude secrets and product naming.
- YAML and recursive submodules are deferred without blocking v1.

# Results / Evidence

PASS. The requirements are present in the EDD, decisions, goal, tasks, and
future test matrix.

# Notes / Follow-ups

- Functional proof belongs to `goal-66`.
