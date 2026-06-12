---
id: test-150
type: test
title: downstream upgrade narrative contract
status: todo
priority: 2
epic: epic-82
parent: goal-15
tags: [downstream, upgrade, dry-run, no-cross-repo-mutation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-359]
blocks: []
refs: []
aliases: []
skills: []
cases: [upgrade narrative has dry run, no cross repo mutation, child repo handoff documented]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate downstream upgrade narratives and handoff playbooks for dry-run-first
behavior and no-cross-repo-mutation boundaries.

# Target / Scope

- `task-359`
- downstream upgrade guides
- handoff prompt examples

# Preconditions / Environment

- At least one temp repo fixture or documented downstream example.
- Current mdkg CLI available.

# Test Cases

- Execute the documented dry-run upgrade flow in a temp repo.
- Confirm handoff prompts instruct agents to mutate only the target repo after
  explicit approval.
- Verify narratives explain stale indexes, selected goals, generated caches, and
  subgraph snapshot boundaries.
- Assert no guide implies root repo commands mutate child repos.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Full downstream migration automation remains in deferred `goal-11`.
