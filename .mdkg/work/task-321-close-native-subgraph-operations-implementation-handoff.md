---
id: task-321
type: task
title: close native subgraph operations implementation handoff
status: todo
priority: 2
epic: epic-68
parent: goal-12
prev: task-320
tags: [closeout, handoff, subgraph, roadmap]
owners: []
links: []
artifacts: []
relates: [goal-12]
blocked_by: [task-320, test-125, test-126, test-127, test-128]
blocks: []
refs: [edd-16, dec-29]
aliases: [native-subgraph-operations-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Close the design handoff for native subgraph operations after command contracts,
tests, safety boundaries, and downstream adoption expectations are explicit.

# Acceptance Criteria

- Command contracts are decision-complete.
- Test fixtures are defined.
- No-cross-repo-mutation behavior is explicit.
- Downstream adoption guidance is ready.
- The goal can be resumed for implementation after the current release lane.

# Files Affected

- Future design evidence only.

# Implementation Notes

Do not mark implementation complete until the paused goal is resumed and source
work lands.

# Test Plan

- `mdkg validate`
- `mdkg goal show goal-12 --json`
- `mdkg goal next goal-12 --json`
- `mdkg capability search "subgraph audit upgrade-plan" --json`

# Links / Artifacts

- `goal-12`

# Completion Evidence

Pending.
