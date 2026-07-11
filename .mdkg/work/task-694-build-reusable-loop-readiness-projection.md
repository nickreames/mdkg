---
id: task-694
type: task
title: Build reusable loop readiness projection
status: done
priority: 1
epic: epic-220
parent: goal-59
tags: [loop, readiness, projection]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-693, loop-4]
context_refs: []
evidence_refs: [chk-393]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Build the shared projection that answers whether a loop is ready, what is
missing, what is approved, what remains actionable, and what would make it
closeable.

# Acceptance Criteria

- Projection includes loop identity, mode, role, scope, template lineage,
  readiness questions, approval requirements, child refs, run refs, output refs,
  evidence lanes, blockers, lane waivers, and closeout readiness.
- Projection can be consumed by `loop plan`, `loop next`, and future generic
  command surfaces.
- Projection is deterministic and stable under `--json`.
- Projection treats completed, blocked, waiting, waived, and actionable lanes
  distinctly.

# Files Affected

- `src/commands/loop.ts`
- supporting graph/projection helpers as needed
- focused command tests

# Implementation Notes

- Keep this projection internal and boring; avoid creating a generic framework
  before `goal-60`.
- Prefer derived state over duplicating mutable status.
- Preserve current `loop plan` fields and add readiness fields additively.

# Test Plan

- focused projection tests
- `test-370`
- `test-371`
- `node dist/cli.js validate --changed-only --json`

# Links / Artifacts

- `task-693`
- `edd-69`
- `loop-4`
