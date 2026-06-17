---
id: test-165
type: test
title: separate repo graph clone preserves ids contract
status: done
priority: 2
epic: epic-92
parent: goal-18
tags: [0.3.5, clone]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-387]
blocks: []
refs: []
aliases: []
skills: []
cases: [Clone into separate repo preserves IDs., Destination validates., Source is not mutated.]
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Validate separate repo graph clone preserves ids contract.

# Target / Scope

- task-387

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Clone into separate repo preserves IDs.
- Destination validates.
- Source is not mutated.
- Fork from a live directory preserves IDs and writes selected start-goal state.
- Unsafe parent-directory targets and nested live-source targets are rejected.

# Expected Evidence

- `tests/commands/graph.test.ts`
- `node --test dist/tests/commands/graph.test.js`

# Notes / Follow-ups

- Passing graph command tests prove bundle-source clone, directory-source fork,
  selected start-goal state, target validation, ID preservation, and source
  immutability for the separate-target workflow.
