---
id: task-744
type: task
title: lock materialization and linked upgrade contract decisions
status: done
priority: 1
parent: goal-65
prev: task-743
next: task-745
tags: [goal-65, decision, contract]
owners: []
links: []
artifacts: []
relates: [edd-73]
blocked_by: [task-743]
blocks: [task-745]
refs: [goal-65, dec-75, dec-76, dec-77, dec-78, dec-79]
context_refs: [edd-73, dec-61, dec-63, dec-64]
evidence_refs: []
aliases: [materialization-contract-decisions]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Captured accepted command, JSON request, revision, atomicity, auth, discovery,
submodule, deferral, and linked-upgrade decisions.

# Acceptance Criteria

- `git materialize` is additive and clone-compatible.
- JSON v1, discovery modes, external auth, and deny/ignore submodules are exact.
- YAML and recursive submodules are explicit non-blocking follow-ups.
- Linked upgrades use explicit strict preflight and no Git side effects.

# Files Affected

- `edd-73`
- `dec-75` through `dec-79`

# Implementation Notes

Public contracts remain generic. Downstream runtime profiles may require the
optional expected tree and required project-memory mode without changing mdkg
v1 defaults.

# Test Plan

- `test-408`
- `test-409`

# Links / Artifacts

- `edd-73`
