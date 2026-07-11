---
id: task-755
type: task
title: capture bounded release approval and verify auth and origin readiness
status: todo
priority: 1
parent: goal-67
prev: task-754
next: task-756
tags: [goal-67, approval, auth, origin]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [task-754]
blocks: [task-756]
refs: [goal-67]
context_refs: [dec-69]
evidence_refs: []
aliases: [materialize-release-approval]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Stop for one explicit bounded approval after local gates pass, then verify Git,
npm, CI, and global-install authorization without exposing credentials.

# Acceptance Criteria

- Approval enumerates push, npm publish, global install, and any separately
  required public activation.
- Origin branch and no-force policy are recorded.
- Npm auth and selected-version absence are rechecked immediately before use.
- No Git tag is authorized by default.

# Files Affected

- Approval/evidence nodes only before external mutation.

# Implementation Notes

Approval does not carry over from prior releases.

# Test Plan

- `test-416`
- `test-417`

# Links / Artifacts

- Explicit approval receipt
