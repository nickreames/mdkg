---
id: test-347
type: test
title: Loop blocker-continuation routes to spike proposal and recommendation
status: done
priority: 1
parent: goal-57
tags: [loop, implementation-contract, blockers, spikes, proposals]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-670]
blocks: []
refs: [goal-57, goal-58, task-670, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Future implementation contract: prove loop guidance does not stop at the first
branch blocker and instead creates structured investigation and recommendation
work before continuing where possible.

# Target / Scope

- `task-670`
- Future loop planning/execution guidance.
- Linked spike, proposal, goal blocker, and follow-up work behavior.

# Preconditions / Environment

- A scoped loop has at least one blocked branch and at least one other useful
  path toward its definition of done.

# Test Cases

- Blocked branch produces or requests a spike with source-grounded options.
- When external facts are required, the spike records web-grounding expectations
  for the executing agent or harness.
- A proposal records at least three viable paths.
- The proposal identifies a recommended path.
- Affected goals or subgoals record blocker evidence.
- The loop continues to the next useful scoped work item instead of marking the
  whole loop blocked.
- Whole-loop blocked state requires repeated/global blockers consistent with
  the accepted design.

# Results / Evidence

Contract authored for `goal-58`.

This test node is complete for the planning pass because it defines the future
blocker-continuation acceptance contract. It is not evidence that runtime agents
or loop commands already generate spikes/proposals automatically.

# Notes / Follow-ups

- mdkg should model and validate the state; runtime/harnesses perform actual
  research and execution.
- Execute this contract after `goal-58` expands into source work.
