---
id: epic-71
type: epic
title: branch conflict and multi writer safety
status: done
priority: 1
tags: [branches, multi-writer, ids, 0-3-6, 0-3-7]
owners: []
links: []
artifacts: []
relates: [goal-13]
blocked_by: []
blocks: [task-326, task-341, task-342, task-343, task-344, test-138, test-139, test-140]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Goal

Make mdkg credible in multi-branch and multi-agent repos by detecting and
repairing duplicate IDs and hardening mutating writes.

# Scope

- Duplicate numeric ID detection.
- Deterministic ID rewrite planning and reference update receipts.
- Stale selected-goal detection.
- Repo-local writer lock and atomic-write audit for mutating commands.
- Two-branch merge smoke proof.

# Milestones

- `0.3.6`: duplicate ID detection and repair planning completed.
- `0.3.7`: multi-writer safety and merge-smoke proof completed.

# Closeout

Completed under `goal-13`:

- `task-326`: branch conflict and multi-writer architecture captured in
  `edd-21`.
- `task-341` / `test-138`: duplicate local id validation diagnostics and
  deterministic read-only rewrite planning.
- `task-342`: structured reference rewrite receipts and stale selected-goal
  repair planning.
- `task-343` / `test-139`: writer-lock and atomic write audit hardening.
- `task-344` / `test-140`: packed two-branch conflict smoke and prepublish gate.

Final gate for this epic: `npm run prepublishOnly` passed with the new
`smoke:branch-conflicts` gate included.

# Out of Scope

- Full immutable UID migration unless duplicate-ID repair proves insufficient.

# Risks

- Rewriting references without a complete receipt and rollback story.

# Links / Artifacts

- `goal-13`
- `edd-21`
- `task-326`
- `task-341`
- `task-342`
- `task-343`
- `task-344`
- `test-138`
- `test-139`
- `test-140`
