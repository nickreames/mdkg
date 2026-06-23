---
id: epic-137
type: epic
title: release hygiene commit and goal-28 activation boundary
status: todo
priority: 1
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Ensure the completed `goal-27` alignment is committed first and `goal-28` starts from a clean, explicit implementation boundary.

# Scope

- Confirm `goal-27` is done/achieved and no selected goal is stale.
- Confirm this creation-only pass made no implementation or Vercel changes.
- When executing later, claim `task-472` before touching docs/site code.

# Milestones

- `goal-27` commit exists.
- `goal-28` exists, is paused, and routes to `task-472` when explicitly inspected.

# Out of Scope

- No Starlight implementation, Vercel setup, push, deploy, DNS, publish, or tag in the creation-only pass.

# Risks

- Confusing graph creation with execution; mitigate by keeping `goal_state: paused`.

# Links / Artifacts

- `goal-27`
- `chk-201`
- `task-472`
