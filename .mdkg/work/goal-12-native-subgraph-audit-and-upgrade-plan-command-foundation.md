---
id: goal-12
type: goal
title: native subgraph audit and upgrade-plan command foundation
status: archived
priority: 2
goal_state: archived
goal_condition: Complete when mdkg has designed and implemented native subgraph audit, upgrade-plan, capability-sync summary, strict validation, and receipt-backed refresh command foundations with no-cross-repo-mutation safety and tests.
scope_refs: [epic-68, task-316, task-317, task-318, task-319, task-320, task-321, test-125, test-126, test-127, test-128]
active_node: task-316
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: []
max_iterations: 18
blocked_after_attempts: 3
tags: [goal, subgraph, audit, upgrade-plan, post-0-3-0]
owners: []
links: []
artifacts: []
relates: [epic-68, goal-10, goal-11, edd-16, dec-29, goal-18]
blocked_by: []
blocks: []
refs: [edd-16, dec-29]
aliases: [native-subgraph-operations, subgraph-audit-upgrade-plan, subgraph-refresh-receipts]
skills: []
created: 2026-06-07
updated: 2026-06-16
---
# Objective

Create the post-0.3.0 product lane for native subgraph operations so downstream
orchestrator repositories do not need bespoke shell audit logic.

# End Condition

- Native subgraph audit command behavior is implemented and tested.
- Native upgrade-plan command behavior is implemented and tested.
- Capability sync summaries are implemented without leaking private content.
- Strict validation modes cover stale bundles, dirty source paths, source HEAD
  drift, and accepted-SHA requirements.
- Refresh receipt helpers preserve repo-owned child commit boundaries.

# Non-Goals

- Not part of the 0.3.0 publish-readiness lane.
- No downstream repo mutation.
- No child repo commit or push automation.
- No automatic bundle refresh without accepted evidence.

# Recursive Algorithm

Resume after `goal-10` closes the 0.3.0 publish-readiness lane.

# Required Skills

- `pursue-mdkg-goal`
- `verify-close-and-checkpoint`

# Required Checks

To be defined by `task-316` through `task-321` before implementation begins.

# Acceptance Criteria

- Command designs encode no-cross-repo-mutation defaults.
- CLI JSON contracts are deterministic and scriptable.
- Tests cover positive and negative subgraph states.
- Downstream adoption guidance is updated.

# Definition Of Done

Deferred until this paused goal is resumed and implemented.

# Stop Conditions

- 0.3.0 publish-readiness work is not closed.
- Command design would mutate child repos by default.
- Visibility or receipt semantics are underspecified.

# Current State

Paused. Root downstream orchestration has a need for native subgraph audit and
upgrade planning commands. As of 2026-06-09 this lane is consolidated under
`goal-13`, with `task-329` as the hardening-train bridge. Existing
`subgraph sync` and `subgraph materialize` are to be audited and hardened, not
reintroduced as new surfaces.

# Iteration Log

- No iterations recorded yet.

# Skill Improvement Candidates

- A future `subgraph-ops` authoring skill could package audit and refresh
  evidence after the command surface stabilizes.

# Completion Evidence

Pending.

# Supersession Note

This paused historical roadmap goal is superseded by `goal-18`, which owns graph clone, fork, template import, and related subgraph safety work. It should be marked archived during `goal-16` only after archived goal lifecycle support is implemented.
