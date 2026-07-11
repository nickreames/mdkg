---
id: task-677
type: task
title: define and validate MVP loop metadata and modes
status: done
priority: 1
epic: epic-215
parent: goal-58
tags: [loop, metadata, validation, lifecycle]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-675, task-676]
blocks: []
refs: [goal-58, edd-66, dec-65, task-668, task-669]
context_refs: []
evidence_refs: [chk-383]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Implement the MVP loop metadata contract and validation rules selected by
`edd-66` and `dec-65`.

# Acceptance Criteria

- One `loop` node type can represent template, forked/scoped, and run-bearing
  loops through metadata and links.
- Invalid mode, lineage, scope, or provenance combinations produce clear
  diagnostics.
- Existing goals remain outcome-oriented and are not reinterpreted as loops.

# Files Affected

- `src/graph/node.ts`
- `src/graph/validate_graph.ts`
- validation fixtures/tests

# Implementation Notes

- Prefer minimal fields needed for safe MVP behavior.
- Metadata should cover loop mode, scope, template/source refs, materialization
  mode, child refs, evidence refs, and status/projection guidance.

# Test Plan

- Valid fixture coverage for template/scoped/run-bearing loops.
- Invalid fixture coverage for unsupported modes and broken provenance.

# Links / Artifacts

- `task-668`
- `task-669`
- `test-352`
