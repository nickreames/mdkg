---
id: task-782
type: task
title: Run v0.5.1 prepublish readiness closeout and create local implementation commit
status: done
priority: 1
epic: epic-249
tags: [release-readiness, prepublish, checkpoint, commit]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-781, test-435, test-436, test-437, test-438, test-439, test-440, test-441, test-442]
blocks: []
refs: [goal-70, goal-71, edd-76, dec-82]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Prove the implementation is publish-ready while retaining version 0.5.0, then
record one reviewable local commit for Goal 71.

# Acceptance Criteria

- Every Goal 70 required check and `test-443` passes.
- Package and lock versions remain 0.5.0; no external mutation occurs.
- Checkpoint explains the old failure, ownership semantics, preflight boundary,
  compatibility, tests, commit SHA, dirty state, and release follow-up.
- Stage only intended source, tests, docs, generated contracts, and graph evidence
  and create one logical local implementation commit.

# Files Affected

List files/directories expected to change.

- All files intentionally changed by Goal 70.
- Goal/checkpoint evidence.

# Implementation Notes

- Run index before validation and all checks serially where shared outputs exist.
- Do not push, publish, tag, install globally, or deploy.

# Test Plan

Run the full frontmatter ladder, `test-443`, final Git inspection, and goal
evaluation.

# Links / Artifacts

- `goal-71`
