---
id: task-762
type: task
title: close linked upgrade goal with operator handoff
status: todo
priority: 1
parent: goal-68
prev: task-761
tags: [goal-68, closeout, handoff]
owners: []
links: []
artifacts: []
relates: [goal-68]
blocked_by: [task-761]
blocks: []
refs: [goal-68]
context_refs: [edd-73, dec-79]
evidence_refs: []
aliases: [linked-upgrade-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Run final source/package/graph checks, close the goal, and publish an operator
handoff that preserves commit and subgraph-refresh responsibilities.

# Acceptance Criteria

- Every scoped task/test has evidence and goal evaluation is achieved.
- Checkpoint records selector matrix, strict/partial behavior, package proof,
  compatibility, dirty state, and no Git/subgraph side effects.
- Handoff shows dry-run before apply and explicit downstream validation/commit/
  subgraph-sync steps.

# Files Affected

- Goal checkpoint and intended implementation surfaces.

# Implementation Notes

Do not use this closeout to upgrade real downstream repositories.

# Test Plan

- Full `goal-68` checks and goal evaluation.

# Links / Artifacts

- Operator handoff receipt
