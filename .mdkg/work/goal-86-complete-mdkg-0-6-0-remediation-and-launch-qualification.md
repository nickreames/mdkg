---
id: goal-86
type: goal
title: Complete mdkg 0.6.0 remediation and launch qualification
status: done
priority: 1
goal_state: achieved
goal_condition: Every in-scope 0.6.0 blocker is independently verified, deferred Bugs46/47 remain disclosed under Goal87, portable Node contracts and macOS/Linux installed qualification pass, and the exact artifact is sealed without publication.
scope_refs: [task-834, bug-40, bug-35, bug-17, bug-39, bug-41, bug-42, bug-43, task-835, task-836, task-827, task-838, bug-44, bug-45, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60, task-839, test-488, test-477, test-478, test-479, test-480, test-481, test-482, test-483, test-484, test-486, test-487, task-826, bug-7, task-837, task-828, task-829, task-830, task-841, task-842, test-489, bug-61, task-843, test-490, bug-62, bug-63, bug-64, bug-65, bug-66, bug-67, bug-68, bug-69, test-491, test-492, bug-70, bug-71, bug-72, test-493, bug-73]
last_active_node: task-830
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, npm run ci:workflow:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, node dist/cli.js db index verify --json, git diff --check]
max_iterations: 75
blocked_after_attempts: 3
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/planning-receipt.json, .mdkg/artifacts/goal-86/execution-baseline-20260915.json, .mdkg/artifacts/goal-86/requirement-coverage.json, .mdkg/artifacts/goal-86/observational-boundary-verification.json, .mdkg/artifacts/goal-86/bug-17-local-verification.json, .mdkg/artifacts/goal-86/bug-39-local-verification.json, .mdkg/artifacts/goal-86/bug-41-local-verification.json, .mdkg/artifacts/goal-86/changed-warning-intake.json, .mdkg/artifacts/goal-86/bug-42-local-verification.json, .mdkg/artifacts/goal-86/bug-43-local-verification.json, .mdkg/artifacts/goal-86/filesystem-feasibility/receipt.json, .mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/successor-package-gates-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-private-preview-20260930.json, .mdkg/artifacts/goal-86/local-closeout-20260930.json, .mdkg/artifacts/goal-86/closeout-commit-allowlist-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-83, goal-84, goal-85, goal-75, dec-93, dec-94, dec-95, dec-96, edd-82, task-825, task-833, test-485, dec-98, goal-87, dec-99, dec-100, epic-258, epic-257]
evidence_refs: [chk-608, chk-609, chk-610, chk-611, chk-612, chk-613, chk-614, chk-615, chk-616, chk-617, chk-618, chk-619, chk-620, chk-621, chk-622, chk-623, chk-624, chk-625, chk-650, chk-651, chk-652, chk-653, chk-654, chk-655, chk-656, chk-657, chk-658, chk-659, chk-660, chk-661, chk-662, chk-663, chk-664, chk-665, chk-570]
aliases: []
skills: []
created: 2026-09-13
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


# Independent remediation diff intake - 2026-09-30

Scan e5e0584a at immutable c313d804 is complete with PARTIAL coverage, not clear.
It confirms two low security instances owned by Bugs70/71. Bug63 additionally
owns materialized destination-root Git custody; Bug72 owns configured DB snapshot
Git custody. The latter two are confirmed correctness defects suppressed from
security-advisory reporting for operator-only preconditions, not waived or fixed.
Test493 and Task828 require remedy and complete supporting-diff acceptance.

The retained f7cbdc1d artifact passed2382 full tests,37 package smokes and local
macOS ARM64/Ubuntu24 ARM64-native plus x86_64-emulated installed families.
Tests477-484/486/487 have earned current-byte acceptance; security and seal remain
open. Local implementation commit c313d804 is reviewed; no push/publication.
Preserve all historical passes, original6154 bytes, selection/runtime/Demo3 state.
Any shipped source change needs a successor artifact and affected requalification.
Goal85 remains paused; Bugs46/47 remain deferred unresolved. NOT_READY.

Sanitized current result: .mdkg/artifacts/goal-86/independent-diff-review-20260930.json.
Raw reports remain plugin-owned; no blocked historical context was accessed.

# Current source audit intake - 2026-09-29 Chk667

Current Standard scan78faed0e is complete, not clear: Bugs62-68 own seven
new confirmed security groups; Bug69 owns the separate generated command
effect-contract defect. Tests491/492 and Task828 require their verified fixes.
Earlier candidate/platform evidence remains intermediate. Preserve the exact
6154e4ea artifact; changed package inputs require a successor candidate and
affected requalification. No new feature or deferral is authorized. Bugs46/47
remain deferred/unresolved and Goal85 remains paused. See Chk667 and the
sanitized current-security-audit-20260929.json receipt. Goal86 is NOT_READY.

# Current accepted package closeout contract - 2026-09-28 Dec100

Task843/Test490 are complete with bounded package-gate/candidate-admission proof
in Chk664. Chk665 adds current native macOS installed containment, real read-only,
remedy, parity, scale/lifecycle and generic-boundary evidence. Preserve35 earned
scope completions out of51;16 remain open. Finish missing family/platform rows,
Task826/Bug7, Task828, Task829, Task830 and Chk570. Local reviewed explicit-path
commits are authorized; selected Goal73 remains unchanged. NOT_READY is retained.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Objective

## Current execution contract - 2026-09-28 Node-only portability

Chk653 records the portable SQLite source remedy and Task842 runtime-contract
milestone. Node >=24.18.0 <25 plus explicit capabilities replaces the former
unconditional24.15/26 matrix. Intermediate source and installed tests pass;
Chk654 adds Task841's portable operator-confirmed recovery:345 affected tests
and23 installed cases pass, with no trapped OS dependency. Chk655 adds Test489's
combined local installed pass:86 SQLite cases,29 recovery cases, three resource
samples and two linked worktrees. Bug60 is locally complete; final
qualification remains. The earlier bounded
experiments are supporting evidence, not the current implementation limit.

Dec98 records Nick's explicit scope revision. Bugs46/47 are DEFERRED and
unresolved, owned by paused Goal87. They are not accepted/fixed findings and
are no longer remediation prerequisites of this version's Goal86/Goal84 gates.
Their severity, reproductions and historical evidence remain intact. The
earlier native-helper decision and blocker statements below are historical;
no native implementation or OS-specific filesystem bridge is authorized now.

Bug60's local in-memory SQLite source remedy and Tasks841/842's portable
recovery/runtime contracts are implemented and locally verified. Test489 has
qualified their combined resource, writer and recovery cases against identical
installed bytes without required OS utilities. This intermediate package is
not final-artifact proof. Chk656 records Task839's release-critical guidance
milestone:34 focused checks,499 current examples, independent narrow review
and installed command discovery pass. Final independent/platform/ladder/seal
gates remain open. No unsafe writable fallback or automatic lock
takeover follows from this decision.

Chk657 records Test486's current local installed option milestone on the same
6154e4ea candidate bytes:194 process,388 entrypoint and41 unindexed-graph
refusals plus seven positive controls pass. The fixture is now part of the
manifest-backed command matrix with explicit owned controllers;107 focused
harness tests and independent narrow readback pass. Test486 remains progress
pending final retained-artifact/platform acceptance, not done by this milestone.

Chk658 adds installed initialization, actual published0.5.2 standard/customized
upgrades and six caught-error recovery cases on Node24.18.0/macOS arm64.
The6154e4ea candidate is now retained with a273-file source-input capture;
final rerun used the same bytes without repacking. Test477 remains progress,
not final-platform or sealed-artifact acceptance. No package input changed.

