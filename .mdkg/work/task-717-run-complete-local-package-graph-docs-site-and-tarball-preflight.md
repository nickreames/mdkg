---
id: task-717
type: task
title: Run complete local package graph docs site and tarball preflight
status: todo
priority: 1
epic: epic-232
prev: task-716
next: task-718
tags: [release, prepublish, docs, site, tarball]
owners: []
links: []
artifacts: []
relates: [goal-64, test-388]
blocked_by: [task-716]
blocks: [task-718]
refs: [test-388]
context_refs: [goal-64, epic-232, edd-72, dec-69, task-716]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Run the complete local release ladder and prepare clean release commits before
requesting permission for network checks or external mutations.

# Acceptance Criteria

- Package build/test/CLI contract/docs/graph/loop smoke and publish-readiness pass.
- mdkg.dev and docs builds/smokes pass in dormant and local-active preview modes.
- Npm pack and publish dry-runs pass; tarball contents and isolated install are reviewed.
- Upgrade fixtures, public no-secret scan, responsive Browser preview, and
  `git diff --check` pass.
- Release commit is cleanly separable from the later one-line activation change.

# Files Affected

List files/directories expected to change.

- Entire publish-bound repository diff and local build artifacts
- Temporary tarball/install/browser receipt locations

# Implementation Notes

- Use clean temporary npm cache/userconfig locations and never expose tokens.
- This task performs no push, publish, global replacement, or deployment.

# Test Plan

Complete `test-388` and record one pre-approval checkpoint containing every local
receipt and exact remaining side effects.

# Links / Artifacts

- `edd-72`
- `verify-close-and-checkpoint`
