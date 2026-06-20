---
id: task-415
type: task
title: implement completed-goal last-active-node semantics
status: done
priority: 1
epic: epic-105
parent: goal-22
tags: [goal-lifecycle, last-active-node]
owners: []
links: []
artifacts: []
relates: [goal-16]
blocked_by: [task-414]
blocks: [test-181, task-423]
refs: []
aliases: [last-active-node-semantics]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Remove stale active-node friction from completed goals by preserving the final actionable node as `last_active_node`.

# Acceptance Criteria

- Closing a goal as done or achieved migrates `active_node` to `last_active_node` and removes actionable `active_node`.
- Existing achieved/done goals with `active_node` can be migrated through a safe upgrade or repair path.
- `mdkg goal next <done-goal> --json` returns `node: null` without stale active-node warnings.
- `goal show`, `goal current`, `goal evaluate`, validation, and docs explain the new semantics.

# Files Affected

- Goal lifecycle commands and validation.
- Upgrade or repair path.
- Help snapshots and command matrix.

# Implementation Notes

- Preserve historical final-node context as `last_active_node`; do not leave completed goals with actionable `active_node`.
- Migration should be safe to preview before writing.

# Test Plan

- Unit tests for active, paused, blocked, done, achieved, and archived goals.
- npm run smoke:goal-lifecycle
- test-181

# Links / Artifacts

- test-181
