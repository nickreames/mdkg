---
id: goal-53
type: goal
title: Plan project-memory query and CocoIndex integration
status: blocked
priority: 2
goal_state: paused
goal_condition: Project-memory query UX is decision-complete only after history, why, and next-work semantics are aligned with mdkg graph evidence, CocoIndex indexing and semantic-search options are grounded, command/API ownership is selected, privacy and raw-content boundaries are defined, and an implementation lane is created or explicitly rejected.
scope_refs: []
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, targeted CocoIndex grounding, targeted public naming and raw-content safety audit, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json]
max_iterations: 15
blocked_after_attempts: 3
tags: [project-memory, query-model, cocoindex, semantic-search, planning, follow-up]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-52, goal-51, task-650, test-338, edd-62, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Objective

Plan project-memory semantic queries separately from the `mdkg@0.4.2`
low-level `mdkg git` lifecycle lane.

# End Condition

This goal is achieved when mdkg has an accepted design for `history`, `why`,
and `next-work` query semantics, including whether CocoIndex is the indexing and
semantic-search layer and whether the public UX belongs in `mdkg memory ...`,
existing `goal`/`graph`/`pack`/`status` commands, MCP surfaces, or a hybrid.

# Non-Goals

- Do not implement query source code in this planning goal.
- Do not block `goal-52` Git remote lifecycle implementation.
- Do not store raw prompts, model outputs, provider payloads, queue bodies,
  credentials, or runtime state roots.
- Do not make downstream runtime policy part of mdkg public behavior.

# Recursive Algorithm

1. Ground current mdkg graph/search/pack/goal/MCP surfaces.
2. Ground CocoIndex capabilities and integration constraints.
3. Define `history`, `why`, and `next-work` query semantics and output safety.
4. Choose public command/API ownership.
5. Create a later implementation goal only after the design is accepted.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- targeted CocoIndex grounding
- targeted public naming and raw-content safety audit
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`

# Acceptance Criteria

- `history`, `why`, and `next-work` are defined with evidence sources,
  truncation behavior, and privacy boundaries.
- CocoIndex is either selected as the implementation direction or rejected with
  evidence.
- Command/API shape is selected without conflicting with `goal-52`.
- Follow-up implementation work is explicit and separately approval-gated.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Required context or product intent is missing.
- CocoIndex direction cannot be grounded sufficiently.

# Current State

Paused follow-up. `goal-52` owns `mdkg@0.4.2` low-level Git remote lifecycle
support; this goal owns later project-memory semantic query design.

# Completion Evidence

- Pending.
