---
id: goal-88
type: goal
title: Minimal init with preserved configurable skill mirrors
status: backlog
priority: 1
goal_state: paused
goal_condition: Fresh init generates only root AGENTS.md; reviewed legacy migration preserves custom instructions; canonical content and both native plus configured additional skill mirrors pass installed local acceptance and exact-candidate prepublication gates.
scope_refs: [task-844, task-845, task-846, test-494, task-847]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node dist/cli.js skill validate --json, node dist/cli.js validate --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [cloud-planning, design-only, planned-0.6.1]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [edd-83, goal-81, goal-41, edd-80, edd-56, dec-52, dec-93, chk-681, chk-672, chk-673, chk-674]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Objective

Increment goal-81 and goal-41; do not redo delivered compact startup or configurable mirrors. Resolve generated root CLAUDE and unnecessary legacy root instruction artifacts with provenance-aware migration.

# End Condition

Fresh init generates only root AGENTS.md; reviewed legacy migration preserves custom instructions; canonical content and both native plus configured additional skill mirrors pass installed local acceptance and exact-candidate prepublication gates. Planning metadata target: 0.6.1, provisional until rechecked.
The complete contract and decisions are in edd-83; source version stays
0.6.0 in this PR. This goal stops at a readiness decision, before publication.

# Acceptance Criteria

Execute only these bounded nodes, in order: task-844, chk-672, task-845, task-846, test-494, chk-673, task-847, chk-674.
test-494 defines feature-specific tests; task-847
owns final-byte evidence and retained qualification gaps.

# Dependencies and Execution Authority

First goal in the three-release sequence.
Nick must review/merge this planning PR before implementation, then explicitly
Run the scoped goal. The cloud-only git-gud waiver does not apply to execution.
Reconcile unpublished Mac/concurrent branch changes without copying or overwrite.
One writer per checkout; implementations proceed sequentially.

# Non-Goals

No implementation in this PR, other release-goal execution, merge queue/permanent
ID integration, implicit federation, company data, graph migration, bundle refresh,
history rewrite, publication/tag/deploy, production/credential changes or
professional adoption. Later execution must explicitly scope any needed Git actions.

# Recursive Algorithm

Review design task/checkpoint, complete bounded feature tasks, qualify installed
acceptance, record the local checkpoint, freeze/requalify the candidate and
record the final readiness checkpoint. Stop on unknown custody, unsafe paths,
stale inputs, collision, unmet predecessor or unavailable required qualification.

# Required Skills

Use select-work-and-ground-context, service-boundary-ownership-check and
verify-close-and-checkpoint. Run feature cases, full pre-merge tests, relevant
integration and the existing package prepublication ladder under later scope.
Preserve CI/platform gaps rather than treating fast CI as complete qualification.

# Definition Of Done

Both feature acceptance and the exact-candidate readiness decision have evidence.
Missing required local/platform/security/artifact proof means NOT_READY, not done.
Nick separately approves publication and adoption; readiness grants neither.

# Current State

Backlog, paused, unclaimed; no active node. All future implementation tests and
checkpoints are NOT_RUN. chk-681 records docs-only evidence.

# Iteration Log

- 2026-10-02: Cloud planning proposal authored from verified remote main.

# Skill Improvement Candidates

None implemented. Revisit only under an explicitly owned maintenance task.

# Completion Evidence

NOT_RUN for implementation and prepublication. Planning receipt is context only.

# Required Checks

Run the required_checks commands plus the goal-specific installed acceptance and final package ladder under the later scoped execution. Planning validation does not satisfy these checks.

# Stop Conditions

Stop for writer/identity collisions, unowned paths, failed or stale evidence, unmet predecessor, missing local/platform/security qualification or authority outside the accepted scope.
