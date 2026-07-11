---
id: task-745
type: task
title: seed materialization publication and linked upgrade successors
status: done
priority: 1
parent: goal-65
prev: task-744
tags: [goal-65, successor, routing]
owners: []
links: []
artifacts: []
relates: [goal-66, goal-67, goal-68]
blocked_by: [task-744]
blocks: []
refs: [goal-65, goal-66, goal-67, goal-68, task-752]
context_refs: [edd-73, dec-75, dec-76, dec-77, dec-78, dec-79]
evidence_refs: [chk-480]
aliases: [git-materialization-successor-seed]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Seeded separate implementation, publication, and optional linked-upgrade goals
with concrete tasks, tests, required checks, boundaries, and execution order.

# Acceptance Criteria

- `goal-66` is paused behind `goal-64` and routes to schema preflight.
- `goal-67` is paused behind `goal-66` and owns external release mutations.
- `goal-68` is paused, non-blocking, and preserves single-repo upgrade default.
- `task-752` does not appear in `goal-66` scope.

# Files Affected

- New successor goal/task/test nodes only.

# Implementation Notes

The current v0.5.0 goals remain authoritative and unchanged.

# Test Plan

- `test-409`
- `test-410`

# Links / Artifacts

- `chk-480`
