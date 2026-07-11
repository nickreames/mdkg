---
id: task-759
type: task
title: implement aggregate dry run and strict dirty overlap preflight
status: todo
priority: 1
parent: goal-68
prev: task-758
next: task-760
tags: [goal-68, dry-run, dirty-state, preflight]
owners: []
links: []
artifacts: []
relates: [goal-68]
blocked_by: [task-758]
blocks: [task-760]
refs: [goal-68, dec-79]
context_refs: [edd-73]
evidence_refs: []
aliases: [linked-upgrade-strict-preflight]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Aggregate existing single-repo dry-run receipts and Git dirty state into one
strict all-target plan before any mutation.

# Acceptance Criteria

- Every selected repo uses the same installed seed/version and existing
  `runUpgradeCommand` planning behavior.
- Planned writes are compared to tracked/untracked dirty paths canonically.
- Any unsafe/conflicting plan or dirty overlap blocks all writes.
- Unrelated dirtiness is retained in receipts and does not get staged or edited.
- Dry-run leaves all selected files, indexes, Git state, and bundles unchanged.

# Files Affected

- Upgrade orchestration and temporary multi-repo tests when executed.

# Implementation Notes

Use one aggregate receipt with ordered child receipts and explicit blockers.

# Test Plan

- `test-421`
- `test-422`

# Links / Artifacts

- Existing `UpgradeReceipt`
