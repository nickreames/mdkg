---
id: epic-215
type: epic
title: Loop validation lifecycle and graph semantics
status: todo
priority: 1
tags: [loop, validation, lifecycle, graph]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Define and enforce loop lifecycle semantics as graph state: modes, lineage,
linked children, blocker-continuation behavior, and safe validation boundaries.

# Scope

- Validate MVP loop metadata and mode values.
- Preserve one node type while allowing template, forked/scoped, and
  run-bearing behavior through metadata and links.
- Encode blocker-continuation guidance without making mdkg execute agents.

# Milestones

- `task-677` implements metadata/mode validation.
- `task-679` implements blocker-continuation graph guidance.
- `test-352` and `test-359` prove diagnostics and continuation contracts.

# Out of Scope

- No separate loop run persistence engine in MVP.
- No hidden mutable runtime state.

# Risks

- Over-validating low-level fields before dogfooding proves the right shape.
- Under-validating lineage and letting forks lose provenance.

# Links / Artifacts

- `goal-58`
- `edd-66`
- `task-668`
- `task-670`
