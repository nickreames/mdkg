---
id: goal-88
type: goal
title: Minimal init with preserved configurable skill mirrors
status: backlog
priority: 1
goal_state: paused
goal_condition: Fresh init generates only root AGENTS.md; reviewed legacy migration preserves custom instructions; canonical content and both native plus configured additional skill mirrors pass installed local acceptance and exact-candidate prepublication gates.
scope_refs: [task-844, task-845, task-846, test-494, task-847]
active_node: test-494
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
The complete contract and decisions are in edd-83; this implementation targets
unpublished0.6.1. This goal stops at a readiness decision, before publication.

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

No other release-goal execution, merge queue/permanent
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

Paused for independent review and qualification. Task844 is in review;
task845/846/test494/task847 are progress. Selected-goal state remains none.
Fresh-init and mirror changes are implemented with all existing legacy
instructions preserved. No removal policy is inferred. Chk672 design review,
complete test494 acceptance and chk673/chk674 remain unmet. Chk681 is historical.

# Iteration Log

- 2026-10-02: Cloud planning proposal authored from verified remote main.
- 2026-10-02: New authorized cloud branch from verified plan head ddafe083;
  task844 baseline audit/proposal prepared at chk672. 219 focused cases passed;
  source-built audit found nested/case target admission gaps. Design choice
  requested; no feature/code/version change or Goal89 continuation.

- 2026-10-02: Parent requested continued authorized Goal88 work. Implemented
  independent AGENTS-only generation and safe mirrors; preserved every existing
  CLAUDE file and existing startup compatibility behavior. No retirement policy
  or local/platform approval inferred. Candidate target0.6.1; checks in progress.

# Skill Improvement Candidates

None implemented. Revisit only under an explicitly owned maintenance task.

# Completion Evidence

Preservation-first implementation exists; qualification is in progress and
Goal88 remains NOT_READY. Actual historical audit is at chk672, with current
results in docs/cloud-goal88-experiment.md. Planning and baseline passes are not
inherited as final installed-artifact acceptance.

# Required Checks

Run the required_checks commands plus the goal-specific installed acceptance and final package ladder under the later scoped execution. Planning validation does not satisfy these checks.

# Stop Conditions

Stop for writer/identity collisions, unowned paths, failed or stale evidence, unmet predecessor, missing local/platform/security qualification or authority outside the accepted scope.

# Continued Cloud Qualification

Actual installed acceptance:18synthetic cases/51CLIinvocations passed on the
retained0.6.1 artifact, including real official0.6.0 upgrades and mirror/path
controls. Package definitions:37executed,36passed/1failed. The demo failure
reproduces with identical103semantic rows on pristine planning base and candidate;
its required gate remains failed. Full coverage/ladder, site/platform matrix
and independent local owner review remain unmet. No task/checkpoint is completed
or approved from these results. Goal88 staysNOT_READY; Goal89/90 not started.
See .mdkg/artifacts/goal-88/qualification-2/checks.json and CONTINUATION.md.