Chk659 adds Test478's actual concurrent installed worktrees,60 explicit-root
warm/cold JSON/SQLite reads, killed-writer recovery isolation and a reviewed
four-conflict source-plus-graph native merge. Existing identity and288-case
Git-observation families also pass on the retained6154e4ea bytes. Test478
remains progress: submodule-backed collaboration, incomplete-journal cases
and final platform/independent/ladder/seal acceptance are not inferred.

Chk660 adds three installed linked-worktree topologies (ordinary, separate
gitdir and submodule-backed),180 read observations,12 sampled journal-fault
scenarios, six actual SIGKILL journals and three native four-conflict merges.
Bug61 corrected a non-shipping qualification-helper admission error;124
shared-helper checks and independent bounded readback pass. The original
source capture remains intact; a separately named qualification amendment
binds the helper delta to unchanged6154e4ea candidate bytes. Test478 remains
progress: this is local intermediate evidence, not recursive submodule or
cross-platform support, dirty-worktree deletion policy, final independent
acceptance or an artifact seal. All six new fixture roots were removed.

Chk661 adds Test479's49 current installed scenario rows on the retained6154e4ea
candidate:22 portable/malformed-policy,12 sampled migration/reconciliation
recovery,9 actual runtime/selection/private-snapshot, and6 live/ambiguous recovery
admission controls. The drivers preserve exact package inputs, staged fixture
indexes, unknown bytes and owned cleanup. A relative-target harness correction
and stronger claim assertion passed the affected supplement without rerunning
unchanged families. Test479 remains progress pending complete per-finding and
containment/read-only/platform/final acceptance; no new product defect or
publication clearance was established by this local evidence tranche.

Chk662 adds49 selected installed scenario rows passing on actual local Linux:
Ubuntu24.04.4 ARM64/ext4, Node24.18.0, unchanged6154e4ea tarball. All281
transferred input hash/mode bookends passed; the disposable no-host-mount VM
and fixtures were removed, leaving the unrelated stopped VM untouched. This
is Linux subset evidence, not full matrix, x86_64, security or seal acceptance.
Dec99 records Nick's clarification that Linux remains required and authorized,
plus the approved fresh current-source/remediation-diff evidence contract with
explicit historical-report provenance loss. No blocked scan context was read,
recovered or rerun and no new review was launched. Goal86 remains NOT_READY.

Goal86 remains the sole active execution lane. Existing final platform,
independent current-source review, full-ladder and exact-artifact gates remain.
Task828/Test488 must account for all fourteen original findings, distinguishing
the two explicit deferrals from verified remedies; they may not claim fourteen
fixes or no known vulnerabilities. Test487 still requires real macOS/Linux
candidate evidence and Windows remains unqualified. Retained blocked scan
context must not be recovered or rerun. Goal85 remains paused.

Current authority is local-only on main with supported ownership and one
writer. Preserve selection, runtime DB, Demo3 bundles and other dirty custody.
No remote, provider, publication, native helper, canonical graph migration or
bundle/subgraph refresh. Skill coverage is reused; new candidates: none.

## Historical 2026-09-28 filesystem feasibility and CI gate stub - superseded by Dec98

Nick's current local-only continuation supersedes Dec97's earlier no-VM and
no-workflow-edit boundaries only for owned filesystem experiments and a
fail-closed GitHub Actions stub; development stays on main with no remote or
hosted action. A sanitized receipt at
`.mdkg/artifacts/goal-86/filesystem-feasibility/receipt.json` binds exact
source/probe hashes. Deterministic current-Node interleaving reached outside
read/append/remove sentinels; Node copyFile lost a named restrictive ACL.
Experimental descriptor-relative and metadata-before-bytes C primitives passed
synthetic macOS ARM64 and isolated Ubuntu 24.04.4 ARM64 controls. The VM was
stopped and deleted. These prove neither a complete mdkg remedy nor x64,
installed-artifact, cross-principal, security-review, or final release evidence.
No production filesystem source was changed; Bugs46/47 remain blocked.

The manifest-generated manual full CI tier now requires an Ubuntu 24.04
x64/ARM64 Test487 job that explicitly fails until real installed-artifact cases
replace the stub. No workflow was dispatched and Test487 remains unqualified.
The next material decision is the bounded native interface/distribution and
fail-closed fallback design, or an explicit revision of release/security scope;
do not implement a mode-only or repeated-path-check partial fix as clearance.
Goal86 is NOT_READY; Goal85 remains paused.

## Historical execution boundary - Dec97

2026-09-25 Bug47 is explicitly blocked after a bounded local Node26/macOS
descriptor-path feasibility check ruled out `/dev/fd/<directory-fd>/child` as
a usable macOS openat substitute. The probe did not test the full race or prove
that all Node-only remedies are impossible. Dec97 still defers the documented
native or system-tool options, and no complete Node-only remedy is established;
this is neither a waiver nor 0.6.0 release clearance. Its sanitized receipt is
linked from Bug47. No source or public-copy change was made for this check.

2026-09-25 Bug60 current-source focused coverage now passes 91/91 on each of
local Node24.15.0, 24.18.0 and 26.0.0 under macOS arm64, all bound to the
same committed source/test bytes. This is not Linux, final installed-candidate,
independent Test488/Task828, full-ladder or sealed-artifact acceptance. Bug60
and Goal86 remain open and NOT_READY.

2026-09-25 source-version assessment: Bug47's recorded 0.5.2 source retains
the ancestor check/use pathname pattern; exact blobs and limitations are bound
in its new sanitized artifact. Bug46's existing investigation already records
the same metadata-omitting replacement pattern in that source revision. Neither
source comparison is an installed-package test or a remedy. Both findings
remain publication blockers under Dec97; no prior blocked scan context was
accessed and no final security/platform gate was credited.

2026-09-25 Bug60's ten-path Node-only source/regression unit is locally
committed at 6d23981e70bc68798def73c81b9cd5fa7bc9f3df. An exact
parent-plus-only-Bug60 disposable snapshot passed 91/91 affected tests and
local build/CLI/docs/CI/graph/index checks; the current-source full suite had
passed 2224/2224 on the same Bug60 bytes. The bug remains in progress because
Linux behavior, Test488 and Task828 independent review are unverified. This
commit does not satisfy the final artifact/platform/security or release gates.

2026-09-25 current-source integration evidence: the old DB/index WAL
expectation failed in an initial host-evidence run (2223/2224), then its
test-only fail-closed correction passed targeted 1/1 and file-wide 30/30.
The subsequent full Node24.18/macOS arm64 suite passed 2224/2224 with zero
failures or skips. Chk650 and the Bug60 JSON receipt retain both failed and
passing attempts. This is not final-candidate or Linux qualification.

Task838's fixture-isolation source/test unit is locally committed at
1143e31ac4f153bfa4c7f543c01b93a1692271fb: exactly 62 reviewed paths.
An isolated copy of committed HEAD plus only those paths passed 2163/2163
tests, CLI/docs/CI checks and the existing remediation-matrix check; its
staged patch hash matched the canonical commit. Task838 graph evidence and
other dirty work remain uncommitted. No push or release action occurred.
Goal86 remains active and NOT_READY.

Chk650 records Bug60's Node-only local subsystem milestone: descriptor-backed
read-only observation, deterministic WAL-transition and valid-inode-replacement
regressions, complete source suite (61/61 on Node24.18/macOS arm64) and installed
focused suites (61/61 on each Node24.15/24.18/26). The intermediate
tarball is unsealed and uncommitted. Bug60 remains progress; Linux behavior,
Test488, independent Task828 review, full ladder and final exact artifact are
not accepted. Goal86 stays active and NOT_READY; Goal85 stays paused.

