---
id: test-346
type: test
title: Loop fork provenance and default child materialization contract
status: done
priority: 1
parent: goal-57
tags: [loop, implementation-contract, forks, provenance, materialization]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-669]
blocks: []
refs: [goal-57, goal-58, task-669, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Future implementation contract: prove loop forks preserve template provenance
and default to creating linked child nodes while offering a no-child/planning
option.

# Target / Scope

- `task-669`
- `goal-58`
- Future `mdkg loop fork` implementation.

# Preconditions / Environment

- At least one seeded loop template exists.
- A repo/folder/goal scope exists to fork against.

# Test Cases

- Forking a template allocates a new scoped loop identity.
- The scoped loop records the source template, scope, linked goals/subgoals,
  constraints, and template version/hash or revision where practical.
- Default fork behavior creates expected linked child nodes immediately.
- A planning-only/no-child option creates the scoped loop without child
  materialization.
- Stale-fork detection or warning behavior is documented and testable.
- Template updates do not silently mutate existing forks.

# Results / Evidence

Contract authored for `goal-58`.

This test node is complete for the planning pass because it defines the future
fork/provenance/materialization acceptance contract. It is not evidence that
`mdkg loop fork` already exists.

# Notes / Follow-ups

- Exact low-level fields should follow the accepted source-grounded design.
- Execute this contract after `goal-58` expands into source work.
