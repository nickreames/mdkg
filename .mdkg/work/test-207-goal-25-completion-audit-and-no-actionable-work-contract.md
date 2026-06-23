---
id: test-207
type: test
title: goal-25 completion audit and no-actionable-work contract
status: done
priority: 1
epic: epic-127
parent: goal-26
tags: [mdkg-dev, goal-audit]
owners: []
links: []
artifacts: []
relates: [goal-26, task-457]
blocked_by: [task-456]
blocks: []
refs: []
context_refs: [chk-194]
evidence_refs: [chk-195]
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that goal-25 is truly complete and no actionable goal-25 work remains hidden behind stale indexes, stale selected-goal state, or subgraph warnings.

# Target / Scope

- goal-25 completion state
- goal-25 scoped tasks/tests/checkpoints
- selected-goal state
- derived index and subgraph freshness

# Preconditions / Environment

- Run from the mdkg repo root.
- Do not publish, deploy, tag, push, global install, or mutate external child repos.

# Test Cases

- `node dist/cli.js index` refreshes derived state.
- `node dist/cli.js validate --summary --json --limit 20` returns no warnings/errors.
- `node dist/cli.js doctor --strict --json` is clean or accepted warnings are documented.
- `node dist/cli.js goal show goal-25 --json` reports `done`/`achieved` with `last_active_node: task-454`.
- `node dist/cli.js goal next goal-25 --json` reports `node: null` with no warnings.
- Required scoped nodes and checkpoints exist.

# Results / Evidence

- Passed. See chk-195 for command evidence. Goal-25 is `done` / `achieved`, keeps `last_active_node: task-454`, has no actionable next node, and all required scoped nodes/checkpoints exist. Validation is clean, subgraphs are fresh, and the only strict-doctor warning is accepted local DB runtime state with `db verify` passing.

# Notes / Follow-ups

- Baseline audit checkpoint: chk-195.
