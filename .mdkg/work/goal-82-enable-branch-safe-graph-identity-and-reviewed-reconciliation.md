---
id: goal-82
type: goal
title: Enable branch-safe graph identity and reviewed reconciliation
status: done
priority: 1
goal_state: achieved
goal_condition: A complete immutable identity and versioned graph slice supports ordinary offline branch-local nodes and reviewed ancestor-aware reconciliation with durable alias maps strict validation replay safety and legacy compatibility.
scope_refs: [task-363, task-819, task-820, task-821, task-822, test-151, test-475, test-476]
last_active_node: test-476
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [goal-81, epic-83]
blocked_by: []
blocks: []
refs: []
context_refs: [dec-93, edd-81, goal-17, goal-18, epic-83]
evidence_refs: [chk-563, chk-565, chk-566, chk-567, chk-568, chk-569]
aliases: []
skills: []
created: 2026-09-05
updated: 2026-09-06
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

1. Honor the user's explicit Goal 82 Run instruction, re-inventory custody and
   keep main's current single-writer workflow available.
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

Execution authorized by the user's explicit instruction to continue Goal 82 on
2026-09-06. The earlier planning-only labels describe the pre-run state and do
not require repeated implementation approval. task-363 remains completed planning
evidence; implementation proceeds one owned work item at a time. Preserve selected
Goal 73. epic-83 is a compatibility container, not release authority.

Goal: deliver the complete identity and reconciliation slice described above.
Context: clean local main at 8f69773b653fd3fb409c4b473e4d39e288ee6e21,
one ahead of cached origin/main; no live remote verification. No mutation lock,
active runtime writer lease, queue or message at intake. Three inherited bundle
age warnings and the documented volatile SQLite fingerprint issue are preserved.
Boundaries: source-owned generic graph/parser/command/schema behavior, compatible
CLI/reference output, disposable local Git fixtures, tests, and owned mdkg work,
design, evidence/events/index projections. No consumer/root/sibling changes,
canonical graph migration, actual repository Git integration, staging, commit,
push, remote access, bundle/subgraph refresh, release or provider/deployment work.
Done when: every scoped implementation and verification contract has passing
case-level proof and goal evaluation supports the full condition, not just the
first classifier increment. Evidence: edd-81, task-819..822, test-151/475/476 and
new bounded milestone receipts. Owner: mdkg-project-agent, one writer, using
supported goal/task ownership and transient mutation locks, not an invented CLI
lease or a newly initialized database.

# Iteration Log

- 2026-09-05: approved alignment converted to an mdkg-only planning package.
- 2026-09-06: explicit user Run accepted; begin task-819 after clean custody audit.
- 2026-09-06: task-819 classifier safety and explicit staging boundary verified in
  chk-565; proceed to task-820. This is not the full Goal 82 completion condition.

- 2026-09-06: task-820 foundation verified in chk-566 (713+26 tests). Continue
  task-821 command parity and task-822 semantic reconciliation; goal remains open.
- 2026-09-06: task-821 command compatibility verified in chk-567 (732+26 tests),
  including JSON/SQLite command-state and read-only identity-variant inspection.
  Continue task-822 and final acceptance; no canonical migration or Git action.
- 2026-09-06: task-822 reviewed reconciliation complete in chk-568. Final source
  aggregate passed 755 TypeScript plus 26 public-release/security tests. Proceed
  through test-151/test-475/test-476 acceptance; the goal remains open until their
  case-level evidence and final evaluation are complete.

# Skill Improvement Candidates

None. Conflict handling belongs in implementation/schema, not a procedural skill.

# Completion Evidence

Planning receipt: chk-563. Implementation: chk-565 through chk-568.
Goal-level acceptance is complete in test-151 (35 focused tests), test-475 (52)
and test-476 (48), with case-level proof and fixture fingerprints. chk-569 binds
the final 755+26 aggregate, source/docs/graph checks and authority-separated
closeout. The full bounded end condition is satisfied locally; canonical graph
migration/adoption, Git commit/push, bundle refresh and release remain separate.
Selected Goal 73 and protected runtime/bundle bytes remain unchanged. All Goal 82
changes remain unstaged/uncommitted on the existing main branch at 8f69773.
