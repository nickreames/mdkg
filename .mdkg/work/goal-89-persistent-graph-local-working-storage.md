---
id: goal-89
type: goal
title: Persistent graph-local working storage
status: backlog
priority: 1
goal_state: paused
goal_condition: Graph-local persistent working artifacts remain separate from canonical nodes and exports; explicit promotion and scoped recoverable garbage collection protect active work and pass installed local acceptance and exact-candidate prepublication gates.
scope_refs: [task-848, task-849, task-850, test-495, task-851]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node dist/cli.js skill validate --json, node dist/cli.js validate --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [cloud-planning, design-only, planned-0.6.2]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [edd-83, goal-87, edd-63, dec-98, chk-681, chk-675, chk-676, chk-677, chk-674]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Objective

Replace improvisation after OS temporary files disappear with an explicit working-artifact lifecycle. No automatic cleanup and no false cloud durability guarantee.

# End Condition

Graph-local persistent working artifacts remain separate from canonical nodes and exports; explicit promotion and scoped recoverable garbage collection protect active work and pass installed local acceptance and exact-candidate prepublication gates. Planning metadata target: 0.6.2, provisional until rechecked.
The complete contract and decisions are in edd-83; source version stays
0.6.0 in this PR. This goal stops at a readiness decision, before publication.

# Acceptance Criteria

Execute only these bounded nodes, in order: task-848, chk-675, task-849, task-850, test-495, chk-676, task-851, chk-677.
test-495 defines feature-specific tests; task-851
owns final-byte evidence and retained qualification gaps.

# Dependencies and Execution Authority

Blocked until chk-674 has reviewed current readiness evidence.
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

## Current authorized implementation boundary — 2026-10-03

This section supersedes historical planning-only and mandatory-v2 execution gates
for this cloud experiment. Nick expressly authorized the sequential implementation
stack while PR10 stays unmerged, then accepted immediate use after fresh init and
an explicit safe path for existing legacy graphs. The parent reports independent
Goal88 ce53 correction review complete for the bounded prerequisite. No release
or merge authority follows. Contract: working-host-anchor-v1 in
docs/cloud-goal89-design.md and docs/cloud-goal89-contract-delta.md.

0.6.2 source now implements independent legacy host binding outside ignored
working, strict canonical v2 reuse, explicit preview/hash-bound apply, owned local
entries, owner/pin/selected-work guards, indefinite quarantine/recover/confirmed
purge, exact journal resume and sanitized private archive promotion. Custom bytes
remain preserved. No implicit node migration, automatic cleanup or store-based
host bootstrap. A pre-journal killed anchor/lock has no admissible journal and
refuses automatic takeover; unknown custody remains preserved.

Focused draft source/installed evidence is recorded at
.mdkg/artifacts/goal-89/implementation/checks.json after actual execution. Old
design/Goal88 receipts remain historical. This is a reviewable bounded draft,
not complete pre-merge/prepublication qualification. Chk675 exact current-patch
review, Chk676 owner/local acceptance and Chk677 release readiness remain pending;
Goal89 is not achieved and release is NOT_READY. Required full ladder, platform
and local owner checks are not silently waived. Parent review precedes Goal90.
Selected-goal state is unchanged; no new numeric IDs or approvals are allocated.
