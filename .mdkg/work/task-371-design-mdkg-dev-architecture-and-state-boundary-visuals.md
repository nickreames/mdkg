---
id: task-371
type: task
title: design mdkg.dev architecture and state boundary visuals
status: todo
priority: 2
epic: epic-79
parent: goal-15
tags: [mdkg-dev, architecture, visuals, state-boundary, spike-backed]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-354, task-370]
blocks: [task-356, task-358, test-157]
refs: [spike-3, spike-5]
aliases: []
skills: []
created: 2026-06-15
updated: 2026-06-15
---
# Overview

Design the mdkg.dev architecture and state-boundary visuals that explain how
mdkg works without overloading first-time users. The visuals should make
canonical graph state, generated caches, optional project DB runtime state,
sealed artifacts, archives, and subgraphs visually distinct.

# Acceptance Criteria

- Produce a page-ready visual plan for "How mdkg works" and "What state is safe
  to commit".
- Cover graph nodes, indexes, packs, skills, SPEC/WORK records, project DB
  queues/snapshots, archive sidecars, bundles, and subgraphs.
- Label public CLI surfaces separately from internal-only helper surfaces.
- Include source references to `spike-3`, `spike-5`, generated command docs,
  and existing smoke coverage.
- Avoid website implementation; this task produces visual requirements and
  source-backed diagram specs only.

# Files Affected

List files/directories expected to change.

- future mdkg.dev architecture docs
- future diagram specs or visual requirements
- `.mdkg/work/` evidence nodes

# Implementation Notes

- Start with progressive disclosure: quick mental model, state policy table,
  deeper architecture reference.
- Every visual should answer a real user question such as "what is canonical?",
  "what is generated?", or "what is ignored?".
- Security/trust visuals must avoid implying hosted execution.

# Test Plan

- `node dist/cli.js validate --json`
- `test-157` checks that architecture claims are source-backed.
- `test-149` checks no-secret and no-misleading-execution boundaries.

# Links / Artifacts

- `spike-3`
- `spike-5`
- `task-358`
- `test-149`
