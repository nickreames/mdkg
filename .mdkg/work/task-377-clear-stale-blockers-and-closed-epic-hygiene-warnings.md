---
id: task-377
type: task
title: clear stale blockers and closed-epic hygiene warnings
status: done
priority: 1
epic: epic-87
parent: goal-16
tags: [0.3.3, hygiene, doctor]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-378]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Clean stale graph blockers and doctor strictness issues that obscure active release sequencing.

# Acceptance Criteria

- Done blockers are removed or annotated where they obscure live order.
- Closed epic warnings are resolved or intentionally documented.
- Strict doctor output separates failures from historical archived state.

# Files Affected

- .mdkg/work/**
- src/**
- tests/**

# Implementation Notes

- Prefer minimal graph edits.
- Do not rewrite unrelated roadmap content.

# Test Plan

- `node dist/cli.js doctor --strict --json`
- `node dist/cli.js validate --json`

# Links / Artifacts

- 2026-06-16 execution:
  - Cleared completed blockers from this active hygiene node.
  - Reduced `task-378` blockers to the live predecessor `task-377`.
  - Reduced `task-379` blockers to the live predecessor `task-378`; the supporting contract tests are already done.
- Verification:
  - `node dist/cli.js index` refreshed JSON, capability, subgraph, and SQLite indexes.
  - `node dist/cli.js doctor --strict --json` passed with 0 failures; the only warning is the expected local-only project DB runtime file.
  - `node dist/cli.js status --json` reported graph stale `false` and no graph warnings/errors; worktree dirtiness remains expected for this in-progress implementation branch.
