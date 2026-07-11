---
id: test-354
type: test
title: loop fork default child materialization contract
status: done
priority: 1
epic: epic-217
parent: goal-58
tags: [loop, fork, materialization, children]
owners: []
links: []
artifacts: [src/commands/loop.ts, tests/commands/loop.test.ts, tests/commands/cli_runtime.test.ts]
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-346, task-678, task-682, chk-384, chk-388]
context_refs: []
evidence_refs: [chk-384, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that default loop fork behavior materializes linked child nodes.

# Target / Scope

- `task-678`
- `task-682`

# Preconditions / Environment

A template loop fixture exists with expected child-node declarations.

# Test Cases

- `mdkg loop fork <template> --scope <scope> --json` creates a new scoped loop.
- Receipt records source template, scope, lineage, and materialized children.
- Child tasks/tests/spikes/proposals are linked to the forked loop.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- Forking must not mutate the source template.