Nick chose Node.js-only and local-only current development. Future Rust filesystem
work is Epic256; future GitHub Actions Linux qualification is Epic257. These epics
are context, not additional scope_refs or authorization to run native/hosted work.
The explicit active-goal continuation on2026-09-22 resumes this local lane.
Selected Goal73 remains unchanged. The existing goal condition,
security findings and platform acceptance remain unchanged; deferral is not a pass.

The following 2026-09-22 sequence is historical and superseded by the
2026-09-25 status above where it names unfinished Bug60/Task838 work.
Recommended efficient local continuation:
1. Re-inventory preserved Bug60 and Task840 skill-seed custody. Bug60's harness
   corrections now pass, but a fresh same-inode journal-mode interleaving fails
   the no-write observation contract (59/60 focused checks pass). Preserve that
   failing regression and require a Node-only design disposition before closure.
2. Complete independent Task838 Node-only fixture isolation, owned cleanup and
   durable evidence/candidate identity work. No hosted runs or service setup.
3. Prepare Task839's release-critical truth corrections; do not mark aggregate
   acceptance complete while unresolved security/platform claims remain.
4. Use Task840's selective test policy. Batch full integration checks for a
   stable local source unit; final full ladder/coverage and exact-byte qualification
   remain required. Record source/build hashes and timings, not repeated blind runs.
5. Report local work complete separately from release readiness. Bugs46/47 and
   Test487 remain explicit gaps; no Rust/system-tool bridge or Linux qualification
   is performed by this continuation. Node-only remedies must meet the same
   invariants or remain partial, never documentation-only waivers.

Readiness: LOCAL_WORK_ACTIVE, NOT_READY_TO_COMPLETE_OR_PUBLISH. No Bun,
compiler/runtime replacement, broad polish, federation or new consumer policy.
Chk638 records the decision, future epics and custody; Goal85 remains paused.

2026-09-22 chk647 additionally qualifies native npm-exec with five verified lazy
consumptions and actual child runtime evidence per local Node version. A review
gap was reproduced and fixed;149 final affected checks pass per runtime. Two
Task838 callers now remain: hostile-Git boundary and asynchronous MCP. The
recorded eight-caller milestone is not Task838 completion or final release proof.

2026-09-22 chk647 qualifies seven synchronous installed smoke callers and their
transitive helpers:21 selected installed passes and147 affected checks per local
runtime. Reviewed diagnostic/init-controller corrections and source-grounded
fixture sequencing/hash fixes preserve all original scenarios. Composite evidence
records which unchanged-input passes were reused; failed runs remain explicit.
Three distinct Task838 callers remain. No package-input change, full ladder,
final seal, staging/commit or publication;26/47 done and NOT_READY remain unchanged.

2026-09-22 chk646 qualifies eight more installed graph-workflow callers on all
three local Node runtimes:24 installed runs and129 affected checks per runtime
pass. A stale next --json fixture call and its initial evidence-scope mismatch
are corrected and independently source-reviewed. Candidate/sentinel/source hashes
and owned cleanup match. Ten caller candidates remain under Task838; no full
ladder, final seal, commit or publication. Goal86 stays26/47 done,NOT_READY;
Bug60 and all existing security/platform gates remain unchanged.

2026-09-22 chk645 qualifies the seven DB/SQLite smoke callers on all three local
Node runtimes:21 installed runs and128 affected checks per runtime pass. The
reviewed ambient Git-ignore leak is reproduced/corrected while retaining authored
ignore rules and commit-eligible SQL. All candidate/sentinel/source checks and
owned cleanup pass. Eighteen remaining caller candidates still need classification
and migration; no Task838 closure, package-input change, full ladder or seal.
Bug60's design decision and existing release blockers remain unchanged,26/47 done.

2026-09-22 chk644 qualifies six additional Task838 installed smoke callers on
all three local Node runtimes:18 complete smoke runs and122 focused checks per
runtime. Ambient Git redirection and a newly reviewed installation-before-hash
gap are reproduced/corrected. Original scenarios remain; all fixture cleanup and
candidate/sentinel checks pass. Continue remaining DB/SQLite and other fixture
callers. No package-input change, canonical build, full ladder, final seal or
commit;26/47 scoped records remain done and overall release status is NOT_READY.

2026-09-22 chk643 advances Task838 direct smoke callers, transitive installed
Node supervision and separate pinned-baseline provenance. Final focused checks
pass117/117 per local runtime; installed branch/collaboration plus12 recovery
cases and seven current-upgrade cases pass per runtime. Published0.5.2 upgrade
remains unverified without local baseline bytes; no download was attempted.
Continue the remaining caller inventory. Goal86 remains26/47 scoped nodes done,
active on Task838, NOT_READY; Bug60 and security/platform/final gates are unchanged.

2026-09-22 Task838 Git/process increment: chk642 binds105/105 affected checks
per local Node runtime, refreshed demo controls and installed collaboration plus
12 graph-recovery cases per runtime using identical intermediate tarball bytes.
Native metadata/helper admission, nested shutdown and upgrade cleanup/default-temp
controls are locally verified. Remaining callers and published-baseline upgrade
execution are not covered by this increment. Continue Task838's surrounding smoke
callers; do not inflate26/47 completed scope nodes or claim final artifact readiness.
Bug60, filesystem/platform gates, final review/ladder/seal and Goal85 remain unchanged.

2026-09-21 explicit user pause: chk637 records55% formal scope completion
(26/47 done),12/14 retained findings locally remedied, Bug60 draft53/55 focused
tests, remaining filesystem architecture/platform/final-qualification gates and
exact dirty custody. Goal85 stays paused/NOT_READY. Do not resume execution
without Nick's instruction; no blocked-context recovery or historical scan rerun.

Complete mdkg 0.6.0 remediation and launch qualification as generic OSS project
memory infrastructure. This is the sole future execution lane for the remaining
Goal83/84 work, not a replacement for their accomplishments or acceptance duties.
Goal85 remains the separate paused publication lane.

# End Condition

Return LOCAL_READY_NOT_PUBLISHED only when every required case, macOS/Linux
platform gate, fresh Standard audit, independent remediation diff, full ladder,
and exact artifact seal is complete and chk570 is accepted. Otherwise return
NOT_READY with exact failing or missing gates. No claim of undiscovered-bug absence.
Goal83/84 may close only when their preserved original conditions are actually met.

# Non-Goals

Owner: mdkg-project-agent, one writer in this checkout. The explicit Goal 86 run
on 2026-09-15 authorizes the fully planned bounded implementation, local validation,
evidence and reviewed explicit-path local commits on main. Planning-only labels in
the original package describe its pre-run state, not a continuing implementation
prohibition. Selected state does not authorize or expand this run.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

Keep compact default init with graph-only/--agent compatibility, explicit v2
adoption, stable graph/node identities with numeric aliases and native Git
worktrees. No Git mutation wrappers, product-specific policy, federation, remote
skill distribution or autonomous self-improvement additions. Operational
execution, authentication, scheduling, accounting, reputation and full economic
receipts remain consumer-owned. Do not migrate other projects or rewrite their
instructions. Windows is unqualified, not silently supported or newly blocked.

# Recursive Algorithm

1. Task834 re-inventories branch/HEAD, cached upstream, exact dirty custody,
   locks/leases, source/package/evidence hashes, current graph and preserved state.
   No scan or mutation starts from the historical baseline alone.
2. Finish Bug35's narrowly owned observational Git helpers, preserving the
   overlapping Bug17 patch; then finish Bug17 transport policy and Bug39 refusal.
