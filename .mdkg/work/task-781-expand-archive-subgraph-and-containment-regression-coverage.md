---
id: task-781
type: task
title: Expand archive subgraph and containment regression coverage
status: done
priority: 1
epic: epic-249
tags: [archive, testing, subgraph, containment]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-778, task-779, task-780]
blocks: [task-782]
refs: [goal-70, edd-76, dec-82]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Complete unit, integration, smoke, and packaged regressions for every accepted
ownership and no-touch invariant.

# Acceptance Criteria

- Tests `test-435` through `test-442` pass in disposable repositories.
- Imported bundle/child hashes and filesystem-call instrumentation prove no
  cross-boundary access.
- Existing containment, symlink, local multi-workspace, list/show/search, and
  capability behavior remains green.
- Archive, subgraph, and bundle smokes cover the corrected package behavior.

# Files Affected

List files/directories expected to change.

- Archive/subgraph/containment test suites.
- `smoke:archive-work`, `smoke:subgraph`, and `smoke:bundle` fixtures/scripts.

# Implementation Notes

- Never point a test at `/Users/nick/omni-chat-rooms`.
- Preserve deterministic qids and output ordering.

# Test Plan

Run focused suites first, then all Goal 70 required tests and smokes.

# Links / Artifacts

- `test-435` through `test-442`
