---
id: test-166
type: test
title: same repo graph import rewrites ids and links contract
status: done
priority: 2
epic: epic-93
parent: goal-18
tags: [0.3.5, import]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-388]
blocks: []
refs: []
aliases: []
skills: []
cases: [Import into same repo rewrites colliding IDs., All links are rewritten according to receipt., Imported start goal routes correctly.]
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Validate same repo graph import rewrites ids and links contract.

# Target / Scope

- task-388

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Import into same repo rewrites colliding IDs.
- All links are rewritten according to receipt.
- Imported start goal routes correctly.
- Dry-run reports planned rewrites without writing files.
- Apply writes imported nodes, rebuilds indexes, validates, and can select the
  rewritten start goal.
- Source template directory is not mutated.

# Expected Evidence

- `tests/commands/graph.test.ts`
- `node --test dist/tests/commands/graph.test.js`

# Notes / Follow-ups

- Passing graph command tests prove dry-run no-write behavior, deterministic
  `goal-1 -> goal-2` and `task-1 -> task-2` rewrites, frontmatter/body ref
  rewrites, selected-goal behavior, source immutability, and final graph
  validation.
