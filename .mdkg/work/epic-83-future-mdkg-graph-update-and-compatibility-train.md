---
id: epic-83
type: epic
title: future mdkg graph update and compatibility train
status: todo
priority: 3
tags: [graph-upgrade, compatibility, future, lower-priority]
owners: []
links: []
artifacts: []
relates: [task-363, test-151]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Goal

Hold lower-priority future mdkg graph update work, likely for a later `0.3.5+`
compatibility train, without blocking spike or mdkg.dev launch readiness.

# Scope

- future graph update planning
- compatibility dry-run contracts
- upgrade/no-mutation safety rules

# Milestones

- `task-363` defines the future release train.
- `test-151` defines dry-run/no-mutation expectations.

# Out of Scope

- Current spike implementation.
- Current mdkg.dev launch planning.
- Real migration or publish work.

# Risks

- Pulling this into the active spike goal would distract from the next
  implementation slice.

# Links / Artifacts

- `task-363`
- `test-151`
