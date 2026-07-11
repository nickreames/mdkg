---
id: epic-222
type: epic
title: Make loop plan and loop next operator-ready
status: todo
priority: 1
tags: [loop, ux, plan, next]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, loop-4]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Make loop execution easier to drive by turning `loop plan` into the readiness
surface and adding minimal actionable routing through `loop next`.

# Scope

- `mdkg loop plan` readiness/status output for open questions, approvals,
  lanes, child refs, run/output refs, waivers, blockers, and closeout readiness.
- `mdkg loop next` as read-only next actionable lane selection.

# Milestones

- `task-697`: upgrade `loop plan`.
- `task-698`: add `loop next`.

# Out of Scope

- `loop status`, `loop evaluate`, or `loop handoff` commands.
- Mutating claim semantics for loops.

# Risks

- Making `loop next` too goal-specific and losing loop-specific lane semantics.
- Closing loops too early if readiness output is incomplete.

# Links / Artifacts

- `goal-59`
- `loop-4`
- `edd-69`
- `dec-66`
