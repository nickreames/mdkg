---
id: task-179
type: task
title: temp root child grandchild subgraph smoke plan
status: todo
priority: 1
epic: epic-21
tags: [subgraph, smoke, temp-repo, orchestration]
owners: []
links: []
artifacts: []
relates: [epic-21, task-174, task-175, task-176, task-177]
blocked_by: [task-174, task-175, task-176, task-177]
blocks: [task-180]
refs: []
aliases: [subgraph-temp-smoke]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define packed-package smoke coverage for root, child, and grandchild mdkg graphs
using subgraph bundle snapshots.

# Acceptance Criteria

- Smoke creates fresh temp root, child, and grandchild repos.
- Child and grandchild repos initialize mdkg, create capability-bearing
  `SPEC.md`, `WORK.md`, skills, and archives, then create bundle snapshots.
- Root registers child bundles through `mdkg subgraph add`.
- Root runs `mdkg subgraph verify`, `mdkg capability resolve`, `mdkg search`,
  `mdkg show`, `mdkg pack`, `mdkg validate`, and `mdkg doctor`.
- Smoke proves stale behavior, `--fresh-only`, visibility fail-closed behavior,
  and read-only child graph mutation guards.

# Files Affected

- packed-package smoke scripts
- package test scripts
- fixtures only if needed

# Implementation Notes

This smoke should use the installed packed package, not only local source, so it
proves the npm-distributed command surface.

# Test Plan

- Add and run `npm run smoke:subgraph`.
- Include the smoke in publish readiness only after it is stable.
- Confirm temp repos do not require direct child checkout scans for root
  capability resolution.

# Links / Artifacts

- `epic-21`
- `task-176`
