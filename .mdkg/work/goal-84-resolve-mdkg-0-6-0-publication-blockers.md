---
id: goal-84
type: goal
title: Resolve mdkg 0.6.0 publication blockers
status: progress
priority: 1
goal_state: active
goal_condition: Every validated publication blocker is fixed with regression evidence affected-version assessment and independent security diff verification; no automatic risk waiver.
scope_refs: [bug-5, bug-6, bug-7, bug-8, bug-9, bug-10, bug-11, bug-12, bug-13, bug-14, bug-15, bug-16, bug-17, bug-18, bug-19, bug-20, bug-21, bug-22, bug-23, bug-24, bug-25, bug-26, bug-27, bug-28, bug-29, bug-30, bug-31, bug-32, test-483, task-828]
active_node: bug-7
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
updated: 2026-09-09
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

## 2026-09-09 Bootstrap Qualification Findings

Bug-24 is locally verified: 44 installed cases on each of Node 24.18.0 and
26.0.0, 1130 source tests plus 26 contract checks. Its verification artifact
binds exact inputs and preserved states; final task-828 acceptance is open.
Installed adjacent checks add
bug-28 (upgrade seed restoration invalidates v2) and bug-29 (fresh packaged seed
references prevent migration). Evidence: .mdkg/artifacts/goal-84/bug-24-adjacent-findings.json.
Both block test-483/task-828 and therefore publication. They are functional
findings, not additional Standard security scan findings. Original security
accounting remains twelve of thirteen locally fixed. No new skill candidate.

# Completion Evidence

Pending full end-condition evidence.

## 2026-09-09 Public Bootstrap Seed Verification

Bug29 is locally verified: public core seeds are self-contained and about 80%
smaller by bytes, while canonical instructions and existing aliases remain.
45 focused and23 installed tests pass on each of Node24.18.0/26.0.0, including
actual published0.5.2 upgrade/customization/recovery. Full suite:1249 pass,
zero failures/skips. Receipt: .mdkg/artifacts/goal-84/bug-29-verification.json.
Two independent functional review findings were corrected; task-828 remains
the separate final security/qualification gate. Original security count stays
twelve of thirteen locally fixed. Bugs17,26,27 and new bug32 remain open,
alongside full installed qualification, metadata, ladder and artifact seal.
Bug32 records stale CLI upgrade hints; its implementation has not started.
Next bounded recommendation: bug26 identity recreation provenance. Selected
Goal73, runtime DB, Demo3 bundle and partial bug17 bytes remain preserved.
No new skill candidate; no push, publish, tag, provider or deployment action.

## 2026-09-09 Upgrade Identity and Recovery Verification

Bug-28 is locally verified: 36 focused tests and 14 installed tests on each of
Node 24.18.0 and 26.0.0, plus 1226 full ordinary tests with no failures/skips.
Preview and recovery preserve identities, reject stale dependencies and path
aliases, and prohibit workspace ownership drift. Three independent functional
review findings were reproduced and corrected. Receipt:
.mdkg/artifacts/goal-84/bug-28-verification.json.

Original Standard security accounting remains twelve of thirteen locally fixed;
bug-17 still awaits its compatibility decision and final review. Bugs 26, 27,
29, full installed qualification, task-828, release ladder and artifact seal
remain open. No canonical migration/upgrade, bundle refresh or publication.
Next recommended bounded remedy is bug-29 packaged seed reference closure.
Protected states and separate generated SQLite custody remain unchanged.

## 2026-09-09 Complete Ordinary Test Discovery

Bugs 30-31 correct shell-dependent test discovery and two stale startup/skill
assertions against accepted compact/authority-safe contracts. Before: eight
compiled root test files omitted by ordinary npm tests. Now: all 123 compiled
and three source MJS files execute, with 1212 passing tests and no failures or
skips on Node 26.0.0. The 21 focused checks also pass on Node 24.18.0.
Missing/orphaned compilation, inherited worker context, lost discovery steps
and unsafe patch-only mutation guidance fail closed. No skills, instructions,
coverage floors or coverage denominator changed.

Evidence: .mdkg/artifacts/goal-84/bugs-30-31-verification.json. Historical
1130-plus-26 ordinary-suite receipts did not include the omitted root TS
families; do not treat those earlier counts as complete qualification. Original
security counts remain twelve of thirteen locally fixed. Final task-828,
task-829, installed qualification and release seal remain required.

## 2026-09-09 Site Cache Verification

Bug-25 is locally verified: four failing-before regressions, 13 focused tests
passing on Node 24.18.0 and 26.0.0, runtime-separated cache reuse, and two real
local Astro builds with two verified cache hits. Build, 1130 source tests plus
26 contracts, CLI/docs/graph/SQLite/diff checks pass. The root-level focused
tests ran separately; align ordinary test discovery with the recursive release
coverage contract before final qualification. Evidence:
.mdkg/artifacts/goal-84/bug-25-verification.json.

