---
id: epic-209
type: epic
title: Design loop template fork run and provenance lifecycle
status: todo
priority: 1
tags: [loop, planning, templates, forking, provenance]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-05
updated: 2026-07-05
---
# Goal

Design the lifecycle that lets one first-class `loop` node act as a reusable
template, a scoped fork, or a run-bearing process while preserving provenance
and auditable execution evidence.

# Scope

- Template-to-fork lineage.
- Scoped loop identity and scope binding.
- Default linked-child materialization during fork.
- Planning-only or no-child materialization option.
- Run evidence represented through linked graph nodes, checkpoints, receipts,
  JSONL events, artifacts, or a layered combination.
- Stale-fork detection and template-promotion concepts.
- Non-blocking blocker handling that creates spike/proposal/recommendation
  work and continues useful progress where possible.

# Milestones

- Define conceptual template, fork, run, and output lifecycle in `edd-66`.
- Specify blocker-continuation behavior.
- Produce implementation-contract tests for provenance and blocker handling.

# Out of Scope

- Separate `loop_template` or `loop_run` node types for MVP.
- Runtime scheduling, model routing, or tool execution.
- Full template promotion automation in the first implementation.

# Risks

- Forks could silently drift from templates without stale-state visibility.
- Runs could become mutable scratchpads instead of auditable evidence.
- Early blocker handling could stop loops before they reach a high percentage
  of useful completion.

# Links / Artifacts

- `goal-57`
- `edd-66`
- `dec-65`
- `task-669`
- `task-670`
- `test-346`
- `test-347`
