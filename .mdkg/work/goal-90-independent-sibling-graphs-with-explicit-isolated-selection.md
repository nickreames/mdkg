---
id: goal-90
type: goal
title: Independent sibling graphs with explicit isolated selection
status: backlog
priority: 1
goal_state: paused
goal_condition: Explicit selection isolates independent sibling graphs across every command and storage surface; synthetic tracked-team and ignored-private fixtures prove no cross-graph access disclosure or publication and exact-candidate prepublication gates are satisfied.
scope_refs: [task-852, task-853, task-854, test-496, task-855]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node dist/cli.js skill validate --json, node dist/cli.js validate --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [cloud-planning, design-only, planned-0.6.3]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [edd-83, goal-82, edd-81, dec-94, chk-681, chk-678, chk-679, chk-680, chk-677]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Objective

Keep .mdkg default while selecting independent siblings explicitly; reuse graph identity, avoid implicit federation and keep large private graphs out of team operations.

# End Condition

Explicit selection isolates independent sibling graphs across every command and storage surface; synthetic tracked-team and ignored-private fixtures prove no cross-graph access disclosure or publication and exact-candidate prepublication gates are satisfied. Planning metadata target: 0.6.3, provisional until rechecked.
The complete contract and decisions are in edd-83; source version stays
0.6.0 in this PR. This goal stops at a readiness decision, before publication.

# Acceptance Criteria

Execute only these bounded nodes, in order: task-852, chk-678, task-853, task-854, test-496, chk-679, task-855, chk-680.
test-496 defines feature-specific tests; task-855
owns final-byte evidence and retained qualification gaps.

# Dependencies and Execution Authority

Blocked until chk-677 has reviewed current readiness evidence.
This prerequisite is enforced by the first scoped task, then the task chain;
checkpoints remain context, outside executable goal scope.
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
