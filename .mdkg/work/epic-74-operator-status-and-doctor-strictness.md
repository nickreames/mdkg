---
id: epic-74
type: epic
title: operator status and doctor strictness
status: done
priority: 1
tags: [status, doctor, operator, 0-3-2]
owners: []
links: []
artifacts: []
relates: [goal-13]
blocked_by: [task-323]
blocks: [task-324, task-331, task-332, task-333, test-132, test-133, test-134]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Goal

Make repo health scriptable for humans, agents, and CI through status and strict
doctor contracts.

# Scope

- Design and implement `mdkg status --json`.
- Strengthen `mdkg doctor --strict --json` with typed check IDs.
- Include release, git, graph, DB, subgraph, selected-goal, and generated-state
  health.
- Keep repair/apply behavior out of this epic; it belongs to `epic-70`.

# Milestones

- `0.3.2`: status and doctor strict foundation.

# Out of Scope

- Applying repairs. Repair planning belongs to `epic-70`.

# Risks

- Mixing human diagnostics with JSON stdout.

# Links / Artifacts

- `edd-17`
- `task-324`, `task-331`, `task-332`, `task-333`
- `test-132`, `test-133`, `test-134`
- `chk-98`, `chk-99`, `chk-100`, `chk-101`

# Closeout

The 0.3.2 operator-health foundation is complete. `mdkg status --json` now
provides a read-only operator summary, `mdkg doctor --strict --json` emits typed
checks and strict failures, and `smoke:operator-health` proves the surface from
a packed install in a temp repo. Repair/apply behavior remains deferred to
`epic-70`.
