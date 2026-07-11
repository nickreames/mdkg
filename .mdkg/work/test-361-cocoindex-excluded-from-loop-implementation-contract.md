---
id: test-361
type: test
title: cocoindex excluded from loop implementation contract
status: done
priority: 1
epic: epic-219
parent: goal-58
tags: [loop, cocoindex, out-of-scope, regression]
owners: []
links: []
artifacts: [.mdkg/work/goal-58-implement-first-class-loop-node-type.md, .mdkg/work/goal-53-plan-project-memory-query-and-cocoindex-integration.md, CLI_COMMAND_MATRIX.md, README.md, src/commands/loop.ts]
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, goal-53, test-350, task-684, chk-389]
context_refs: []
evidence_refs: [chk-390]
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that `goal-58` does not include CocoIndex, embeddings, semantic search,
remote references, or optional index-provider work.

# Target / Scope

- `goal-58`
- `goal-53`
- `task-684`

# Preconditions / Environment

Loop implementation scope is complete or ready for closeout review.

# Test Cases

- `goal-58` scope refs do not include CocoIndex implementation nodes.
- Public loop docs do not promise semantic search/provider behavior.
- `goal-53` remains the separate project-memory/CocoIndex planning lane.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- A future CocoIndex plan may supersede `goal-53`; it should remain separate
  from loop node implementation.
