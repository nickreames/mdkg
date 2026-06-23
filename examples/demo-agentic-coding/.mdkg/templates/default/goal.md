---
id: {{id}}
type: goal
title: {{title}}
status: {{status}}
priority: {{priority}}
goal_state: {{goal_state}}
goal_condition: {{goal_condition}}
scope_refs: []
active_node: {{active_node}}
last_active_node: {{last_active_node}}
required_skills: []
required_checks: []
max_iterations: {{max_iterations}}
blocked_after_attempts: {{blocked_after_attempts}}
epic: {{epic}}
parent: {{parent}}
prev: {{prev}}
next: {{next}}
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
created: {{created}}
updated: {{updated}}
---

# Objective

State the durable objective the agent should pursue.

# End Condition

Define the exact measurable condition that makes this goal achieved.

# Non-Goals

- Out-of-scope item

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- Skill slug

# Required Checks

- Command or verification gate

# Acceptance Criteria

- Criterion

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Record the current active node and any relevant state summary.

# Iteration Log

- No iterations recorded yet.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