Original security accounting remains twelve of thirteen locally fixed;
bug-17's compatibility decision, bugs 26-29, full installed qualification,
independent task-828 review, ladder and seal remain open. Protected state and
partial bug-17 work are preserved. No new skill candidate or publication.

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

## 2026-09-08 Bootstrap Documentation Verification

Bug-6 is locally verified with three documentation regressions, 35 installed
bootstrap/upgrade tests and six CLI scenario groups, including actual published
0.5.2 upgrades. The serialized full suite, 26 contract checks, CLI/docs/graph/diff
gates pass. Receipt: .mdkg/artifacts/goal-84/bug-6-verification.json. Bugs 5–6
are locally fixed; bug-7/full behavioral and installed qualification, bugs 15/17
policy decisions, and independent final verification remain. Nothing is published.

## 2026-09-08 Skill Resource Verification and State Alignment

Nick resolved the skill-resource bounds and public DB-payload export decisions.
Bug-15 is locally verified with 44 focused and 44 installed cases, 1,018 source
tests and 26 release/security-contract checks. Both independent candidate-review
issues were reproduced and corrected. Receipt:
.mdkg/artifacts/goal-84/bug-15-verification.json. Twelve of thirteen sealed
security findings now have local fixes; bug-17 is the remaining security fix.

## 2026-09-08 Transport-State Remediation Progress

bug-17 now has a hash-bound partial implementation receipt at
`.mdkg/artifacts/goal-84/bug-17-progress.json`. Eighteen regressions and 78
installed cases pass, as do 1036 source tests and 26 release/security contracts.
The bug remains in progress: config-less public materialization needs an explicit
compatibility decision, alternate representations require final review, and the
independent candidate review has not yet run. This is not a thirteenth completed
security fix or publication readiness. The twelve previously verified fixes
remain unchanged; preserve the full task-828 and Goal 83 gates.
Its accepted public omission/private portability contract is recorded on that
node. Bug-7, full behavioral/installed qualification, task-828, ladder and seal
remain incomplete. No publication readiness is implied.

Git retains distilled intent and project memory; full operational/economic
receipting belongs to consumers. One writer owns each agent graph; parent reads
do not inherit child mutation authority. Consumer-specific coordination is a
separate prompt for Nick to route, not public mdkg policy or a dispatched task.
Protected selected/runtime/bundle state and generated SQLite custody persist.

## 2026-09-08 Behavioral Audit Intake

Task-824 reproduced five additional publication blockers in one frozen installed
candidate: bug-21 legacy observational writes; bug-22 pack identity omission;
bug-23 v2 formatter incompatibility; bug-24 identity-unsafe and unknown-format
initialization; bug-25 incomplete site-build cache dependencies. These are
functional/release-validation findings, not five additional Standard security
findings. The 12-of-13 original security-fix accounting is unchanged.

Test-483 defines independent installed verification and preserved controls.
All five bugs are backlog, qualified for bounded Goal 84 remediation only after
the current source-read-only snapshot audit boundary is closed. Task-828 depends
on them and test-483; no publication gate can bypass this intake. Evidence:
`.mdkg/artifacts/goal-83/task-824-behavioral-audit.json`.

No source remedy occurred during intake. Bug-17 remains blocked on its separate
public materialization decision; independent Goal 83 audit work continues.

## 2026-09-09 Migration Audit Disposition

The completed source/contract trace adds bug-26 (legacy recreation provenance)
and bug-27 (migration validation and skill-dependency binding). All seven
behavioral blockers are owned here and block test-483/task-828. These are not
additional Standard security findings; original security accounting remains
twelve of thirteen locally fixed, with bug-17 incomplete.

Evidence: `.mdkg/artifacts/goal-83/task-824-contract-audit.json`. Three additional
probes bring the custom audit to 37; 124 existing installed contract tests pass
on Node 26.0.0. Passing controls do not verify these new fixes. No source changes
occurred during snapshot review. Independent bounded remediation may follow
task-824 audit closure while bug-17's compatibility decision stays blocked.

## 2026-09-09 Observational CLI Remediation

Task-824 closed with audit chk-574. Goal 83 is paused only while the same
approved qualification pass works its bounded Goal 84 remedies; selected Goal 73
is unchanged. Bug-21 is locally verified: 23 installed tests each on Node 26.0.0
and 24.18.0, 1059 source tests and 26 release/security contracts pass. Evidence:
`.mdkg/artifacts/goal-84/bug-21-verification.json`. Published 0.5.2 is confirmed
affected from an integrity-verified cached artifact. Six behavioral remedies
(bugs 22-27), bug-17's compatibility decision and all independent qualification
gates remain incomplete. No risk waiver, final seal or publication is implied.

