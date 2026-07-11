---
id: task-705
type: task
title: Route loop next across authorized lanes before declaring blocked
status: done
priority: 1
epic: epic-226
prev: task-704
next: task-706
tags: [loop, routing, blockers, recovery]
owners: []
links: []
artifacts: []
relates: [goal-61, test-378]
blocked_by: []
blocks: [task-706]
refs: [test-378]
context_refs: [goal-61, epic-226, edd-70, dec-67, task-679, loop-4]
evidence_refs: [chk-411]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Make `loop next` select useful authorized work across the loop graph instead of
stopping at the first unanswered question, approval, or blocked child.

# Acceptance Criteria

- Routing classifies each lane as ready, gated, active, done, waived, or blocked.
- It prefers authorized nonterminal child work, then blocker-recovery spikes and
  proposals, then other useful lanes.
- The loop reports blocked only when no authorized work or recovery path remains.
- Closeout requires all required lanes complete or explicitly waived.

# Files Affected

List files/directories expected to change.

- Loop readiness/routing command logic
- `pursue-mdkg-loop` guidance if contract wording must stay aligned
- Routing and blocker-continuation tests

# Implementation Notes

- Preserve existing statuses; do not add `loop_state`.
- Partial completion is preferred to early whole-loop blocking.

# Test Plan

Use `test-378` with multiple nested goals at mixed completion/gating states and
prove routing continues until the authorized graph is exhausted.

# Links / Artifacts

- `edd-70`
- `dec-67`
