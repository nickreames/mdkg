---
id: task-674
type: task
title: Write loop implementation handoff and update placeholder goal
status: done
priority: 1
epic: epic-213
parent: epic-213
tags: [loop, planning, handoff, implementation-goal, cocoindex-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, goal-58, goal-53, epic-213, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

After the planning design is accepted, update `goal-58` with executable
implementation epics, tasks, tests, and checks, or explicitly defer it. This is
the bridge from planning to source work.

# Acceptance Criteria

- `goal-58` remains paused/blocked until `goal-57` closes or explicitly hands
  off accepted design.
- Implementation scope is populated only from accepted or superseded design
  records.
- Source work covers parser, templates, CLI, validation, index/search/show/list,
  pack, docs, command matrix, seed loops, and smoke tests.
- CocoIndex remains excluded and referenced back to `goal-53` or a future
  superseding planning goal.
- The handoff includes required checks and closeout report expectations.

# Files Affected

Planning-only graph targets:

- `.mdkg/work/goal-58-*`
- future implementation child nodes under `.mdkg/work/**`
- `goal-53` only if later superseded by a separate CocoIndex planning lane

# Implementation Notes

- Do not activate `goal-58` as part of this task unless the operator explicitly
  asks for implementation to begin.
- Keep placeholder scope refs empty until real implementation scope exists.

# Handoff Decision

`goal-58` remains deliberately paused and blocked. The planning pass produced
enough design for a later implementation pass to expand it, but this session
does not implement source code, templates, CLI behavior, docs, or tests.

# Implementation Goal Update

The implementation placeholder should carry these planning refs as context:

- `goal-57`
- `edd-66`
- `dec-65`
- `task-667` source-surface audit
- `task-668` boundary model
- `task-669` template/fork/run provenance policy
- `task-670` blocker-continuation policy
- `task-671` seed catalog
- `task-672` CLI/API UX
- `task-673` validation/index/search/show/pack impacts
- `test-345` through `test-350` implementation and boundary contracts

Its `scope_refs` should remain empty until an implementation session creates
real executable child work from the accepted design.

# CocoIndex Separation

CocoIndex remains under `goal-53` or a future superseding project-memory/index
provider planning lane. It must not be added to the loop-node implementation
scope.

# Test Plan

- `mdkg goal show goal-58 --json`
- `mdkg show test-349`
- `mdkg show test-350`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `epic-213`
- `goal-58`
- `goal-53`
- `test-349`
- `test-350`