## 2026-09-09 Reviewed Legacy Lineage Verification

Bug-26 is locally complete with chk-583 and its hash-bound verification artifact.
Explicit restoration/recreation choices now preserve current references and
historical bodies while rejecting unproven continuity, incomplete history,
stale decisions and oversized generated evidence. Recovery retains exact
old-journal rollback without permitting unreviewed resume. Final validation:
1271 ordinary tests, 36 focused Node 24.18.0 checks, 22 installed checks each on
Node 24.18.0/26.0.0, and 26 release/security contract tests pass. CLI/docs,
graph and SQLite checks pass; selected Goal 73 and protected bytes remain fixed.

Current unresolved bug nodes are 7, 17, 27 and 32. Bug-27 is the next independent
migration-validation lane; bug-17 still needs the legacy public-bundle
materialization decision. The original Standard security accounting remains
12 of 13 locally fixed. Task-828 final independent security review, full
installed qualification, release metadata/ladder and sealing remain open.
No publication, canonical migration, remote action or new skill candidate.

## 2026-09-09 Candidate Validation Verification

Bug-27 now has passing local remediation evidence in
`.mdkg/artifacts/goal-84/bug-27-verification.json`: 1328 ordinary tests, 120
focused checks, and 57 installed cases on each of Node 24.18.0 and 26.0.0.
Complete candidate/dependency validation and recovery/cache custody are shared
by migration and reconciliation. CLI/docs, release-contract, graph and SQLite
checks pass; protected state and separate bug-17 custody remain preserved.

Remaining bug lanes are 7, 17 and 32 after bug-27 lifecycle closure. The next
independent improvement is bug-32 CLI onboarding/repair guidance. Bug-17's old
config-less public-bundle materialization decision remains outstanding, but
does not prevent that independent work. Task-828 final security review and the
full installed/release qualification gates remain open. No publication readiness
or automatic risk waiver is claimed; skill candidates none.

## 2026-09-09 CLI Onboarding Verification

Bug-32 now has passing source and installed evidence: 1338 ordinary tests,
37 focused checks, ten installed cases each on Node 24.18.0/26.0.0, and passing
CLI/docs/release-contract gates. Compact default setup, graph-only compatibility
and preview/hash/path-bound upgrade guidance agree across help, diagnostics and
bundled references. Evidence: `.mdkg/artifacts/goal-84/bug-32-verification.json`.

After local lifecycle closure the unresolved bug nodes are 7 and 17. Continue
the full installed compatibility matrix through bug-7; preserve bug-17's pending
legacy config-less public materialization decision. Final independent security,
coverage/release qualification, metadata and sealing remain open. No publication
readiness, remote action or new skill candidate is implied.

## 2026-09-09 Installed Qualification Milestone

Bug-7 now has chk-586 and a hash-bound partial progress receipt. Real published
0.5.2 standard/customized upgrades and independent-clone collaboration pass on
Node 24.18.0/26.0.0; 1341 source tests and CLI/docs/graph checks pass. Bug-7 stays
progress for its remaining matrix; bug-17 stays blocked on the separate legacy
public-bundle decision. Twenty-six of twenty-eight bug lanes remain locally done,
not twenty-eight. Final task-828, qualification, metadata and sealing remain open.
No new skill candidate, remote action or publication readiness.

## 2026-09-09 Recovery and Legacy-Writer Qualification

Bug-7's chk-587 records six recovery cases and expanded delete/evidence conflicts
passing on Node 24.15.0, 24.18.0 and 26.0.0, plus 1341 passing source tests.
The verified minimum runtime is retained locally for remaining qualification.
An actual 0.5.2 old writer partially mutates a v2 fixture before error; the current
candidate detects the invalid legacy node and refuses further writes. This new
compatibility evidence stays under bug-7 and requires explicit adoption/guard
disposition, not an automatic waiver. Bug-7 remains progress, bug-17's separate
decision remains open, and final review/qualification/publication gates remain.

## 2026-09-09 Legacy Writer Barrier Evidence

Chk-588 narrows the bug-7 decision with 76 runtime probes. Published 0.5.2 has
a reusable newer-config-version refusal for tested non-init commands, but its
init paths bypass that barrier. Recommend layered configuration fencing plus
explicit no-mixed-version writers for v2 adoption; no policy or source change
was silently adopted. Bug-7 stays progress, bug-17 remains separately blocked,
and independent qualification work remains available. Skill candidates none.
