---
id: task-743
type: task
title: audit current Git upgrade and external materialization handoff
status: done
priority: 1
parent: goal-65
next: task-744
tags: [goal-65, audit, git, upgrade]
owners: []
links: []
artifacts: [src/commands/git.ts, src/commands/upgrade.ts, src/commands/subgraph.ts]
relates: [goal-52, goal-60]
blocked_by: []
blocks: [task-744]
refs: [goal-65, edd-73]
context_refs: [goal-52, goal-60, dec-61, dec-63, dec-64]
evidence_refs: []
aliases: [materialization-source-audit]
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Reconciled current source and published 0.4.2 behavior with the root handoff at
`/Users/nick/omni-chat-rooms/.mdkg/work/task-458-harden-generic-git-source-materialization-and-accepted-revision-enforcement.md`.

# Acceptance Criteria

- Existing `git inspect` and `git clone` descriptor/receipt behavior is recorded.
- Missing expected revision, atomic destination, policy, discovery, and bounded
  failure behavior is identified without claiming uncommitted work.
- Existing single-repo upgrade and read-only subgraph upgrade-plan boundaries
  are recorded.

# Files Affected

- New `goal-65` planning nodes only.

# Implementation Notes

The audit found that Git lifecycle primitives already exist and must be
hardened through an additive successor rather than duplicated.

# Test Plan

- `test-408`
- `test-410`

# Links / Artifacts

- `edd-73`
- root handoff path above
