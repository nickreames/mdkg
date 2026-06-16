---
id: test-160
type: test
title: subgraph independent active goal validation contract
status: done
priority: 1
epic: epic-85
parent: goal-16
tags: [0.3.3, subgraph, single-active]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-374]
blocks: []
refs: []
aliases: []
skills: []
cases: [A child/subgraph can have its own active goal internally., Root validation reports subgraph active goals read-only., Root single-active enforcement does not mutate subgraphs.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate subgraph independent active goal validation contract.

# Target / Scope

- task-374
- task-378

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- A child/subgraph can have its own active goal internally.
- Root validation reports subgraph active goals read-only.
- Root single-active enforcement does not mutate subgraphs.

# Expected Evidence

- Unit validation output for imported subgraph active goals.
- Temp-repo subgraph smoke receipt during `task-378`.

# Results / Evidence

- Passed the unit-level contract on 2026-06-16.
- `node --test dist/tests/graph/validate_graph.test.js` passed 5 tests, including `collectGraphErrors ignores imported subgraph goals for local single-active validation`.

# Notes / Follow-ups

- `task-378` still owns the packed temp-repo smoke for the broader 0.3.3 lifecycle behavior.
