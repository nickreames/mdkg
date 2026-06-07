---
id: task-317
type: task
title: design subgraph audit all json command
status: todo
priority: 2
epic: epic-68
parent: goal-12
prev: task-316
next: task-318
tags: [design, subgraph, audit, json]
owners: []
links: []
artifacts: []
relates: [goal-12]
blocked_by: [task-316]
blocks: [task-318, test-126]
refs: []
aliases: [subgraph-audit-all-json]
skills: []
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Design `mdkg subgraph audit --all --json` as a read-only command.

# Acceptance Criteria

- Output includes alias, path, config source, bundle age, source HEAD, working
  tree dirty state, validation state, and capability summary.
- Command is read-only and deterministic.
- JSON schema supports ready/deferred/blocked classification by downstream
  tools.
- Private visibility boundaries are preserved.

# Files Affected

- Future CLI design and tests; none in this paused planning task.

# Implementation Notes

Do not make audit imply refresh, upgrade, commit, or push.

# Test Plan

- Positive fixture with fresh subgraphs.
- Negative fixture with stale bundle, dirty child path, and source HEAD drift.
- JSON snapshot contract.

# Links / Artifacts

- `test-126`

# Completion Evidence

Pending.
