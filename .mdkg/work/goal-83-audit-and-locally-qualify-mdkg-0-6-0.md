---
id: goal-83
type: goal
title: Audit and locally qualify mdkg 0.6.0
status: done
priority: 1
goal_state: achieved
goal_condition: Complete full audit and installed consumer qualification with all publication blockers independently verified and one exact draft 0.6.0 candidate sealed without publication.
scope_refs: [task-823, task-824, task-825, task-826, task-827, task-829, task-830, test-477, test-478, test-479, test-480, test-481, test-482, task-833, test-484, task-834, task-837, test-487]
last_active_node: task-833
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, git diff --check]
max_iterations: 75
blocked_after_attempts: 3
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/requirement-coverage.json, .mdkg/artifacts/goal-86/successor-package-gates-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-private-preview-20260930.json, .mdkg/artifacts/goal-86/local-closeout-20260930.json, .mdkg/artifacts/goal-86/closeout-commit-allowlist-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-74, goal-77, goal-78, goal-81, goal-82, goal-84, goal-85, dec-94, dec-95, edd-82, goal-86, dec-96, dec-100, epic-258, epic-257]
evidence_refs: [chk-608, chk-570]
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-30
---

# Final local acceptance - 2026-09-30

LOCAL_READY_NOT_PUBLISHED. Exact0.6.0 b5497c5f5e5f022e candidate
(545431 bytes,237 payload files) is sealed without repacking at source
b10870355b264355af2be4fc53bb4640851f747b. Task826/Bug7, Tasks828/829/830
have actual current acceptance, not inferred status-only clearance.

Full discovery:2389/2389 tests pass;92.63% lines,84.36% branches,97.58%
functions exceed unchanged89/77/96 floors. All37 package smokes pass. All20
retained installed families are accounted on native macOS ARM64 and Ubuntu24
ARM64-native/x86_64-emulated. Node24.18 operation plus actual unsupported24.15/26
refusal/discovery controls are explicit. No native x86_64 performance or Windows
qualification is claimed.

Fresh Standard plus complete independent remediation supplements and final17-path
remedy review support acceptance. Original partial reports and failed harness
attempts remain historical, never relabeled clear/pass. Twelve of14 historical
findings have in-scope verified remedies; Bugs46/47 remain deferred/unresolved
under Goal87. No blocked historical context was accessed. This is not a claim
that no undiscovered bugs exist.

Private installed migration preview refuses task309's surviving mdkg://goal-10
ambiguity; no identity was invented and no canonical migration applied. The
current26-row ledger records exact dispositions. Website/Epic258, hosted/Epic257,
Windows and consumer adoption remain deferred/unverified, not passes.

Selected achieved Goal73, runtime DB, Demo3 bundle and public draft hashes are
unchanged. Four reviewed source/qualification commits are bound in the seal;
the final explicit-path evidence commit follows validated closure. Derived
.mdkg/index/mdkg.sqlite remains locally owned and excluded, not restored/staged.
Seven exact owned Docker containers/volumes were removed after verified diagnostics
were retained; images/unrelated resources were preserved.

Goal85 stays paused pending fresh publication approval and independent blocker,
input and exact-artifact rechecks. No remote Git, push, tag, publication, provider,
deployment, bundle refresh, history rewrite or root/sibling mutation occurred.
Skill coverage: pursue-mdkg-goal and verify-close-and-checkpoint; candidates:none.

# Historical acceptance contracts and intermediate evidence


# Current accepted package closeout contract - 2026-09-28 Dec100

Preserve earned audit/extraction milestones. Goal86 is the sole execution lane; this paused predecessor closes only when shared package obligations have evidence.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

Goal86 is the sole future execution lane; preserve this goal's original
acceptance duties and earned milestones. Dec96 adds fresh Standard and macOS/Linux
gates. Paused routing is not failure or completion; historical active work is
retained as last_active_node, not a standing claim. Only a later explicit Run of
Goal86 authorizes remaining implementation. Goal85 publication remains separate.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Objective

Latest alignment: dec-95 requires complete Git mutation-wrapper and consumer-
specific capability removal in0.6.0, with no compatibility adapters. Task833
captures source-bound extraction context before bugs36/37; test484 and task828
verify. Native Git owns individual-project worktrees and ancestry-preserving
reviewed merges; task826/test478 prove full source-plus-graph integration.
Edd82 classifies retained generic contracts versus consumer exports. Performance
transaction redesign is a later proposal, not an extra release dependency.
This planning pass preserves paused goal state and does not start implementation.

Complete full audit and installed consumer qualification with all publication blockers independently verified and one exact draft 0.6.0 candidate sealed without publication.

# End Condition

task-823 through task-830 as scoped here and test-477 through test-482 have complete proof; task-828 is verified; chk-570 binds the sealed candidate. Final disposition LOCAL_READY_NOT_PUBLISHED, otherwise NOT_READY with exact gaps.

# Non-Goals

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Recursive Algorithm

1. Re-inventory and bind the committed Goal 82 unit plus actual published 0.5.2 provenance.
2. Complete behavioral and Standard security coverage; route every confirmed blocker to goal-84.
3. Execute bounded fixes under goal-84 and installed consumer families under this goal.
4. Prepare draft 0.6.0 metadata and complete release/migration guidance.
5. Freeze fixes for independent security diff review, then run the entire unchanged-threshold release ladder.
6. Commit reviewed local units, seal exact package inputs and artifact, and complete chk-570 only with full proof.
7. Leave goal-85 paused for separately authorized publication.