3. Tasks835/836 implement the accepted writer-admission and evidence-bound
   interrupted-writer recovery portions of Bug7. Their local implementation
   checks precede the final installed families; Bug7 is aggregate acceptance.
4. Task827 prepares final draft 0.6.0 metadata, breaking-change/upgrade/native-Git
   guidance and finalized package inputs. Create one frozen candidate tarball
   for qualification. Task830 later seals those same bytes, never repacks them.
5. Execute tests477-481 and483/484/486 using installed bytes; test482 binds all
   runtime results and test487 requires macOS/Linux proof. Task826 accepts this
   matrix, then Bug7 closes its missing-qualification obligation.
6. Task837 conducts a fresh Standard repository audit after known remedies and
   draft metadata. Read-only review can overlap fixture execution only while the
   reviewed source stays frozen. Persist its exact complete or incomplete coverage.
   The completed historical task825/scan remains immutable background evidence.
7. Route every new confirmed blocker to Goal84 and this scope with deduplicated
   bug, affected version, regression, bounded remedy and verification requirement.
   Do not turn pending audit candidates into confirmed defects or alter old counts.
8. Task828 independently reviews the complete remediation range, deleted files
   and supporting behavior; then task829 runs the full unchanged-threshold ladder.
   Any new fix invalidates affected reviews, test evidence and candidate inputs.
9. Task830 seals the exact artifact and chk570 accepts all gates. Record reviewed
   local commits, remaining dirty custody and ownership release. Leave Goal85
   paused for fresh publication approval and task831 artifact/blocker rechecks.

# Required Skills

Use the listed grounding/pursuit/closeout skills. Fresh Standard and later diff
reviews use the installed Codex Security workflows and capability preflight.
Keep source reviewers read-only and offline. Do not start replacement scans for
failed preflight, silently change global Codex configuration, or count incomplete
coverage as clearance. Raw reports stay plugin-owned; repository evidence is
sanitized summaries, hashes, dispositions and regression references only.

# Required Checks

Complete ordinary tests and manifest-backed full local release ladder; floors
remain 89 percent lines,77 percent branches,96 percent functions. Require complete
test discovery, CLI/help/contract/docs/MCP/seed/native-skill/package parity, full
and changed-only graph validation, supported SQLite index verification and diff
checks. Under Dec98/Task842, record exact Node24.18.0 and selected supported24
executables/capabilities; the same executable is not two distinct runtime passes.
Older24 and tested26 are explicit no-effect refusal controls, not positive
compatibility. All six fixture families use installed tarball bytes and isolated caches/config.
MacOS and Linux proof is required before publication; Windows remains unqualified.

# Acceptance Criteria

- Requirements have historical, current-intermediate, final-artifact-pass,
  failure or unverified dispositions; no missing case is counted as pass.
- Actual recorded0.5.2 upgrades preserve customized root instructions, project
  docs and skills; repeat/stale/interrupted/recovered upgrades are verified.
- Two actual linked worktrees preserve shared graph identity, distinct node IDs,
  colliding aliases and uncommitted cross-links; selection/indexes/locks/journals/
  caches/runtime state stay checkout-local. Same-checkout second writers refuse.
- Pin target/incoming/ancestor; review and apply reconciliation before native
  Git merge, explicitly commit the reviewed graph, perform the ancestry-preserving
  merge and resolve graph paths to the exact reviewed result. Never blanket-ours
  .mdkg. Validate combined source plus graph, commit the merge and verify ancestry,
  repeated integration, cherry-picks/reverts, deletion/reintroduction and receipts.
- Qualify submodule/gitdir-indirection separately. Retain clear failure evidence
  rather than weakening guards or declaring unsupported topology proven.
- Stale plans, abrupt termination, malformed inputs, containment, real read-only
  filesystems, JSON/SQLite parity, packs/MCP, work/archive references, scale and
  lifecycle/blocker routing have case-level evidence and untouched Git staging.
- Task309's historical alias-shaped mdkg URI remains evidence-bound: never invent
  identity, rewrite its history or remove a blocker merely to migrate a fixture.
- Independently resolve the ancestor-swap and ACL/ownership preservation limits
  in task828/test487. Documentation alone cannot waive an in-scope security defect.
- Verify task833's extraction manifest and npm exclusion without consumer dispatch
  or adoption claims. Retain generic receipt semantics; local structural proof
  is not external execution/payment/attestation authenticity.
- Preserve measured slow-transaction limitations. Large-transaction redesign is
  post0.6 unless correctness or a mandatory gate fails; no arbitrary weaker limits.
- Seal SHA256, SHA512 integrity, package file/input manifests, source revision,
  runtime/platform identities, both current security reports and validation.
  Evidence-only commits may follow; package-input changes invalidate the seal.

# Definition Of Done

Chk570, task828, task829, task830, task837 and test487 have complete bound evidence,
no Goal84 publication blocker remains and protected bookends match. Report-only
goal evaluate or goal done cannot substitute for artifact or authority checks.
The current planning pass does not satisfy any execution or publication gate.

# Stop Conditions

Unknown dirty ownership, moving baseline, concurrent writer, material new
product/security choice, required global/host configuration or excluded action.
Linux prefers an existing local executor after endpoint/image/isolation checks.
Do not start/reconfigure services; missing local capability or hosted CI needs
precise separate authorization and remains a blocking evidence gap.

# Current State

2026-09-28 current milestone: Dec98 and Chk652 defer unresolved Bugs46/47 to
paused/unclaimed Goal87 without calling them accepted or fixed. Tasks841/842,
Test489 and Bug60 have local portable-Node implementation/installed evidence;
Chk656 records Task839's guidance/checker completion. Final current-artifact
installed families, macOS/Linux qualification, independent security acceptance,
full coverage/ladder, exact seal and reviewed local commits remain. Goal86 is
active and NOT_READY; Goal85 remains paused. Main stays6d23981e,69ahead cached
origin/main, no staging or new commit in this milestone. All protected bookends
match. The older progress entries below retain their historical scope only.

2026-09-22 Task838 output-custody progress: replaced destructive configured
coverage/context cleanup with fresh-output admission; preserved different build
content and previous release receipts; moved context leaf checks before reads.
The affected61 checks pass on each required local Node version. One bounded
source review and correction follow-up are recorded in Task838's new output
evidence. No package qualification or task completion is implied. Continue
Task838's remaining Git fixture isolation and demo scratch cleanup. Bug60 and
Bugs46/47, Linux, final review/ladder/seal remain open; Goal85 stays paused.

2026-09-22 Task838 artifact-custody increment:27/27 focused checks pass in2.36s
after replacing hard-linked delivery and adding before/after consumption hashes.
Canonical self-deletion, unrelated overwrite and same-size corruption cases are
covered. Task838 remains active for Git fixture isolation, cleanup ownership,
durable retention and full qualification. Chk639 binds this progress and Bug60's
59/60 result, including its remaining journal-transition failure. No commit or
release readiness claimed; all protected bookends match and Goal85 remains paused.

2026-09-22 resumed with unchanged HEAD c1011348 and accepted existing custody.
No active runtime writer leases or mutation/Git index locks were found before
claim. Bug60 now has59 passing focused checks and one explicit failing
journal-transition regression after independent read-only review. This is not
an unconditional read-only fix or final qualification. The known partial source
and all prior planning/skill changes remain uncommitted. Continue independent
Task838 while Bug60's remaining Node-only observation design is unresolved.
Use .mdkg/artifacts/goal-86/bug-60-local-resume-evidence.json for current evidence;
do not access blocked context or rerun the historical scan. Goal85 remains paused.

