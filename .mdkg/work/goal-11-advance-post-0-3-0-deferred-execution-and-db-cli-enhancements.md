---
id: goal-11
type: goal
title: Advance post-0.3.0 deferred execution and DB CLI enhancements
status: todo
priority: 2
goal_state: paused
goal_condition: The goal is complete when post-0.3.0 deferred worker execution, public DB CLI, and downstream migration automation have approved designs, implementations, and validation evidence in a later release lane.
scope_refs: [epic-65, epic-66, epic-67, task-310, task-311, task-312, task-313, task-314, task-315, test-122, test-123, test-124]
active_node: task-310
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: []
max_iterations: 25
blocked_after_attempts: 3
tags: [goal, deferred, roadmap, post-0-3-0]
owners: []
links: []
artifacts: []
relates: [epic-65, epic-66, epic-67]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Objective

Track safe-to-defer work after `0.3.0`: public worker execution, public
event/reducer/lease/materializer DB CLI surfaces, and downstream migration
automation. This goal is intentionally paused until `goal-10` completes and
`0.3.0` publish readiness is closed.

# End Condition

- Public worker execution has a design-approved boundary, secrets policy,
  operator approval model, implementation, and no-secret runtime contract.
- Public DB event/reducer/lease/materializer CLI surfaces have a design-approved
  taxonomy, implementation, and compatibility contract.
- Downstream migration automation has a dry-run-first design, implementation,
  and no-cross-repo-mutation contract.

# Non-Goals

- No deferred functional implementation happens as part of `goal-10`.
- No worker execution is added to `0.3.0`.
- No public event/reducer/lease/materializer CLI is added to `0.3.0`.

# Recursive Algorithm

Resume only after `goal-10` has achieved publish readiness.

# Required Skills

- `pursue-mdkg-goal`
- `verify-close-and-checkpoint`

# Required Checks

- To be defined by each design task before implementation begins.

# Acceptance Criteria

- `goal-10` is done before this goal is resumed.
- Design tasks approve boundaries before implementation tasks begin.
- Tests cover no-secret runtime behavior, internal helper compatibility, and
  no-cross-repo-mutation automation behavior.

# Definition Of Done

- Deferred roadmap is implemented in a later release lane.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Paused. This is a roadmap holding area for work explicitly deferred from
`0.3.0`. As of 2026-06-09 it is consolidated under `goal-13`; it remains paused
until the hardening train explicitly resumes worker execution, public DB CLI,
or downstream migration automation work.

# Iteration Log

- No iterations recorded yet.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Deferred; no functional work is part of the 0.3.0 polish pass.
