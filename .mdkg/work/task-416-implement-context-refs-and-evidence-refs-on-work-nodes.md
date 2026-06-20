---
id: task-416
type: task
title: implement context refs and evidence refs on work nodes
status: done
priority: 1
epic: epic-106
parent: goal-22
tags: [refs, indexing, visibility]
owners: []
links: []
artifacts: []
relates: [goal-18, goal-19]
blocked_by: [task-414]
blocks: [task-417, task-422, test-182, task-423]
refs: []
aliases: [context-evidence-refs]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Add generic non-executable reference lanes for work-node planning context and evidence.

# Acceptance Criteria

- `context_refs` and `evidence_refs` are supported on work nodes and parsed as local ids, qids, configured subgraph qids, or URI refs.
- They appear in JSON show/list/search/pack/index output and SQLite index data.
- They are considered by visibility checks and pack traversal without becoming actionable scope.
- Missing local refs stay strict; URI refs remain valid; configured subgraph refs are readable but not mutable.

# Files Affected

- Graph node parsing and validation.
- JSON/SQLite indexers.
- Search, show, pack, and visibility policy.

# Implementation Notes

- Keep `context_refs` and `evidence_refs` separate from executable `scope_refs`.
- Avoid using these fields in current graph files until this task implements parser and validator support.

# Test Plan

- Unit tests for parsing, validation, indexing, visibility, and pack traversal.
- npm run smoke:semantic-refs
- test-182

# Links / Artifacts

- test-182