2026-09-21 Bug59 native-Git metadata exclusion locally verified: shared mirror
admission covers Git directories/files, linked-worktree/submodule topology,
redirected and alternate stores, nested repositories and upgrade replay.
47 focused tests,2040 full tests and285 installed cases pass on the required
three Node runtimes on macOS arm64. One bounded candidate review and its
corrections are recorded; no blocked context accessed. This adjacent custody
defect does not change the twelve-of-fourteen locally remedied security count.
Bugs46/47 and adjacent Bug60 remain, plus Linux, independent final acceptance,
coverage ladder and exact final seal. Selection/runtime/Demo3 preserved;
SQLite projection remains separate dirty custody. Next: Bug60 read-only SQLite
admission. Goal86 active; Goal85 paused / NOT_READY.

2026-09-21 Bug58 MCP request/session remedy verified: unknown parsed values are
admitted before field access or dispatch; malformed envelopes cannot terminate
stdio or execute a tool under an invalid ID. Valid requests/notifications and
resource limits remain.41 focused cases,1993 full tests and105 installed cases
pass on Node24.15.0/24.18.0/26.0.0 macOS arm64,0 failures/skips. One independent
read-only candidate review found no concrete regression. This is an adjacent
correctness blocker, not a fifteenth security finding. Twelve of14 retained
findings have local remedies; Bugs46/47 and adjacent Bugs59/60 remain, plus
Linux, final independent acceptance, coverage ladder and exact seal. Protected
selection/runtime/Demo3 state preserved; SQLite projection remains separate
dirty custody. No blocked context or remote actions. Next: Bug59 native Git
metadata exclusion from skill mirrors. Goal86 active; Goal85 paused / NOT_READY.

2026-09-21 Bug57 bounded archive ownership remedy verified: whole-set resource
admission rejects nested private/disabled owner access, protected metadata and
resource overlaps before payload reads. Template selector normalization and
ordinary dotfile/literal-# compatibility were freshly reproduced and corrected
after one independent candidate review.83 focused tests,1958 full tests and114
installed cases pass across Node24.15.0/24.18.0/26.0.0 on macOS arm64. Three
preserved stale-import warnings remain. Twelve of14 retained findings now have
local remedies; Bugs46/47 and adjacent Bugs58-60 remain, along with Linux,
independent final review, full coverage ladder and exact final artifact seal.
Selected Goal73, runtime DB and Demo3 bundle preserved; SQLite projection remains
separate dirty custody. No blocked context or remote actions. Next: Bug58 MCP
malformed-request resilience. Goal86 remains active; Goal85 paused / NOT_READY.

2026-09-21 Bug56 bounded local remedy verified (chk-633): command-local catalog
and provenance reuse, shared file/byte budgets, bounded indexed-template reads,
imported show-body accounting and incremental frontmatter/purpose parsing.
1920 full tests,161 focused/nearby cases and312 exact installed cases pass;
Node24.15.0/24.18.0/26.0.0,macOS arm64. Intermediate231-file package SHA256
9c54ce1301ee1db89a5afe5f326c485346bb52d10707de46dd49493305f5ddca.
One independent candidate review found the imported-body budget gap; fresh
synthetic proof confirmed it and verified the bounded correction. Eleven of14
retained findings have local remedies; Bugs46/47/57, adjacent Bugs58-60, Task828,
Linux, full ladder/coverage and seal remain open. Protected state matches; no
blocked context, old scan recovery or remote actions. Next: Bug57 archive payload
ownership. Goal85 stays paused; release NOT_READY; skill candidates none.

2026-09-21 Bug55 bounded local remedy verified (chk-632): shared contained,
regular-file-only loop-seed admission now precedes new-loop reservations/writes
and supplies the receipt snapshot. Direct seed selection, title-only suggestions,
sorting and absent catalogs retain their behavior.1879 full tests,63 seed-safety
cases,109 nearby compatibility checks and189 exact installed checks pass;
Node24.15.0/24.18.0/26.0.0 on macOS arm64. Intermediate231-file package SHA256
9d55271507571235d2e3c5d7257dd7e8f8abc7abdff8e20a9cd800fe9ac4f024.
Fresh read-only candidate review: no concrete findings. Ten of14 retained
findings now have local remedies; Bugs46/47/56/57, adjacent Bugs58-60, Task828,
Linux, full ladder/coverage and final seal remain open. Protected state matches;
no blocked context or old scan recovery. Next: Bug56 resource/provenance reuse.
Goal85 stays paused; release NOT_READY; skill candidates none.

2026-09-21 Bug54 bounded local remedy verified (chk-631): exact safe-integer
allocation, source-fresh alias admission, prospective validation and reviewed
SQLite batch reservations prevent hangs and duplicate/invalid authored IDs.
Preserved bundled templates, portable IDs and explicit legacy relationship
staging.1816/1816 full tests,147 final compatibility checks and258 installed
cases pass; Node24.15.0/24.18.0/26.0.0 use one230-file intermediate package
7bf5c746dc35a36e6efdee7ce7d6a6a0e2fabdb36c842e112b23abbbbeb1f3e4.
One fresh read-only candidate review identified three addressed admission gaps;
the superseded full run's three compatibility failures remain recorded. Nine
of14 retained findings now have local remedies; Bugs46/47/55-57, adjacent
Bugs58-60, Task828, Linux qualification, full ladder/coverage and final seal
remain open. Protected Goal73/runtime/Demo3 bookends match. No blocked context
accessed, old artifacts recovered or blocked findings rerun. Next: Bug55 loop
seed containment. Goal85 stays paused; release NOT_READY; skill candidates none.

2026-09-21 Bug53 bounded local remedy verified: reject multiply linked init
manifests before initialization and guard descriptor/path custody at the writer;
retain ordinary single-link inode metadata.1730/1730 full,59 focused and111
installed cases pass on macOS arm64. Installed Node24.15.0/24.18.0/26.0.0 use
intermediate tarball166ce48297af02aff57036686e4e343161e99aa6b48a1cf712e96afd17dae10a.
Fresh agent creation hit the session limit; parent separate review fallback is
recorded, not independent acceptance. Eight of14 retained findings now have
bounded local remedies; six remain open plus adjacent Bugs58-60 and final gates.
Native namespace races and general ACL/metadata work remain Bugs46/47. No blocked
context accessed or recovered. Next: Bug54 numeric-ID safety. Goal85 paused;
release NOT_READY.

2026-09-21 Bug52 local verification complete: complete canonical approved-plan
binding before recovery effects; unbound legacy journals refuse automatic
continuation without alteration.1718/1718 full tests,82 independent focused and
219 installed cases pass. Installed Node24.15.0/24.18.0/26.0.0 on macOS arm64
share intermediate tarball2e31963463aeb550272a5204a4b90cda93fa172d06f399ef1a526191fd82ade3.
One independent source-only review found no concrete surviving in-scope bypass
or new regression. Seven of14 retained findings now have local remedies; seven
remain open, plus adjacent Bugs58-60 and platform/security/ladder/seal gates.
No blocked context accessed or recovered. Native filesystem architecture remains
Bugs46/47. Next independent remedy: Bug53 hard-linked init manifest peers.
Goal85 remains paused; release NOT_READY.

