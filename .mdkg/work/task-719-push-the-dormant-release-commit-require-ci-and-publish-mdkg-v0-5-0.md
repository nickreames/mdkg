---
id: task-719
type: task
title: Push the dormant release commit require CI and publish mdkg v0.5.0
status: todo
priority: 1
epic: epic-233
prev: task-718
next: task-720
tags: [release, push, ci, npm]
owners: []
links: []
artifacts: []
relates: [goal-64, test-390]
blocked_by: [task-718]
blocks: [task-720]
refs: [test-390]
context_refs: [goal-64, epic-233, edd-72, dec-69, task-718]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Put the exact release candidate on origin while public promotion remains dormant,
require green CI, then publish the identical `mdkg@0.5.0` package.

# Acceptance Criteria

- First push contains package/release work with activation still dormant.
- Origin commit SHA and publish candidate SHA match; required CI is green.
- Registry absence/auth are rechecked immediately before publish.
- `npm publish` succeeds exactly once and immediate registry metadata is captured.
- No Git tag, website activation, or second push occurs in this task.

# Files Affected

List files/directories expected to change.

- Git origin and GitHub CI
- Npm registry and sanitized publish receipt

# Implementation Notes

- Stop on changed origin, CI failure, auth drift, or target-version appearance.
- Successful npm publication is irreversible for this plan; fix forward.

# Test Plan

Run `test-390`, confirm origin/CI order, and attach the npm publish receipt before
postpublish consumer validation begins.

# Links / Artifacts

- `dec-69`
- `goal-50`