# Required Skills

Reuse select-work-and-ground-context, pursue-mdkg-goal and verify-close-and-checkpoint. Codex Security Standard and later diff workflows are plugin-owned capabilities, not new public mdkg skills. Future publication uses release-mdkg-package only after fresh approval.

# Required Checks

Full tests and manifest-backed ladder; coverage floors 89/77/96 unchanged; CLI/docs/skill/package parity; all six installed fixture families; source and artifact provenance; graph full/changed-only, SQLite and diff checks. Node 24.15.0, available supported 24 and Node 26 exact versions. Missing proof is a blocker, not a waiver.

# Acceptance Criteria

- Preserve compact default init, graph-only/--agent compatibility, explicit v2 adoption, stable identities with numeric aliases and reviewed reconciliation.
- Use actual 0.5.2 upgrade, offline branch cross-links, semantic conflicts, replay/revert, recovery, ownership, legacy/old-client, clone/fork, archive/work, packs/MCP, large graph and complete lifecycle routing fixtures.
- Review source and package delta separately from demo/history-only evidence.
- Keep source reviewers read-only and freeze each exact reviewed snapshot.
- Keep private canonical graph rehearsal private and report unsupported historical evidence without inventing identity.
- Bind each blocker to regression and independent verification; do not silently waive missing coverage.
- Seal one immutable artifact; any package-input change invalidates qualification.

# Definition Of Done

The end condition is supported by exact artifacts and checks, not just report-only goal evaluation. The user has explicitly authorized this complete local plan; do not ask for duplicate implementation approval.

# Stop Conditions

Unknown dirty ownership, writer collision, baseline movement, global configuration changes, materially new decisions or excluded actions. Publication remains a distinct gate.

# Current State

2026-09-17: Goal86 is the sole active execution lane. Known implementation
prerequisites through Tasks835/836 and draft release preparation Task827 are
locally verified. Package metadata is0.6.0, explicitly draft/unpublished;1,628
source tests pass. Final installed macOS/Linux qualification, fresh Standard,
independent remediation diff, full ladder and exact seal remain incomplete.
Goal83 is not achieved, and Goal85 remains paused. Broader docs polish is later.
See Goal86 and its current receipts; historical entries below are not run gates.

2026-09-11 alignment: Nick accepted the four recommendations in dec-94.
The prior unanswered-policy/protected-helper blockers are resolved; none of
the corresponding fixes is cleared by acceptance alone. Finish existing work
under the approved local qualification scope, with linked-worktree scenarios
now explicit in task826/test478. Current request pauses source execution for
mdkg-node alignment and a worktree review; no canonical branch/worktree change.
Chk603 records remaining integration/topology questions. Older baseline and
unanswered-policy narratives below are historical evidence, not current gates.

Planning complete at creation; user-approved local execution may resume after planning validation. Canonical main is 9d7e0d3fdbcfbc3908b7d3983b4957f15d17cb2b, two ahead of cached origin/main; no remote verification. Only pre-existing dirty SQLite projection was accepted before these isolated planning nodes. Selection is achieved Goal 73. Runtime leases released, queues empty; obsolete worktree metadata remains untouched.

# Iteration Log

- 2026-09-07: User-approved full qualification plan recorded. Frozen Standard source audit is sealed in chk-571; its findings are not remediated yet.

# Skill Improvement Candidates

None. Findings belong in source/regression contracts, not procedural skill creation.

# Completion Evidence

chk-571 records the initial security milestone. chk-570 remains incomplete until final qualification.

## 2026-09-08 Behavioral Audit Progress

Task-824 remains the owned active lane. A frozen installed candidate completed
34 primary/supplemental probes with zero final harness errors. Five defect
families are now bug-21 through bug-25 under Goal 84, with test-483 verification
and explicit task-828 blockers. Passing controls include v2 observational reads,
complete v2 reinitialization, legacy formatting, unknown-version formatter
refusal and checkpoint dependency routing. Evidence is in
`.mdkg/artifacts/goal-83/task-824-behavioral-audit.json`.

This is partial behavioral evidence, not complete audit or release qualification.
Remaining work includes full contract trace, fixes, installed family/runtime
matrix, final independent security review, draft metadata, release ladder and
artifact seal. Bug-17's public materialization decision remains open; independent
audit work continues. Source snapshot, selected Goal 73, runtime DB and protected
Demo 3 bundle remain unchanged. New nodes and projections are owned uncommitted
planning/evidence; no source fix, commit, push or publication in this intake.

## 2026-09-09 Behavioral Audit Completion

Task-824's contract classification is complete with seven behavioral blockers
(bug-21 through bug-27) routed to Goal 84. The contract-audit artifact records
37 custom probes, 124 passing installed control tests, source hashes and explicit
coverage limitations. No final qualification is inferred. Continue bounded
Goal 84 remedies, full installed/runtime qualification, independent review,
draft release guidance, the full ladder and exact artifact seal. Bug-17 remains
blocked only on its public-materialization compatibility decision; other work
continues under the approved local-only contract.
