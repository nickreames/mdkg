---
id: task-719
type: task
title: Push the dormant release commit require CI and publish mdkg v0.5.0
status: done
priority: 1
epic: epic-233
prev: task-718
next: task-720
tags: [release, push, ci, npm]
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0, artifact://github-actions/run/29254216004]
relates: [goal-64, test-390]
blocked_by: []
blocks: [task-720]
refs: [test-390, dec-81, chk-511, chk-512]
context_refs: [goal-64, goal-69, epic-233, edd-72, dec-69, edd-75, dec-80, dec-81, task-718, test-389, test-434]
evidence_refs: [chk-511, chk-512, chk-513]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-13
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
- Stop while `goal-69` or `test-389` is incomplete; audit transfer is not a
  security waiver.
- Both prerequisites are complete. `dec-81` is the accepted v0.5.0 security
  requalification contract; do not schedule another Codex Security scan.
- Successful npm publication is irreversible for this plan; fix forward.

# Test Plan

Run `test-390`, confirm origin/CI order, and attach the npm publish receipt before
postpublish consumer validation begins.

# Results / Evidence

- Dormant release commit: `7afbf6d8df58279f70c6257b65437791fec59e63`.
- GitHub Actions run `29254216004` passed Node `24.15.0` and Node `24.x`.
- Authenticated npm owner: `nickreames`; advisories: zero.
- `mdkg@0.5.0` was absent immediately before publication.
- Publication succeeded exactly once; `latest` now resolves to `0.5.0`.
- Registry SHA-1 and integrity are recorded in `chk-513`.
- Website activation remains `draft`; no Git tag was created.

# Links / Artifacts

- `dec-69`
- `goal-50`
- `chk-513`
