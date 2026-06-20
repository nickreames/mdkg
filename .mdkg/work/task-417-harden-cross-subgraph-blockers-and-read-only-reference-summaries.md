---
id: task-417
type: task
title: harden cross-subgraph blockers and read-only reference summaries
status: done
priority: 1
epic: epic-106
parent: goal-22
tags: [subgraph, blockers, refs]
owners: []
links: []
artifacts: []
relates: [goal-19]
blocked_by: [task-416]
blocks: [test-183, task-423]
refs: []
aliases: [cross-subgraph-ref-summaries]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Make cross-subgraph blockers and references explainable without allowing local mutation of imported nodes.

# Acceptance Criteria

- `mdkg goal next` explains when a local node is blocked by a read-only subgraph node.
- A read-only `mdkg graph refs <id-or-qid> --json` command summarizes inbound and outbound scope, context, evidence, blocker, and related refs.
- Subgraph qids are resolvable for inspection and pack traversal but still fail closed for mutation.

# Files Affected

- Goal routing diagnostics.
- Graph command surface.
- Subgraph validation and pack helpers.

# Implementation Notes

- Imported subgraph nodes remain read-only; this task improves explanation and inspection only.
- Any new summary command must be non-mutating.

# Test Plan

- Unit tests for local and subgraph blockers.
- npm run smoke:subgraph
- npm run smoke:semantic-refs
- test-183

# Links / Artifacts

- test-183
