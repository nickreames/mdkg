---
id: epic-224
type: epic
title: Verify loop UX descriptor pilot and close goal
status: todo
priority: 1
tags: [loop, ux, test, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, test-366]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Prove the focused loop UX/descriptor pilot is compatible, documented, and ready
to close without drifting into the broader CLI planning lane.

# Scope

- Focused regression tests for metadata, `new loop`, list, plan, next,
  descriptors, existing loop commands, and unchanged goal behavior.
- Full goal closeout evidence.

# Milestones

- `test-367` through `test-374` pass with evidence.
- `task-701` runs the final checks and closes `goal-59`.

# Out of Scope

- Closing `goal-60`.
- Implementing generic CLI ergonomics.

# Risks

- Missing generated-doc or command-contract drift.
- Treating residual generic CLI ideas as blockers for the focused goal.

# Links / Artifacts

- `goal-59`
- `goal-60`
- `test-366`
