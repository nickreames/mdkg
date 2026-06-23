---
id: goal-1
type: goal
title: Build a one-shot agentic coding demo from mdkg context
status: todo
priority: 1
goal_state: active
goal_condition: A clean local demo artifact exists with evidence that an agent can start from this goal, inspect context, do one scoped implementation task, validate it, and close the work without deployment or private data.
scope_refs: [epic-1, spike-1, task-1, test-1]
active_node: spike-1
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [mdkg validate --json, mdkg index, mdkg search "agentic coding demo" --json, mdkg pack goal-1 --profile concise]
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

Create a small local-only demo that proves mdkg can act as the durable starting context for an agentic coding session.

# End Condition

The repo contains an inspectable local artifact, `test-1` has evidence, and a checkpoint records the command receipts, boundaries, and next recommended action.

# Non-Goals

- no live deploy
- no production promotion
- no secret, credential, raw prompt, or private payload storage
- no dependency on parent-repo private context

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
- `mdkg search "agentic coding demo" --json`
- `mdkg pack goal-1 --profile concise`

# Acceptance Criteria

- An agent can start with only `goal-1` and discover `spike-1`, `task-1`, `test-1`, `edd-3`, and `dec-1`.
- The demo artifact is local-only and inspectable.
- The closeout checkpoint states whether the demo should be discarded, repeated, or promoted to a separate preview goal.

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

- Consider a future demo-specific SKILL.md only after this graph is used in a live rehearsal.

# Completion Evidence

- Pending.
