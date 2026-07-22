---
id: task-809
type: task
title: Checkpoint tag-policy readiness and hand off a future rewrite goal
status: todo
priority: 2
parent: goal-76
tags: [closeout, handoff]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-467]
blocks: []
refs: [goal-76, task-807, task-808, test-467]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-21
updated: 2026-07-21
---
# Overview

Checkpoint the accepted tag policy, read-only audit proof, residual caveats,
and exact authority still required by a later repository-specific rewrite goal.

# Acceptance Criteria

- Checkpoint binds tag, commit, remote, chosen range, audit hash/counts, and
  absence of forbidden commands/artifacts.
- Explicit goal evaluation supports closeout before Goal 76 is marked done.
- The checkpoint says plainly that Goal 76 grants no rewrite, force-push, tag,
  package-publication, or deployment authority.

# Files Affected

List files/directories expected to change.

- `.mdkg/work/chk-*-*`
- `.mdkg/work/goal-76-*`
- `.mdkg/work/task-809-*`

# Implementation Notes

- Raw audit JSON stays temporary.

# Test Plan

Run mdkg index, changed-only and bounded full validation, explicit goal
show/next/evaluate, remote parity checks, and `git diff --check`.

# Links / Artifacts

- `goal-76`
- `test-467`
