---
id: task-783
type: task
title: Finalize v0.5.1 version changelog release candidate and CI proof
status: todo
priority: 0
epic: epic-250
tags: [release, v0.5.1, versioning, ci]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [goal-70, test-443]
blocks: [task-784]
refs: [goal-71, goal-70, edd-77, dec-83]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Consume Goal 70's clean commit, finalize v0.5.1 metadata, obtain the one bounded
release approval, push the release commit, and require exact-SHA CI.

# Acceptance Criteria

- Package/lock/changelog/version facts consistently say 0.5.1.
- Package contents and all local release gates pass.
- Approval explicitly covers push, npm publication, global/root mutation, and
  docs deployment.
- Release commit reaches origin and exact-SHA CI passes; no tag exists.

# Files Affected

List files/directories expected to change.

- Package/version/changelog metadata and generated release facts.
- Release checkpoint evidence.

# Implementation Notes

- Stop before push until approval is recorded.
- Website/docs content may be committed, but deployment occurs in `task-787`.

# Test Plan

Run Goal 71 prepublish checks and close `test-444` with commit/CI evidence.

# Links / Artifacts

- `edd-77`
- `dec-83`
