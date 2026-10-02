---
id: goal-88
type: goal
title: Minimal init with preserved configurable skill mirrors
status: backlog
priority: 1
goal_state: paused
goal_condition: Fresh init generates only root AGENTS.md; reviewed legacy migration preserves custom instructions; canonical content and both native plus configured additional skill mirrors pass installed local acceptance and exact-candidate prepublication gates.
scope_refs: [task-844, task-845, task-846, test-494, task-847]
active_node: task-844
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
The planning PR originally required review/merge before implementation.
Nick's 2026-10-02 sequential cloud-stack instruction supersedes that gate and
expressly authorizes this implementation from the unmerged planning branch,
with the narrow cloud exception to local git-gud. Only Goal88 runs in this turn;
commit/push and one stacked draft PR are authorized on its new branch. No human
merge or publication authority is granted. Task844's named design choice remains
pending at chk672; no acceptance approval is invented.
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

Paused pending the named compatibility/removal decision; task844 is claimed
and in review. Selected-goal state remains none. Chk672 records the actual
baseline audit/proposal, with approval pending. Feature tasks, test494 and
chk673/chk674 remain unmet. Chk681 is historical planning evidence only.

# Iteration Log

- 2026-10-02: Cloud planning proposal authored from verified remote main.
- 2026-10-02: New authorized cloud branch from verified plan head ddafe083;
  task844 baseline audit/proposal prepared at chk672. 219 focused cases passed;
  source-built audit found nested/case target admission gaps. Design choice
  requested; no feature/code/version change or Goal89 continuation.

# Skill Improvement Candidates

None implemented. Revisit only under an explicitly owned maintenance task.

# Completion Evidence

Implementation/prepublication NOT_RUN; Goal88 remains NOT_READY. Actual task844
evidence is at chk672 and docs/cloud-goal88-experiment.md. Planning passes are
not inherited as future installed-artifact acceptance.

# Required Checks

Run the required_checks commands plus the goal-specific installed acceptance and final package ladder under the later scoped execution. Planning validation does not satisfy these checks.

# Stop Conditions

Stop for writer/identity collisions, unowned paths, failed or stale evidence, unmet predecessor, missing local/platform/security qualification or authority outside the accepted scope.
