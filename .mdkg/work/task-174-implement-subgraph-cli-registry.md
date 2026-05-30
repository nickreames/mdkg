---
id: task-174
type: task
title: implement subgraph cli registry
status: todo
priority: 1
epic: epic-21
tags: [subgraph, cli, registry, ux]
owners: []
links: []
artifacts: []
relates: [epic-21, task-172, task-173]
blocked_by: [task-172, task-173]
blocks: [task-175, task-177, task-178, task-179]
refs: []
aliases: [subgraph-cli-registry]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Add the public `mdkg subgraph ...` registry command family for read-only child
graph snapshots.

# Acceptance Criteria

- CLI supports `mdkg subgraph add/list/show/rm/enable/disable/verify/refresh`.
- `add` registers a subgraph alias and configured bundle source with default
  `permissions: ["read"]` and `max_stale_seconds: 3600`.
- `refresh` reloads configured bundle sources only and never runs bundle build
  commands inside child repos.
- JSON receipts expose alias, enabled state, visibility, permissions, freshness,
  source metadata, bundle hash, warnings, and errors.
- Mutating registry commands use existing mdkg locking and atomic config writes.

# Files Affected

- `src/cli.ts`
- subgraph command implementation
- config tests and command tests

# Implementation Notes

The command family should be phrased around subgraph orchestration, not bundle
transport. Child repos remain the mutation owners for their full mdkg graph
state.

# Test Plan

- CLI tests for add/list/show/rm/enable/disable/verify/refresh JSON receipts.
- Error tests for duplicate aliases, workspace collisions, invalid permissions,
  invalid visibility, missing bundle source, and stale bundle source.
- Temp repo smoke for registering a child bundle as a subgraph.

# Links / Artifacts

- `epic-21`
- `task-172`
- `task-173`
