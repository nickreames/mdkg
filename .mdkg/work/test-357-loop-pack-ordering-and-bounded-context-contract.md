---
id: test-357
type: test
title: loop pack ordering and bounded context contract
status: done
priority: 1
epic: epic-216
parent: goal-58
tags: [loop, pack, context, ordering]
owners: []
links: []
artifacts: [src/pack/pack.ts, tests/pack/pack.test.ts]
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-345, task-681, chk-387]
context_refs: []
evidence_refs: [chk-387, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate deterministic pack behavior for loop roots and loop-linked context.

# Target / Scope

- `task-681`
- pack traversal and ordering

# Preconditions / Environment

Loop fixture has linked goals, tasks, tests, spikes, proposals, checkpoints,
receipts, evidence, and decisions.

# Test Cases

- Loop-root pack includes the loop first.
- Linked child/evidence nodes are ordered deterministically.
- Pack limits and visibility truncation remain explicit.
- Existing task/goal pack tests still pass.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- Do not introduce semantic-search retrieval.
