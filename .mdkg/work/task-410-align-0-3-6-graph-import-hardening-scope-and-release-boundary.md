---
id: task-410
type: task
title: align 0.3.6 graph import hardening scope and release boundary
status: done
priority: 1
epic: epic-104
parent: goal-19
tags: [0.3.6, graph-import, alignment]
owners: []
links: []
artifacts: []
relates: [goal-18]
blocked_by: []
blocks: [task-411, task-412, test-178, test-179]
refs: []
aliases: []
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Align the post-publish `0.3.5` graph import selected-goal gap into the `0.3.6` lane before MCP work starts.

# Acceptance Criteria

- `goal-19` scope includes the graph import hardening epic, tasks, and tests.
- `goal-19` required checks include `npm run smoke:graph-clone`.
- Archived legacy `goal-11` no longer causes `goal next goal-19` routing warnings.

# Files Affected

- `.mdkg/work/goal-19-*`
- `.mdkg/work/goal-11-*`
- `.mdkg/work/epic-104-*`

# Implementation Notes

- Keep this as a 0.3.6 fix because `mdkg@0.3.5` is already published.
- After alignment, activate `goal-19` and claim `task-411` for implementation.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-19 --json`

# Links / Artifacts

- goal-18
- goal-19
