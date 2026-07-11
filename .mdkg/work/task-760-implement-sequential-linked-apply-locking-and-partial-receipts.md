---
id: task-760
type: task
title: implement sequential linked apply locking and partial receipts
status: todo
priority: 1
parent: goal-68
prev: task-759
next: task-761
tags: [goal-68, apply, lock, receipt]
owners: []
links: []
artifacts: []
relates: [goal-68]
blocked_by: [task-759]
blocks: [task-761]
refs: [goal-68, dec-79]
context_refs: [edd-73]
evidence_refs: []
aliases: [linked-upgrade-sequential-apply]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Apply accepted linked plans in deterministic order with per-repo mutation locks,
race rechecks, and complete/blocked/partial aggregate receipts.

# Acceptance Criteria

- Apply starts only after strict aggregate preflight succeeds.
- Each repo is rechecked immediately before its write and uses existing atomic
  single-repo upgrade writes under its mutation lock.
- Unexpected failure stops remaining targets and lists applied, failed, and
  pending roots with no rollback claim.
- Idempotent rerun after complete apply reports no changes.
- No install, stage, commit, push, subgraph registration/sync, or gitlink change.

# Files Affected

- Upgrade orchestration, receipts, locks, and tests when executed.

# Implementation Notes

Cross-repository behavior is transactionally preflighted but not falsely
advertised as atomic after writes begin.

# Test Plan

- `test-423`
- `test-424`

# Links / Artifacts

- `dec-79`
