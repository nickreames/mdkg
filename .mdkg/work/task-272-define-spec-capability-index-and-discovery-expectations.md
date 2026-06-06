---
id: task-272
type: task
title: define SPEC capability index and discovery expectations
status: todo
priority: 1
epic: epic-48
parent: goal-8
tags: [spec, capability-index, discovery]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-48, test-101]
blocked_by: [task-271]
blocks: [task-276]
refs: [edd-14]
aliases: [spec-capability-index-discovery]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how SPEC files should appear in capability list/search/show outputs.

# Acceptance Criteria

- Indexing extracts title, kind, capabilities, resources, projection targets,
  validation checks, and source refs.
- Search terms include `SPEC section contract`, `runtime agent manifest`,
  `orchestrator agent`, and projection concepts.
- Imported subgraph SPECs remain read-only.

# Test Plan

- `mdkg capability search "SPEC section contract" --json`
- `mdkg capability search "runtime agent manifest" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Define index expectations before source indexer work starts.

# Links / Artifacts

- `goal-8`
- `epic-48`
