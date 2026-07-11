---
id: task-748
type: task
title: implement atomic materialization revision depth and submodule policies
status: todo
priority: 1
parent: goal-66
prev: task-747
next: task-749
tags: [goal-66, atomicity, revision, submodule]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-747]
blocks: [task-749]
refs: [goal-66, dec-76, dec-78]
context_refs: [edd-73, dec-61]
evidence_refs: []
aliases: [atomic-git-materialization]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Implement the contained sibling-temporary materialization state machine and all
Git identity, depth, and v1 submodule gates.

# Acceptance Criteria

- Full target ref resolves exactly to expected commit before acceptance.
- Expected tree is verified when provided and object format is reported.
- Full or positive-integer depth policy is enforced without unadvertised-object
  fallback.
- Deny rejects `.gitmodules` or gitlinks; ignore leaves gitlinks uninitialized
  and reports bounded count/hash evidence.
- Destination ancestry is contained and symlink-safe; existing destinations
  are never overwritten.
- Failure/cancellation removes temporary state and never publishes destination.

# Files Affected

- Git materialization engine and focused fixtures/tests.

# Implementation Notes

Disable repository-controlled hooks and execution. Use system Git arguments and
environment that do not initialize recursive submodules.

# Test Plan

- `test-412`
- `test-413`

# Links / Artifacts

- `dec-76`
- `dec-78`
