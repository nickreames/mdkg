---
id: test-359
type: test
title: loop blocker continuation spike proposal recommendation contract
status: done
priority: 1
epic: epic-215
parent: goal-58
tags: [loop, blockers, spike, proposal, recommendation]
owners: []
links: []
artifacts: [src/commands/loop.ts, tests/commands/loop.test.ts]
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-347, task-679, chk-385]
context_refs: []
evidence_refs: [chk-385, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that loop blockers route toward evidence and alternatives instead of
hard-stopping early.

# Target / Scope

- `task-679`

# Preconditions / Environment

A loop fixture has one blocked branch and other useful scoped work available.

# Test Cases

- Branch blocker records evidence on affected nodes.
- Source/web-grounding uncertainty requests or creates a spike.
- Non-trivial blocker requests or creates a proposal with at least three viable
  paths and a recommended path.
- Loop can continue other useful scoped work.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- Whole-loop blocked state requires repeated/global blockers.
