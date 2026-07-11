---
id: epic-220
type: epic
title: Define loop readiness metadata and projection model
status: todo
priority: 1
tags: [loop, ux, readiness, metadata]
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

Define the metadata and derived projection that make a loop answerable before,
during, and after execution.

# Scope

- First-class metadata for pre-run questions, approvals, evidence lanes,
  waivers, decisions, run refs, output refs, and closeout readiness.
- A reusable readiness projection that command surfaces can share.
- Compatibility with existing loop metadata from `goal-58`.

# Milestones

- `task-693`: add metadata fields and validation semantics.
- `task-694`: build the reusable projection consumed by loop commands.

# Out of Scope

- Generic status/next/evaluate semantics across all mdkg node types.
- Runtime execution or model routing.

# Risks

- Over-modeling loop state before the first UX pass is proven.
- Weak validation that allows ambiguous readiness output.

# Links / Artifacts

- `goal-59`
- `edd-69`
- `dec-66`
- `loop-4`
