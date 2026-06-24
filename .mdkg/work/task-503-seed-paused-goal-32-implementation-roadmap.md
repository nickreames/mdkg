---
id: task-503
type: task
title: seed paused goal-32 implementation roadmap
status: done
priority: 1
tags: [mdkg-dev, roadmap]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-502]
blocks: [task-504, test-237]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Create the paused implementation goal with executable epics, tasks, tests, checks, checkpoints, and launch boundaries.

# Acceptance Criteria

- `goal-32` is paused and routes to `task-507`.
- Goal 32 includes all P0/P1/P2/P3 stories.
- Goal 32 explicitly permits future push to `origin/main` after local gates and requires Vercel preview validation.
- Goal 32 forbids DNS, production promotion, npm publish, tag, analytics activation, and public launch.

# Files Affected

- `.mdkg/work/goal-32-*`
- `.mdkg/work/epic-157-*` through `.mdkg/work/epic-164-*`
- `.mdkg/work/task-507-*` through `.mdkg/work/task-518-*`
- `.mdkg/work/test-239-*` through `.mdkg/work/test-247-*`

# Test Plan

- `node dist/cli.js goal show goal-32 --json`
- `node dist/cli.js goal next goal-32 --json`

# Implementation Notes

# Links / Artifacts
