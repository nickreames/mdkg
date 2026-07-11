---
id: epic-213
type: epic
title: Handoff loop implementation scope and CocoIndex separation
status: todo
priority: 1
tags: [loop, planning, handoff, cocoindex, boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, goal-58, goal-53, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-05
updated: 2026-07-05
---
# Goal

Turn the accepted planning work into a clean implementation handoff while
keeping CocoIndex and optional index-provider work out of the loop-node
implementation lane.

# Scope

- Update `goal-58` only after the loop design is accepted.
- Document activation conditions and executable implementation scope.
- Preserve `goal-53` as the separate project-memory/CocoIndex planning lane or
  note if a later goal should supersede it.
- Prove the placeholder goal remains paused/blocked until design acceptance.

# Milestones

- Write the final implementation handoff.
- Re-check that CocoIndex is not in loop implementation scope.
- Validate the graph and goal routing.

# Out of Scope

- CocoIndex provider design or source implementation.
- Remote references, semantic search, or embedding visibility rules.
- Source implementation of the loop node before planning closes.

# Risks

- Implementation could start from the placeholder goal too early.
- CocoIndex work could become entangled with loop semantics.
- The handoff could omit validation/pack/search/seed tests and create a weak
  implementation lane.

# Links / Artifacts

- `goal-57`
- `goal-58`
- `goal-53`
- `task-674`
- `test-349`
- `test-350`
