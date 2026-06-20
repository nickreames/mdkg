---
id: epic-105
type: epic
title: completed goal lifecycle and executable scope ergonomics
status: todo
priority: 1
tags: [goal-lifecycle, scope, ergonomics]
owners: []
links: []
artifacts: []
relates: [goal-22, goal-16]
blocked_by: []
blocks: [spike-11, task-413, task-414, task-415, test-180, test-181]
refs: []
aliases: [goal-lifecycle-ergonomics, executable-scope-ergonomics]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Make goal lifecycle and scope routing easier for long-running agent work.

# Scope

- Completed and achieved goals should preserve their last active work item without requiring an actionable `active_node`.
- Goal routing should silence stale-action warnings for done, achieved, and archived goals.
- Executable scope remains distinct from contextual references.

# Acceptance Criteria

- `mdkg goal done` or equivalent closeout migrates `active_node` to `last_active_node`.
- `mdkg goal next <done-goal> --json` returns `node: null` without misleading active-node warnings.
- Tests cover active, paused, blocked, done, achieved, and archived goal states.

# Milestones

- Complete spike-11 research.
- Implement last-active-node semantics.
- Prove routing behavior through test-181.

# Out of Scope

- Rewriting unrelated achieved goals outside the supported migration path.

# Risks

- Migration must preserve historical final-node context without making completed goals actionable again.

# Related Work

- spike-11
- task-413
- task-414
- task-415
- test-180
- test-181

# Links / Artifacts

- goal-22
