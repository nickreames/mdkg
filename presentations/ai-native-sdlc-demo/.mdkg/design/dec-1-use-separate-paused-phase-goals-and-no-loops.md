---
id: dec-1
type: dec
title: Use separate paused phase goals and no loops
status: accepted
tags: [topology, goals, no-loops]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
refs: [prd-1, edd-1]
aliases: [phase-goals-no-loops]
created: 2026-07-26
updated: 2026-07-26
---

# Context

Planning, source hardening, deck production, rehearsal, publication, event preparation, live execution, and adoption have different completion and authority boundaries.

# Decision

Use eight separately closable phase goals with one epic and deterministic actionable chain per goal. Goal 1 may be active during authoring; Goals 2–8 are fully specified but paused. Activate only one local program goal at a time. Create no loop node.

Cross-goal prerequisites belong in context and Activation Conditions. Do not use goal-to-goal blocked_by or put goals, design records, checkpoints, or child-run goals in scope_refs.

# Alternatives Considered

- One umbrella goal: rejected because it mixes authority and prevents honest closure.
- A program loop: rejected because the program is finite and loops are outside the talk.
- Unsequenced goals: rejected because publication requires accepted predecessor evidence.

# Consequences

Every phase exposes a clear outcome, first action, evidence boundary, and next activation without accidentally authorizing future side effects.

# Links / references

- prd-1
- edd-1