2026-09-21 Bug51 local verification complete: contained regular-file admission
for snapshot/manifest/runtime and implicit SQLite sidecars; bounded manifests,
streamed DB hashes and explicitly read-only observational opens. Frozen-source
1670/1670 full,117 focused,237 installed and9 staged/unstaged custody cases pass
on macOS arm64. Installed Node24.15.0/24.18.0/26.0.0 share exact intermediate
tarball b734379203b4887daea7ba1a45b8a38fcd89675a294ec5b2d72bbe854fbbf681.
One independent source-only candidate review found no concrete surviving in-scope
bypass. Six of14 retained findings now have local remedies; eight remain open,
plus adjacent Bugs58-60 and final platform/security/ladder/seal gates. No blocked
context accessed or recovered. Native SQLite pathname races and metadata/ACLs
remain Bugs47/46; other observational SQLite paths remain Bug60. Next independent
remedy: Bug52 upgrade-journal plan binding. Goal85 paused; release NOT_READY.

2026-09-21 Bug50 local verification complete: regular-file input admission and
mandatory-check aggregation prevent false-valid snapshot receipts. Frozen-source
1664/1664 full tests,71 focused and78 installed cases pass on macOS arm64;
26 cases each use Node24.15.0/24.18.0/26.0.0 and exact intermediate tarball
d520a0c1f94e439765091eaeebe60569d1ee60f263ccb5aff1ca6f0b0568e531.
One independent candidate review found no concrete surviving bypass in this
bounded control. Five of14 retained findings now have local remedies; nine
remain open plus adjacent Bugs58-60 and final qualification. This does not
resolve linked-input authority (Bug51), metadata/ACLs (Bug46), or ancestor races
(Bug47). No blocked context accessed or recovered. Next independent remedy:
Bug51 snapshot input containment. Goal85 stays paused; release NOT_READY.

2026-09-21 Bug49 local verification complete: contained registry admission before
skill effects and at refresh, plus preflighted UTF8 output bounds. One completed
candidate review found a reproduced/corrected budget regression. Frozen-source
1658/1658 full tests,164 focused and57 installed cases pass on macOS arm64;
installed Node24.15.0/24.18.0/26.0.0 share exact tarball
da3b71ff1f10992272f18c1044b07a261dda807795e1f4b7c380507d8d8a56cd.
Earlier interrupted/build-collision/harness attempts remain explicitly recorded,
not counted as passes. Four of14 retained findings now have local remedies;
ten remain open, plus adjacent Bugs58-60 and final qualification gates. No blocked
context accessed or recovered. Next independent remedy: Bug50 snapshot validity.
Bug46/47 filesystem architecture and final platform/security/ladder/seal remain
open. Goal85 remains paused; release NOT_READY.

2026-09-21 Bug48 local verification complete: bounded config/source/ZIP reads,
164 focused passes and90 installed CLI/MCP cases across the three required Node
versions on macOS arm64. Complete1647-test discovery had1614 passes/33 failures
from unavailable sandbox OS ownership proof; all38 tests in the unchanged
affected family then passed with approved native evidence. Receipts retain both
outcomes. No blocked context was opened and no old scan evidence was recovered.
Local completion is not Linux, Task828, full-ladder or final-artifact acceptance.
Goal85 stays paused; remaining security/adjacent remedies and native-filesystem
design remain in scope. Protected selection, runtime and Demo3 bytes match.

2026-09-21 RESUMED by Nick: continue fixes from retained mdkg evidence. Do not
access blocked scan context, recover its artifacts, or rerun that historical
scan/findings. This supersedes chk624's proposed recovery prerequisite; missing
original files remain a disclosed limitation, not a reason to stop independent
source remedies. Current local regression tests verify new fixes; they do not
reconstruct or re-finalize the old scan. Final release acceptance stays separate.
Nick also approves bounded native-filesystem feasibility/design planning for
Bugs46/47, not dependency adoption or a packaging choice. Preserve current main,
accepted partial custody, selected Goal73, runtime DB and Demo3 bundle. No remote
Git, publication, provider, canonical migration or bundle/subgraph refresh.

2026-09-18 findings-capture checkpoint624: Nick requested a durable inventory and
remediation planning, so no further functional change is being made in this pass.
The completed Standard scan recorded14 confirmed findings (5medium/9low):
Bugs44/45 locally done, Bug46 blocked, Bug48 partial, and10 in backlog. Bugs58-60
remain separately classified correctness/custody/platform gaps. No new duplicate
goal or finding is needed. Goal86 remains the existing execution lane; this
checkpoint does not activate new work or approve native dependencies.

Bug48 independent review plus a bounded parent reproduction confirmed the
selected ZIP reader still admits a blocking final-leaf substitution. Keep its
two-source/three-test partial patch unstaged and unfinished. Earlier155 focused
and69 installed passes are intermediate only; no terminal full-suite result was
recovered. Exact current hashes and observed outcomes are in
.mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json.

The canonical Standard reports and Bug48 temporary receipts/tarball are now
inaccessible at recorded paths in this environment. Sanitized committed findings
survive; report completion is historical, not evidence availability or clearance.
Task838 now covers retained custody and Task828 requires verified originals or
explicitly superseding qualification. Do not infer deletion, provider action,
security-policy rejection or permission to change host/global configuration.
Live workbench context subsequently confirms all14 findings survive and the
actual remediation guardrail is revision mismatch (scanned e42f1d9 versus
current85226b5), with reportAvailable=false. Preserve current main; no rollback,
old-scan re-finalization or new scan is authorized by this findings checkpoint.
The separate Bug46/47 filesystem architecture decision remains unresolved.
Protected Goal73/runtime/Demo3 hashes match; Goal85 remains paused, NOT_READY.

Earlier decision checkpoint (preserved history):

2026-09-18 decision gate: Bugs44/45 are locally verified and committed in
d44831b6/754710c7. Fourteen scoped nodes are done, including the fresh Standard
audit; audit completion is not clearance. Bug46 now has seven reproduced
mode/ACL/group failures and six passing hardlink controls on macOS arm64,
built-source Node26. No Bug46 source patch has been applied. Chk623 preserves
the pending native-filesystem architecture decision and alternatives. The
existing goal remains incomplete, not newly user-paused or achieved. Stop this
execution pass for Nick's decision before adding native/runtime dependencies.
Selected Goal73, runtime DB and Demo3 bundle remain unchanged; Goal85 paused.

2026-09-18: Fresh Task837 Standard scan9d6a2ca2 is complete against frozen
maine42f1d9/draft0.6.0:14confirmed findings,5medium/9low,567fully reviewed files
with explicit exclusions. Bugs44-57 own those remedies; Bugs58-60 separately
own MCP robustness, Git-metadata mirror refusal and observational SQLite
qualification. Tasks838/839 correct harness custody and final release-critical
truth; test488 binds the fresh regression map. Source audit completion is not
clearance. Candidate6957f918 remains unqualified and must be replaced after
package-input changes. Raw reports remain plugin-owned; sanitized hashes and
dispositions are in task-837-standard-security-audit.json. Broader documentation
polish stays deferred, Goal85 paused, and protected selection/runtime/Demo3
hashes are unchanged. Existing completed milestones below remain historical.

Task827 draft metadata and release-critical guidance are locally verified:
package0.6.0, public release draft/unpublished,1,628 source tests,95 focused and
27 release/contract checks pass. Independent bounded guidance review is clear;
CLI/docs/generated parity, local docs smoke and graph/SQLite checks pass. Eleven
scoped nodes are locally done. Final installed/platform/security/full-ladder/seal
gates remain open. Proceed with reviewed local commit and frozen-candidate
qualification; no remote or publication authority. Broader docs polish is later.

Prior local implementation milestone:

