---
id: goal-82
type: goal
title: Enable branch-safe graph identity and reviewed reconciliation
status: todo
priority: 1
goal_state: paused
goal_condition: A complete immutable identity and versioned graph slice supports ordinary offline branch-local nodes and reviewed ancestor-aware reconciliation with durable alias maps strict validation replay safety and legacy compatibility.
scope_refs: [task-363, task-819, task-820, task-821, task-822, test-151, test-475, test-476]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: []
max_iterations: 25
blocked_after_attempts: 3
tags: [alignment-002, planning-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [goal-81, epic-83]
blocked_by: []
blocks: []
refs: []
context_refs: [dec-93, edd-81, goal-17, goal-18, epic-83]
evidence_refs: [chk-563]
aliases: []
skills: []
created: 2026-09-05
updated: 2026-09-05
---

# Objective

Support separate developer branches/worktrees without confusing independent
node creation, same-node semantic conflicts, or checkout-local execution state.

# End Condition

All implementation and acceptance nodes in scope have evidence for edd-81.
The initial classifier increment alone is insufficient. Numeric aliases stay
usable while stable identities survive integration, replay and index rebuilds.

# Non-Goals

- Full writable federation, remote skill distribution or self-improvement automation.
- Distributed runtime scheduling/lease enforcement or private orchestration policy.
- Canonical graph migration, Demo repair, Git integration/history operations,
  cross-repository mutation, release, provider or deployment action.

# Recursive Algorithm

1. Re-inventory and obtain bounded implementation authority; keep main's current
   single-writer workflow available.
2. Complete task-819 classifier safety, then task-820 format/identity/migration.
3. Complete task-821 command parity, then task-822 reviewed reconciliation.
4. Verify test-151, test-475 and test-476 using disposable local fixtures.
5. Record evidence and evaluate the full condition; repository adoption is a
   separate migration gate, not automatic goal execution.

# Required Skills

- select-work-and-ground-context; service-boundary-ownership-check.
- verify-close-and-checkpoint; no new skill is proposed.

# Required Checks

Future gates: focused fix/new/graph/goal/loop/MCP/index tests, JSON/SQLite parity,
npm run build, npm run test, npm run cli:check, node dist/cli.js validate --json,
git diff --check. No network or publication is required for acceptance fixtures.

# Acceptance Criteria

- Different identities with one alias are remapped deterministically.
- Same-node edits use ancestry and explicit semantic conflict decisions.
- Stable identities and approved mappings live in authored data, not indexes.
- Ordinary staged/unstaged/untracked branch nodes remain command-usable.
- Preview is observational; apply binds reviewed inputs and never stages by default.
- Legacy migration is explicit and ancestry-grounded; unsupported writes fail.
- Repeat integration/cherry-pick/revert and immutable external receipts are safe.

# Definition Of Done

Scope evidence proves the complete identity slice, strict graph validation and
legacy compatibility. Actual canonical migrations remain approval-gated.

# Stop Conditions

Ambiguous provenance/references, missing accepted ancestor, baseline movement,
writer collision, incompatible formats, required history rewrite, or unowned paths.

# Current State

Paused, todo and unclaimed. task-363 owns planning only; implementation nodes
remain todo. No active_node or selected-goal change. epic-83 is reused as the
compatibility container, not a release or cross-project activation.

# Iteration Log

- 2026-09-05: approved alignment converted to an mdkg-only planning package.

# Skill Improvement Candidates

None. Conflict handling belongs in implementation/schema, not a procedural skill.

# Completion Evidence

Planning receipt: chk-563. Runtime implementation and acceptance evidence pending.
