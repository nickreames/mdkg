---
id: goal-84
type: goal
title: Resolve mdkg 0.6.0 publication blockers
status: progress
priority: 1
goal_state: active
goal_condition: Every validated publication blocker is fixed with regression evidence affected-version assessment and independent security diff verification; no automatic risk waiver.
scope_refs: [bug-5, bug-6, bug-7, bug-8, bug-9, bug-10, bug-11, bug-12, bug-13, bug-14, bug-15, bug-16, bug-17, bug-18, bug-19, bug-20, task-828]
active_node: bug-5
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, git diff --check]
max_iterations: 75
blocked_after_attempts: 3
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-74, goal-77, goal-78, goal-81, goal-82, goal-83, goal-85]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-08
---

# Objective

Every validated publication blocker is fixed with regression evidence affected-version assessment and independent security diff verification; no automatic risk waiver.

# End Condition

All scoped bugs are done only with verified fixes; task-828 binds a separate security diff review of the exact fix range. Unresolved coverage or product/security decisions remain blockers.

# Non-Goals

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Recursive Algorithm

1. Deduplicate findings against existing achieved work without reopening it.
2. Claim one owned bug, reproduce safely, implement the minimum complete correction and verify the regression.
3. Record severity/impact, source, affected-version assessment, acceptance and evidence for each bug.
4. Treat additional validated data-loss, security, compatibility, install/upgrade, gate, provenance or materially false-doc defects as blockers; create bounded linked work only when evidenced.
5. Freeze the complete fix range for separate independent Codex Security diff review and task-828 verification.
6. Keep incomplete findings open; never trade a green goal state for missing proof.

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

Planning complete at creation; user-approved local execution may resume after planning validation. Canonical main is 9d7e0d3fdbcfbc3908b7d3983b4957f15d17cb2b, two ahead of cached origin/main; no remote verification. Only pre-existing dirty SQLite projection was accepted before these isolated planning nodes. Selection is achieved Goal 73. Runtime leases released, queues empty; obsolete worktree metadata remains untouched.

# Iteration Log

- 2026-09-07: User-approved full qualification plan recorded. Frozen Standard source audit is sealed in chk-571; its findings are not remediated yet.

# Skill Improvement Candidates

None. Findings belong in source/regression contracts, not procedural skill creation.

# Completion Evidence

Pending full end-condition evidence.

## 2026-09-07 Continuation Boundary

Local commits 417b1ee1ecd14b26badb3781f8f4b130f011b944 and
d9d1f46b0735543d0a8b885c56a4be87a24bc599 close bug-11 workspace containment
and bug-20 pack output containment with sanitized verification artifacts.
Final source suite: 876 tests plus 26 contract checks, zero failures/skips.
The current Standard scan remains sealed; this pass used independent bounded
prepatch/candidate reviews, not a repeated repository scan. Six of thirteen
current security findings are locally fixed; seven remain, plus bugs 5–7 and
all independent final qualification gates. Nothing is published or pushed.

Pause at the new event-history compatibility decision in bug-13 rather than
silently inventing a history-size contract. Nick has been asked whether bounded
streaming may fail closed on oversized logs. No event source was changed.
Read-only template-schema investigation is complete; bug-18 implementation has
not started. Existing source/validation authority remains as approved once the
decision is resolved; publication and excluded external actions remain separate.

Goal 73 selection, runtime DB and protected Demo 3 bundle bytes are unchanged.
No runtime writer lease was acquired; transient mutation locks are released.
The pre-existing tracked SQLite index remains owned, uncommitted generated
state, not part of the two fix commits. Extended ACL/ownership metadata for
atomic exports is unqualified and must be covered by the still-open final
platform/security verification; no release waiver is implied.

## 2026-09-08 Event Compatibility and Remediation

Nick accepted configurable bounded streaming with explicit limit errors,
preserved event bytes and no automatic rotation/deletion. The prior pause is
resolved. Bug-13 now has 70 focused, 39 installed and 898 full passing tests
plus 26 release/security-contract checks, documented defaults/ceilings and
independent candidate review. Seven of thirteen security findings are locally
fixed; six remain, plus bugs 5–7 and final qualification gates. Continue owned
independent work; do not infer that the whole goal is blocked by the resolved
event decision. Selected Goal 73, runtime DB and protected bundle hashes remain
unchanged. SQLite stays accepted uncommitted generated custody.

## 2026-09-08 Template Boundary Verification

Bug-18 is locally verified with 92 focused, 55 installed and 924 full tests
plus 26 contract checks. Eight of thirteen security findings now have local
fixes; bug-10, bug-12, bug-15, bug-16 and bug-17 remain, alongside bugs 5–7 and
final qualification. The independent bug-10 prepatch investigation is complete;
its source and evidence implementation has not started. No new Nick decision
is required to continue authorized local scope. Publication remains blocked.

## 2026-09-08 Subgraph Boundary Verification

Bug-10 is locally verified: 16 focused and 33 installed tests, full source suite
and 26 contract checks pass, with CLI/docs/graph/diff parity. The full suite
caught and the implementation corrected cached-body deletion compatibility;
the existing test was preserved. Nine of thirteen security findings now have
local fixes. Bugs 12, 15, 16 and 17 remain, alongside bugs 5–7 and final gates.
Archive bug-12 independent prepatch investigation is complete; implementation
has not started. Continue authorized local work; no new Nick decision required.
Protected selection/runtime/bundle bytes and generated SQLite custody remain.

## 2026-09-08 Archive Boundary Verification

Bug-12 is locally verified: 25 focused, 48 installed, 964 full source tests and
26 contract checks pass; CLI/docs/graph/diff gates pass. Ten of thirteen security
findings now have local fixes. Remaining security nodes are bugs 15, 16 and 17;
bugs 5–7 and final qualification gates remain open. Skill resource source-boundary
investigation is underway read-only, without skill authoring or mirror changes.
No new Nick decision is required for continuing the approved local scope.
Publication remains blocked; protected states and SQLite custody are unchanged.

## 2026-09-08 Workspace Export Ownership Verification

Bug-16 is locally verified: 49 focused, 100 installed, 990 full source tests and
26 contract checks pass. CLI/docs/graph/diff gates pass. All three independent
candidate-review gaps were reproduced and corrected. Eleven of thirteen security
findings have local fixes; bug-15 awaits the skill-resource size-limit decision
and bug-17 is under read-only investigation. Bugs 5–7 and final qualification
remain open. Continue independent authorized work, not publication. Selected
Goal 73, runtime DB, protected bundles and generated SQLite custody are preserved.

## 2026-09-08 SQLite Fingerprint Verification

Bug-5 is locally verified: seven focused and 26 installed cases, 997 full source
tests and 26 contract checks pass. Fingerprints remain stable as age warnings
change, while actual source changes invalidate them and authored timestamp-named
fields survive SQLite storage. Receipt: .mdkg/artifacts/goal-84/bug-5-verification.json.
Eleven security findings remain locally fixed; bug-15 awaits resource-size policy
and bug-17 awaits public DB-payload policy. Continue bugs 6–7 and independent
qualification work. Protected state and local-only boundaries are unchanged.
