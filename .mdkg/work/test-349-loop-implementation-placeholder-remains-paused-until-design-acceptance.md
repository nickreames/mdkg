---
id: test-349
type: test
title: Loop implementation placeholder remains paused until design acceptance
status: done
priority: 1
parent: goal-57
tags: [loop, planning, implementation-placeholder, guardrail]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-674]
blocks: []
refs: [goal-57, goal-58, task-674, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Validate the planning/implementation separation: `goal-58` must remain a
paused, blocked placeholder until `goal-57` accepts or supersedes the design.

# Target / Scope

- `goal-58`
- `goal-57`
- `task-674`

# Preconditions / Environment

- Planning goal exists.
- Implementation goal exists.
- Planning has not closed.

# Test Cases

- `mdkg goal show goal-58 --json` reports `status: blocked`.
- `mdkg goal show goal-58 --json` reports `goal_state: paused`.
- `goal-58` has `blocked_by: [goal-57]`.
- `goal-58` has empty `scope_refs`.
- `goal-58` body says source implementation must not start before design
  acceptance.
- `mdkg goal next goal-58 --json` does not surface implementation work while
  scope refs remain empty.

# Results / Evidence

Passed for the planning lane.

- `goal-58` remains `status: blocked`.
- `goal-58` remains `goal_state: paused`.
- `goal-58` is blocked by `goal-57`.
- `goal-58` has empty `scope_refs`.
- `goal-58` body explicitly says source implementation must not start before
  design acceptance and future implementation expansion.
- `goal-58` carries planning context refs only; executable scope is still empty.

# Notes / Follow-ups

- This guardrail prevents accidental source work from a placeholder.
