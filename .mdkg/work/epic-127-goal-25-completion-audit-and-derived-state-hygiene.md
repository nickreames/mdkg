---
id: epic-127
type: epic
title: goal-25 completion audit and derived-state hygiene
status: todo
priority: 1
tags: [mdkg-dev, goal-audit]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [chk-194]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Prove goal-25 completion and derived mdkg state with current evidence before any Browser testing begins.

# Scope

- Rebuild derived indexes.
- Verify graph validation, strict doctor output, selected-goal state, and goal-25 routing.
- Confirm goal-25 is `done` / `achieved` with `last_active_node: task-454`.
- Confirm task-445 through task-455, test-200 through test-206, and chk-186 through chk-194 exist with coherent evidence.
- Confirm demo subgraph freshness is clean or explicitly documented as accepted snapshot policy.

# Milestones

- `task-456` closes the scope and dirty-tree boundary.
- `task-457` closes the goal-25 completion audit.
- `test-207` records the no-actionable-work contract.

# Out of Scope

- Functional mdkg-dev remediation.
- Public launch, deploy, publish, tag, push, or global install.

# Risks

- Derived indexes can hide stale subgraph state if `mdkg index` is not rerun first.
- Context refs to completed work must not become actionable routing candidates.

# Links / Artifacts

- goal-25
- chk-194
