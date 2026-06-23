---
id: goal-1
type: goal
title: Generate a candidate mdkg.dev website from a cloned graph
status: todo
priority: 1
goal_state: active
goal_condition: A local candidate website can be generated from the cloned graph, validated, and closed with evidence while production deploy, analytics, DNS, and promotion remain explicit later choices.
scope_refs: [epic-1, spike-1, task-1, test-1]
active_node: spike-1
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [mdkg validate --json, mdkg index, mdkg search "candidate website" --json, mdkg pack goal-1 --profile concise]
max_iterations: 25
blocked_after_attempts: 3
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [edd-3, dec-1]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Objective

Generate a disposable candidate mdkg.dev-style website from this cloned graph while keeping the canonical mdkg.dev site stable.

# End Condition

The candidate site is locally inspectable, the validation contract has evidence, and the closeout states whether it should be discarded, previewed, or promoted under a future explicit deployment goal.

# Non-Goals

- no production deploy
- no DNS changes
- no analytics activation
- no durable demo subdomain promotion
- no credentials or raw prompt transcripts

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- select-work-and-ground-context
- verify-close-and-checkpoint

# Required Checks

- `mdkg validate --json`
- `mdkg index`
- `mdkg search "candidate website" --json`
- `mdkg pack goal-1 --profile concise`

# Acceptance Criteria

- An agent can start with only `goal-1` and discover the spike, task, test, design, and decision context.
- The graph is clone/fork friendly and does not depend on private parent-repo state.
- The preview/promotion decision is evidence-based and deferred until after local validation.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Seed graph only. The active node is `spike-1`.

# Iteration Log

- 2026-06-22: Graph seeded from the parent mdkg.dev launch-readiness goal.

# Skill Improvement Candidates

- Consider a future website-generation SKILL.md after a successful rehearsal.

# Completion Evidence

- Pending.
