---
id: task-761
type: task
title: align linked upgrade help contract docs and packed smokes
status: todo
priority: 1
parent: goal-68
prev: task-760
next: task-762
tags: [goal-68, help, docs, contract, package]
owners: []
links: []
artifacts: []
relates: [goal-68]
blocked_by: [task-760]
blocks: [task-762]
refs: [goal-68]
context_refs: [edd-73, dec-79]
evidence_refs: []
aliases: [linked-upgrade-package-parity]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Align source and installed CLI help, generated contract, command matrix, docs,
publish readiness, and multi-repo packed-package smokes.

# Acceptance Criteria

- Help documents linked/include/exclude, strict preflight, and no Git ownership.
- Generated contract lists cross-repo managed scaffold writes and locks
  truthfully.
- Existing no-flag snapshots remain unchanged.
- Packed neutral fixture covers root, registered children, explicit include,
  exclusions, blockers, complete apply, and partial race behavior.

# Files Affected

- CLI/docs/generated/package/smoke surfaces when executed.

# Implementation Notes

No downstream repository name belongs in public fixtures.

# Test Plan

- `test-420` through `test-424`

# Links / Artifacts

- Packed consumer receipt
