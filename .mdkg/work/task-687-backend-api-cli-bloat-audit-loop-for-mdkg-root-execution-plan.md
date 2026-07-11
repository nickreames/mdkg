---
id: task-687
type: task
title: Backend API CLI bloat audit loop for mdkg root execution plan
status: done
priority: 1
parent: loop-2
tags: [loop-template, audit, backend, api, cli, loop-fork, loop-child, task, stale-fork, superseded]
owners: []
links: []
artifacts: []
relates: [loop-2, loop-4]
blocked_by: []
blocks: []
refs: [loop-2, loop-4, template://loops/backend-api-cli-bloat-audit]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Plan and coordinate execution work for Backend API CLI bloat audit loop for mdkg root over mdkg root repository.

# Superseded / Cancelled

This child node belongs to stale fork `loop-2` and is closed as superseded by corrected fork `loop-4`. Use `task-690` for the runnable execution plan.

# Acceptance Criteria

- Work remains scoped to the loop definition of done.
- Outputs, evidence, and follow-up nodes are linked to the loop.
- If blocked, the loop records blocker evidence and continues useful scoped work where possible.

# Files Affected

- No functional source files should be changed while running this read-only audit loop.
- Future simplification or compatibility work should be represented as mdkg work nodes.

# Implementation Notes

- Use `/goal` or an equivalent long-running harness to execute the loop read-only.
- Inventory CLI/API surfaces, command flags, module boundaries, duplicated command logic, and ownership seams.
- If a blocker appears, create or request a spike/proposal with at least three viable paths and one recommended path.

# Test Plan

Template: template://loops/backend-api-cli-bloat-audit

# Links / Artifacts

- `loop-2`
- `spike-26`
- `test-363`