Tasks835/836 are locally verified and done under chk617/618: explicit reviewed
schema2 writer fencing plus evidence-bound interrupted graph-writer recovery.
All1,627 source tests pass; coverage91.80/82.80/96.99 exceeds unchanged floors.
The Task836 intermediate package passes11 installed abrupt-termination cases on
each of Node24.15.0/24.18.0/26.0.0. Two independent candidate-review findings were
reproduced and corrected. Task827 draft metadata and release-critical guidance is
next. Ten scoped nodes are locally done; final0.6.0 platform, installed, security,
full-ladder and artifact-seal gates remain incomplete. No release waiver.

RESUMED by Nick on 2026-09-15 after chk616. Fresh custody matches the checkpoint:
125dirty paths, unchanged HEAD, Git index, selected goal, runtime DB and Demo3.
Continue task835 then task836 and core qualification. Linux x86_64 and ARM64
qualification are accepted, with native versus emulated execution identified.
Consumer adoption of unreleased v2 graphs is unknown; this is public alpha, not
a reason to expand into consumer investigation or delay the bounded core fixes.
Broader documentation audit and polish belong in a later goal set. Keep only
release-critical correctness, breaking-change and qualification guidance here.

Historical pause:

PAUSED by Nick on 2026-09-15, with task835 retained as the unfinished resume node.
Chk616 and .mdkg/artifacts/goal-86/pause-checkpoint-20260915.json capture exact
123-path pause-entry custody, completed local remedies, reproduced writer gaps
and remaining qualification gates. No Task835 functional patch has been made.
The app goal is also paused. Supported mdkg pause serializes status blocked plus
goal_state paused; this is a user pause, not a claim that all scope is externally
blocked. No further implementation, fixture execution, scan or Git action is
authorized by an automatic continuation of this paused run.

Prior execution state (preserved history):

RUNNING since the explicit Goal 86 run on 2026-09-15. The fresh inventory matches
all 40 paths left by the completed planning pass, at unchanged main HEAD
38205296208c23fcfcc6fc821a295040be05c0bb. No unknown path, active runtime lease,
queue item or writer lock was found. Task834 completed initial custody and
requirement grounding; Bug35/40 now have narrow local verification and are done.
Bug42 records the wider mounted metadata failure, not a qualification waiver.
Bug17's local remedy is verified:118 focused and1,457 full source tests pass,
plus22 installed transport scenarios per required runtime on the same intermediate
artifact. Final platform and independent security qualification remain open.
Bug39 is done under chk612 with local source, independent candidate-review and
three-runtime installed verification. Its final test486 and security/platform
gates remain open. Bug41 is locally done under chk613 with1,474 source tests and
726 installed cases per required runtime on one unchanged intermediate package.
Bug42 is locally done under chk614 with1,515 source tests and242 installed plus84
actual read-only checks per required runtime on one unchanged intermediate package.
Bug43 is locally done under chk615 with1,521 source tests and16 installed cases
per required runtime on one unchanged intermediate package. Exact changed-warning
paths and read-only state pass; Task835 is next. No release
readiness is inferred from local implementation acceptance.
Selected Goal73, runtime DB, Demo3 bundle and Git index are preserved.
The execution baseline and requirement matrix are in .mdkg/artifacts/goal-86/.
Goal 85 stays paused; publication, remote Git and all other exclusions remain.

Historical planning state:

PLANNED / PAUSED / UNCLAIMED. User approved mdkg-only plan authoring on2026-09-13.
Only a later explicit Run authorizes scoped implementation and reviewed local
commits. Main38205296208c23fcfcc6fc821a295040be05c0bb is50ahead/0behind cached
origin/main;11preserved dirty paths include partial Bug17 source, Bug7/35/17
evidence and a derived SQLite index. Package version is still0.5.2; no live remote
verification. Selected achieved Goal73, released runtime leases, empty queues and
Demo3 bundle remain protected. Baseline/custody are bound in the planning receipt.

# Iteration Log

- 2026-09-28: Chk656 binds twelve owned guidance/checker/test paths,34 focused
  checks,499 current examples,8 skills, local website/docs/SEO and an installed
  command-docs smoke on candidate6154e4ea. A bounded independent review is
  resolved; historical examples are separated rather than rewritten. This is
  local guidance completion, not final artifact/security/platform acceptance.
  No runtime source changes in Task839, no new commit or external action.

- 2026-09-22: Chk641 verifies Task838's demo-fixture isolation/cleanup increment:
 80 affected checks and the complete existing demo smoke pass on each local
 Node24.15.0/24.18.0/26.0.0 runtime. Five synthetic failure observations informed
 exact copy/cleanup/process-lifetime corrections; one source reviewer rechecked
 them. Canonical demo/bundle/selection/runtime bytes remain unchanged. Git fixture
 admission across remaining callers is next. Task838/Goal86 remain active,26/47
 scoped nodes done; no final-artifact/platform/security/ladder clearance or commit.

- 2026-09-18: Task837 current-source Standard audit completed without changing
  frozen source/package bytes. Main e42f1d9 contains the reviewed171-path core
  commit;51ahead/0behind cached origin/main, no remote action. Fourteen fresh
  findings and three adjacent correctness/contract gaps are separately routed,
  with new fixes blocking final test families, task828/829 and publication.
  No finding is waived or earlier achievement reopened. Skills reused; none new.

- 2026-09-17: Task827 local preparation is accepted with draft0.6.0 metadata,
  source-grounded breaking guidance and preserved user customization. All1,628
  source tests pass against unchanged input hashes; independent bounded guidance
  and169-path custody reviews found no unknown implementation. Receipt:
  .mdkg/artifacts/goal-86/task-827-local-verification.json. Final qualification
  remains incomplete. No staging/commit/remote action at this checkpoint.

- 2026-09-18: Task836 local acceptance under chk618 and
  .mdkg/artifacts/goal-86/task-836-local-verification.json. Exact OS/checkout,
  lock-chain, journal-inventory and current-file evidence gates recovery; live or
  insufficient ownership refuses. Full source and coverage each1,627pass;
  33installed SIGKILL cases pass across required runtimes on macOS arm64.
  Final0.6.0/Linux/security gates remain open. No staging, commit, remote action,
  canonical migration or bundle refresh. Task827 next; broad docs polish later.

- 2026-09-15: Task835 local acceptance recorded under chk617 and
  .mdkg/artifacts/goal-86/task-835-local-verification.json. Known old-init limits
  remain explicit; no unsupported mixed-writer claim. Protected bookends and
  canonical schema1 remain unchanged. Three owned installed fixture trees were
  removed after preserving reproducible receipts/package/log evidence. No
  staging, commit, remote/provider action, canonical migration or bundle refresh.
  Task836 next; wider docs audit/polish stays outside the current core pass.

- 2026-09-15: Nick resumed the accepted core implementation scope, confirmed
  Linux x86_64 plus ARM64 coverage and left prerelease consumer adoption unknown.
  Preserve the alpha compatibility policy and release-critical guidance; defer
  a broader documentation/polish goal set. No architecture or publication waiver.

- 2026-09-15: User-requested pause recorded under chk616. Eight scoped nodes are
  locally done (task834 and Bugs17/35/39/40/41/42/43); nineteen remain incomplete.
  Latest1,521-test pass and three-runtime installed results are intermediate,
  not final0.6 acceptance. Task835 has exact old-writer/event-enable reproductions
  but no source fix; task836 recovery is not started. Package stays0.5.2, main
  HEAD3820529 and protected bookends match. No staging/commits during this run.
  Checkpoint-only changes preserve all64non-mdkg dirty paths. Fresh Standard,
  independent diff, macOS/Linux artifact qualification, full ladder and seal are
  still mandatory. Goal85 remains paused. Resume only on explicit instruction.

