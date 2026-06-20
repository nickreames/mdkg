---
id: task-413
type: task
title: align goal-22 graph scope and generic naming boundary
status: done
priority: 1
epic: epic-105
parent: goal-22
tags: [alignment, graph, naming]
owners: []
links: []
artifacts: []
relates: [goal-22]
blocked_by: []
blocks: [test-180, spike-11]
refs: []
aliases: [goal-22-alignment]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Create and verify the goal-22 graph structure while keeping node names generic and implementation boundaries explicit.

# Acceptance Criteria

- goal-22 is the only active root goal.
- goal-22 routes to spike-11 as the first actionable node.
- Scoped epics, tasks, tests, and the spike are present with generic titles.
- No runtime repo files, source files, package metadata, publish artifacts, tags, or pushes are changed.

# Files Affected

- .mdkg/work/
- .mdkg/index/mdkg.sqlite

# Implementation Notes

- Use existing frontmatter fields only; future `context_refs` and `evidence_refs` support is planned inside goal-22 but not used before implementation.

# Test Plan

- node dist/cli.js index
- node dist/cli.js validate --json
- node dist/cli.js goal current --json
- node dist/cli.js goal next goal-22 --json
- git diff --check

# Links / Artifacts

- test-180

# Closeout Evidence

- Created goal-22, epic-105 through epic-112, spike-11, task-413 through task-426, and test-180 through test-189.
- `node dist/cli.js index` rebuilt JSON, skill, capability, subgraph, and SQLite indexes.
- `node dist/cli.js validate --json` returned ok with zero errors and zero warnings after heading cleanup.
- `node dist/cli.js goal activate goal-22 --json` selected goal-22 and left no other active root goals.
- No source, package, publish, tag, push, global install, or downstream runtime repo edits were performed.
