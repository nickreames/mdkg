---
id: task-678
type: task
title: implement loop fork provenance and materialization semantics
status: done
priority: 1
epic: epic-217
parent: goal-58
tags: [loop, fork, provenance, materialization]
owners: []
links: []
artifacts: [src/commands/loop.ts, tests/commands/loop.test.ts]
relates: []
blocked_by: [task-677]
blocks: []
refs: [goal-58, edd-66, dec-65, task-669, test-354, test-355]
context_refs: []
evidence_refs: [chk-384]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Implement loop fork behavior so reusable template loops can be instantiated for
a scope while preserving lineage and creating expected linked children.

# Acceptance Criteria

- Forked loops get new identity and preserve source template provenance.
- Default fork materializes linked child nodes immediately.
- Planning-only/no-child fork mode creates only the scoped loop shell with
  pending materialization guidance.

# Files Affected

- future loop command/core files
- graph creation helpers
- fork/materialization tests

# Implementation Notes

- Template mutation must be explicit; fork local changes do not silently update
  the parent template.
- Record enough template identity/version/hash or graph revision to detect stale
  forks later where practical.

# Test Plan

- Fork command tests for default and planning-only modes.
- Fixture checks for lineage, scope binding, and materialized child refs.

# Links / Artifacts

- `task-669`
- `test-354`
- `test-355`
