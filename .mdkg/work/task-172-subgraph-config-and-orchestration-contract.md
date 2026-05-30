---
id: task-172
type: task
title: subgraph config and orchestration contract
status: todo
priority: 1
epic: epic-21
tags: [subgraph, config, orchestration, contract]
owners: []
links: []
artifacts: []
relates: [epic-21, epic-20, epic-22, epic-23]
blocked_by: []
blocks: [task-173, task-174, task-175, task-176, task-177]
refs: []
aliases: [subgraph-config-contract]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define `subgraphs` as the orchestration identity and policy layer for child
mdkg graphs. Bundle ZIP files remain source transport; subgraphs describe what a
root graph can see, verify, and use for planning.

# Acceptance Criteria

- `subgraphs` is documented as the semantic replacement for `bundle_imports`.
- Each subgraph supports alias, enabled state, visibility, permissions,
  freshness policy, source repo/path metadata, and one or more bundle sources.
- Default permissions are `["read"]`.
- Default `max_stale_seconds` is `3600`.
- Bundle ZIPs remain the committed/shareable source artifacts.
- SQLite remains a rebuildable local read model derived from local markdown,
  sidecars, bundles, and subgraph source metadata.

# Files Affected

- `.mdkg/config.json`
- `assets/init/config.json`
- `src/core/config.ts`
- docs and tests for config validation

# Implementation Notes

Keep `subgraphs` focused on orchestration identity and policy. Do not encode
child repo write-through, execution, remote build, or work-order export behavior
in this contract.

# Test Plan

- Config tests for defaults, alias validation, permissions validation,
  freshness validation, and source bundle validation.
- Migration tests for old configs that contain `bundle_imports`.
- Temp repo test proving fresh init has an empty `subgraphs` object.

# Links / Artifacts

- `epic-21`
- `epic-20`
- `epic-22`
- `epic-23`
