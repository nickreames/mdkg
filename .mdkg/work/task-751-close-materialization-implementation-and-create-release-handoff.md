---
id: task-751
type: task
title: close materialization implementation and create release handoff
status: todo
priority: 1
parent: goal-66
prev: task-750
tags: [goal-66, closeout, release-handoff]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-750]
blocks: []
refs: [goal-66]
context_refs: [edd-73, dec-75, dec-76, dec-77, dec-78]
evidence_refs: []
aliases: [materialize-implementation-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Run the complete release-candidate ladder, record the implementation
checkpoint, close `goal-66`, and produce the exact sanitized input for
`goal-67`.

# Acceptance Criteria

- Every scoped task/test is done with command evidence.
- Source, generated, docs, package, and installed-temp behavior agree.
- Git clone compatibility and no-push regression gates pass.
- Release handoff records commit, package hash, request/receipt schema refs,
  dirty state, validation, no-push status, and remaining risks.

# Files Affected

- Goal closeout and checkpoint nodes plus intended implementation surfaces.

# Implementation Notes

Do not bump version, publish, push, tag, deploy, or replace global install.

# Test Plan

- Full `goal-66` required checks and goal evaluation.

# Links / Artifacts

- `goal-67`