- 2026-09-15: Bug43 exact changed-warning paths locally verified under chk615.
  All1,521 discovered tests and the three-runtime installed16-case matrix pass;
  candidate review found no blocking defect and coverage distinctions remain
  explicit. Native Git copies/renames, missing caches and global errors are
  preserved. Eleven owned fixture roots removed; package/logs retained. No commit,
  fresh security clearance, Linux pass, final seal or publication. Task835 next.

- 2026-09-15: Bug42 local closure binds authored cache inputs and archive admission,
  fixes both independently reproduced review findings and preserves explicit
  compression/no-reindex behavior. All1,515 source tests and three-runtime
  installed/APFS matrices pass; prior failed runs are retained and invalidated.
  Chk614 and bug-42-local-verification.json record exact bytes, cleanup and limits.
  Linux executor presence alone is not qualification. No staging, commit, scan,
  final seal or external publication; Bug43 remains next.

- 2026-09-15: Bug41 local acceptance covers helper execution, sanitized fail-closed
  observations and exact provenance across native Git topologies. Three reviewed
  hypotheses and the missing-HEAD question were reproduced and corrected; full
  source and all three installed runtime matrices pass. New Bug43 is planned,
  unclaimed and a mandatory prerequisite, not a waived regression. All final
  0.6.0 platform/security/ladder/seal gates remain. No commit or external action.

- 2026-09-15: Bug39's early command/type option contract passes1,463 full and126
  focused tests, complete CLI/docs/contract/workflow checks and three-runtime
  installed proof against one unchanged intermediate tarball. Both candidate
  review findings were reproduced and corrected. Thirteen initial full-suite
  failures were old diagnostic expectations or ignored unsupported fixture flags;
  the aligned tests retain their safety assertions and pass. Evidence is
  bug-39-local-verification.json. No scan, final0.6.0 qualification, Linux pass,
  seal, staging/commit or external action is inferred. Goal85 remains paused.

- 2026-09-15: Bug17 local verification completes the shared transport contract,
  candidate-review corrections and additional parent-reproduced representation
  gaps, including config-less private runtime admission. All118 focused and1,457
  discovered tests pass; the same223-file intermediate tarball passes22 installed
  cases on each Node24.15.0/24.18.0/26.0.0, installed bundle/subgraph/visibility
  smokes and separate built-source capability smoke. Evidence is
  bug-17-local-verification.json. Prior artifacts remain historical; final0.6.0,
  Linux, Standard, independent diff and full-ladder gates remain unqualified.
  Parent-workspace smoke setup now uses explicit graph-only init without event
  rewriting; independent-root re-aliasing is not qualified by those controls.

- 2026-09-15: Bug17 fresh portable contract, held-snapshot consumers and two
  parent-reproduced candidate-review fixes pass106 focused and1,445 full tests
  on Node24.18.0/macOS with unchanged source hashes. The new
  bug-17-portable-contract-progress.json preserves earlier receipts and explicitly
  leaves current installed, macOS/Linux final-artifact and security gates open.
  No source clearance, final seal, commit or publication is claimed.

- 2026-09-15: Bug17 intermediate remediation has67/67 current focused tests and
  a preceding95/95 broader run including288 observational Git cases. Five
  historical-consumer gaps and two temporary-name cleanup failures reproduced
  before their local corrections. Fresh public portable-state contract, remaining
  projection candidates, single candidate review and installed/final qualification
  remain open; Bug17 stays owned progress. Exact source hashes and limitations are
  in bug-17-transport-progress.json. Protected bookends and main HEAD unchanged;
  no staging, commit, scan or external action.

- 2026-09-15: Bug35/40 narrow source remedies pass 1,409 tests and the same
  installed tarball passes 288 Git-observation cases on each required runtime.
  Actual read-only APFS inventories and preview writes are preserved across36
  mounted variants. The wider semantic matrix nevertheless fails12 show/search
  checks because copied legacy caches hide current titles; new Bug42 owns this
  blocker after Bug41 and before finalized package inputs. No blanket mounted
  qualification, Linux pass, security clearance or final artifact seal is claimed.

- 2026-09-15: Current-source Bug35 reproduces 14 of16 index-custody failures;
  git inspect already passes. Four optional-lock helper corrections are under
  regression. Separate published0.5.2/current reproductions confirm Bug40 dry-run
  mutation locking and Bug41 configured-helper execution. Both are bounded
  functional blockers under this run and Goal84, not new Standard findings.
  Bug40 precedes completion of Bug35's absent-cache worktree regression; Bug41
  follows Bug39 and precedes writer compatibility/draft inputs. Final independent
  and installed platform gates must reverify both. No accepted product boundary changes.
- 2026-09-15: Explicit run accepted. Resumed this goal without selection mutation,
  claimed task-834, reverified 40-path custody, bound 1,855 source paths and 254
  package-input paths, checked 152 extraction payloads, and mapped 25 requirement
  groups plus 23 work contracts and 55 historical receipts. Release remains NOT_READY.
- 2026-09-13: Approved plan authored; no source fix, scan, test qualification,
  release metadata change, execution claim, staging, commit or publication.

# Skill Improvement Candidates

None. Reuse existing skills; no skill authoring or consumer-specific candidate.

# Completion Evidence

Current disposition: Bugs46/47 are DEFERRED / UNRESOLVED under Goal87, not
accepted or fixed. Chk653's SQLite/runtime and Chk654's portable recovery
milestones do not close Test489 or the final release gates. Pre-Dec98 blocker statements below are retained as
historical evidence and do not override the current scope at the top.

Chk623 and bug-46-investigation.json record a verified defect, NOT a remedy.
They retain the source-bound reproduction, native metadata evidence and the
architecture decision required before altering the pure-Node runtime contract.
Bug46 remains a publication blocker. This does not waive remaining independent
remedies, platform coverage, Task828, full ladder or exact artifact sealing.

Chk622 and bug-45-local-verification.json bind the transport-admission remedy:
complete path/ownership checks and configured cache-output admission precede
import writes; supported historical/private transport is retained. One fresh
candidate review exposed the derived-output route, which the parent reproduced
and corrected. Final154 focused tests and167 installed cases on each required
Node runtime pass on macOS arm64. Linux and final release gates remain open.

Chk620 binds completed fresh Standard coverage and fourteen confirmed findings;
this is not a clean security bill. Chk621 and bug-44-local-verification.json bind
the first new finding's local remedy, one candidate-review cycle with two
reproduced/corrected gaps,67 focused source tests and49 installed scenarios each
on Node24.15.0/24.18.0/26 macOS arm64. Remaining remedies, Linux, test488/Task828,
full ladder and final artifact qualification/seal remain open. Broad docs polish
is deferred; release-critical truth correction remains Task839. Goal85 stays paused.

Chk608 proves planning only; chk609 and the execution baseline prove task834's
accepted custody. Chk610 binds Bug35/40's local verification and Bug42's failing
qualification. Chk611 binds Bug17's local transport verification. Chk612 binds
Bug39's local option admission and intermediate installed verification. Chk613
binds Bug41 helper-free observations; chk614 binds Bug42 cache-content/archival
admission and intermediate installed verification. Chk615 binds Bug43 exact paths,
review and intermediate installed qualification. Chk617 binds Task835's explicit
writer fence, recovery custody, independent candidate review and intermediate
installed proof. Chk570 remains
incomplete. Chk618 binds Task836 interrupted-writer implementation; Task827's
local-verification receipt and chk619 bind draft0.6.0 metadata and release-critical guidance.
Final installed/platform/security and artifact acceptance remain
incomplete. No final artifact, Linux acceptance,
fresh security clearance or publication is claimed.
