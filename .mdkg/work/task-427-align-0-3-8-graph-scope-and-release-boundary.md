---
id: task-427
type: task
title: align 0.3.8 graph scope and release boundary
status: done
priority: 1
epic: epic-113
parent: goal-23
tags: [alignment, release, 0.3.8]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Create the active 0.3.8 warning-scale UX goal, scoped epics, tasks, tests, and research spike without starting live-demo, mdkg.dev launch, publish, tag, push, or child-repo work.

# Acceptance Criteria

- `goal-23` exists, is active, and has `active_node: task-427`.
- Scoped epics, spike, tasks, and tests are wired into `goal-23.scope_refs`.
- `goal next goal-23 --json` routes to `task-427` before closeout and to the next implementation node after this task is done.
- The release boundary states no real publish, tag, push, global install, or child-repo mutation.

# Files Affected

- .mdkg/work
- .mdkg/index

# Implementation Notes

- This is graph alignment only.
- Functional code starts at `task-430` after the warning-output contract is specified.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-23 --json`
- `git diff --check`

# Links / Artifacts

- goal-23
- test-190
