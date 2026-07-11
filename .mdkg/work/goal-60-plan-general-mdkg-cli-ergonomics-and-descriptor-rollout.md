---
id: goal-60
type: goal
title: Plan general mdkg CLI ergonomics and descriptor rollout
status: todo
priority: 2
goal_state: paused
goal_condition: General mdkg CLI ergonomics and descriptor rollout are decision-complete only after loop UX descriptor pilot results are reviewed, generic status/next/evaluate/handoff/readiness semantics are aligned across node families, and a conservative descriptor migration order is accepted.
scope_refs: []
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js goal show goal-60 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [cli, ux, descriptor, planning, followup]
owners: []
links: []
artifacts: []
relates: [goal-59]
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, prop-4, prop-5, spike-31, task-691, task-692, task-728, test-366, test-399]
context_refs: [goal-59, edd-69, dec-66, prop-4, prop-5, spike-31, task-691, task-692, task-728, test-366, test-399]
evidence_refs: []
aliases: [general-cli-ergonomics-descriptor-rollout]
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Objective

Plan the general mdkg CLI ergonomics and typed descriptor rollout after the
focused loop UX descriptor pilot has produced implementation evidence.

# End Condition

This planning goal is complete when mdkg has accepted design records for:

- generic `status`, `next`, `evaluate`, `handoff`, readiness, and closeout
  semantics across goals, loops, work nodes, tasks, checkpoints, and future
  workflow nodes;
- whether generic commands should eventually replace or complement per-node
  command families;
- descriptor rollout order beyond `loop`, including higher-risk command
  families such as `work`, `db queue`, `subgraph`, `pack`, and `git`;
- command contract/help generation migration policy;
- a later implementation goal, or an explicit decision to defer.

# Non-Goals

- Do not implement CLI source changes in this planning goal.
- Do not block `goal-59`.
- Do not widen `goal-59` into a generic CLI redesign.
- Do not change command public behavior without a later implementation goal.

# Recursive Algorithm

1. Wait for `goal-59` implementation evidence or explicit operator activation.
2. Review loop descriptor pilot outcomes, `prop-4`, `task-691`, `task-692`,
   and `test-366`.
3. Draft or update EDD/DEC nodes for generic command ergonomics.
4. Create scoped implementation follow-up only after decisions are accepted.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal show goal-60 --json`
- `git diff --check`

# Acceptance Criteria

- Goal remains `todo` and `goal_state: paused` until the operator explicitly
  activates it.
- Planning starts from `goal-59` results, not from pre-pilot assumptions.
- The accepted plan distinguishes generic command UX from loop-specific command
  needs.
- Risky command families have a conservative migration order and compatibility
  policy before implementation is proposed.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- `goal-59` is still unresolved and no operator has requested parallel planning.
- The planning starts prescribing source edits before command-surface decisions
  are accepted.
- The scope starts mixing in unrelated provider/runtime/indexing work.

# Current State

Queued follow-up only. This goal is intentionally not active so the immediate
implementation lane remains focused on loop UX and the loop-family descriptor
pilot.

The v0.5.0 backend/API/CLI dogfood added `spike-31`, `prop-5`, `task-728`, and
`test-399` as concrete planning inputs. They recommend incremental loop-owned
module decomposition before any generic descriptor rollout; they are not part
of the v0.5.0 release-candidate scope.

# Iteration Log

- 2026-07-06: Created as the broader CLI planning follow-up linked from
  `goal-59`.
- 2026-07-10: Added the v0.5.0 backend/API/CLI dogfood decomposition proposal
  and compatibility contract as future planning inputs.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
