---
id: task-697
type: task
title: Upgrade loop plan to readiness cockpit
status: done
priority: 1
epic: epic-222
parent: goal-59
tags: [loop, plan, readiness, ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-693, task-694, loop-4]
context_refs: []
evidence_refs: [chk-399]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Upgrade `mdkg loop plan` from a structural view into the primary readiness and
status cockpit for running loops.

# Acceptance Criteria

- `loop plan` reports pre-run questions, unanswered questions, pre-approved
  actions, approval-gated actions, evidence lanes, child refs, run refs, output
  refs, lane waivers, blockers, and closeout readiness.
- Existing `loop plan` JSON fields remain compatible and new fields are
  additive.
- Text output highlights what must be answered before execution and what is
  already safe to run.
- Completed loops like `loop-4` show completed lanes and residual outputs
  clearly.

# Files Affected

- `src/commands/loop.ts`
- `tests/commands/loop.test.ts`
- generated docs/command matrix if help text changes

# Implementation Notes

- Use the shared readiness projection from `task-694`.
- Do not add `loop status` in this goal.
- Keep `/goal` handoff as design-only language if mentioned.

# Test Plan

- focused `loop plan` tests
- `test-370`
- `node dist/cli.js loop plan loop-4 --json` when fixture/state allows

# Links / Artifacts

- `task-694`
- `loop-4`
