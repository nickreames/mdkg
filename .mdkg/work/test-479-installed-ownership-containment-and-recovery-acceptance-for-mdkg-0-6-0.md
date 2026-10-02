---
id: test-479
type: test
title: Installed ownership containment and recovery acceptance for mdkg 0.6.0
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json, .mdkg/artifacts/goal-84/bug-7-installed-security-regressions.json, .mdkg/artifacts/goal-86/bug-17-local-verification.json, .mdkg/artifacts/goal-86/test-479-local-ownership-qualification.json, .mdkg/artifacts/goal-86/test-479-installed-ownership.cjs, .mdkg/artifacts/goal-86/test-479-state-admission.cjs, .mdkg/artifacts/goal-86/test-479-local-containment-qualification.json, .mdkg/artifacts/goal-86/test-479-real-readonly-qualification.json, .mdkg/artifacts/goal-86/test-479-installed-containment.cjs, .mdkg/artifacts/goal-86/test-479-readonly-filesystem.cjs, .mdkg/artifacts/goal-86/test-479-local-remedies-qualification.json, .mdkg/artifacts/goal-86/test-479-installed-remedies.cjs, .mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/final-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json]
relates: []
blocked_by: [bug-17, bug-35, bug-39, task-836, task-827, bug-40, bug-41, task-839, task-838]
blocks: []
refs: [chk-661]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-600]
aliases: []
skills: []
cases: [test-479-case-1, test-479-case-2, test-479-case-3, test-479-case-4, test-479-case-5]
created: 2026-09-07
updated: 2026-09-30
---

# Current sealed successor acceptance - 2026-09-30

This record's final acceptance now consumes b5497c5f5e5f022e candidate bytes
at source b10870355b264355af2be4fc53bb4640851f747b, not the earlier f7/6154
candidate. The successor-installed-case-acceptance and successor-installed-platform-
qualification receipts bind this QID's actual bounded cases, three exact platforms,
source/package/harness hashes and limitations. The exact artifact is sealed in
candidate-seal-20260930.json; Chk570 records complete local acceptance.

All20 retained installed families are accounted on native macOS ARM64 and Ubuntu24
ARM64-native/x86_64-emulated; minimum/supported Node24.18.0 operation is counted
once, with actual24.15/26 early refusal/discovery controls. No Windows, native x64
performance, hosted/website or consumer-adoption proof is claimed. Earlier failures
and intermediate passes below remain historical and are not relabeled. Bugs46/47
remain deferred/unresolved. Goal85 remains paused; no publication authority follows.

# Historical family contracts and intermediate candidate evidence


# Final installed family acceptance - 2026-09-30

Bounded security regressions, path/type/link/special/size/receipt admission; stale plans and killed-writer/rollback/resume; unknown sentinels/staging preserved; transport excludes execution authority; real read-only behavior. Bugs46/47 deferred unresolved, not passed.

The retained f7cbdc1d tarball passes all amended package cases on native macOS
ARM64 and Ubuntu24 ARM64/native and x86_64/emulated. Exact SHA256/SHA512,
package inputs, case ownership and platform/failed-run/supplement provenance are
recorded in `.mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json`
and `final-installed-platform-qualification-20260930.json` in that directory.
Earlier candidates remain historical. Bugs46/47 are deferred/unresolved, not
fixed or accepted. Windows/hosted CI and native-x64 performance are unqualified.
Family completion is not Task828 independent security acceptance, Task830 seal
or publication authority. No package input or protected canonical state changed.

# Current accepted package closeout contract - 2026-09-28 Dec100

2026-09-29 retained-candidate remedy supplement:456 Node test cases and167
transport-admission cases pass (623 total). Bugs45 and52-60 are covered by
the existing shipped-module/CLI regressions; canonical production imports are
refused by the runner. This is mixed public-CLI and installed internal-module
proof, not623 findings or independent security acceptance. The twelve in-scope
original findings now each have a current native-macOS regression family when
combined with the containment receipt below. Bugs46/47 remain deferred and
unresolved, and later Bugs58-60 remain separate from the original14 accounting.
Evidence: `.mdkg/artifacts/goal-86/test-479-local-remedies-qualification.json`
(sha2567219c0170a68058a15d9a7a364707e56de06bbb562da68274f43ee7f9b3cbb1f).
Duration177274ms; exact installed/package/harness identities and owned cleanup
passed. Remaining Linux rows, case-level aggregate review and independent
Task828 acceptance remain required. No blocked report/context was accessed.

2026-09-28 retained6154e4ea macOS supplement:203 existing cases pass across
Bug44 provenance49, Bug48 bounded-source/ZIP/MCP30, Bug49 registry19, Bug50
snapshot-verification26 and Bug51 snapshot-containment79. CLI/MCP behavior uses
installed bytes; the installed ZIP codec only constructs/inspects synthetic
fixtures. This covers five finding families, not all fourteen original findings.

The real HFS+ read-only UDRO image adds46 passing legacy/v2 and JSON/SQLite
observations and refused mutations. The write probe returned EROFS; the image
was detached and removed. Protected/candidate/package/harness inventories match.
The restricted disk-image failure and an unsupported fixture next --json call
are retained separately; neither is counted as passing qualification or a
product defect. The containment receipt was repeated once after tool-output
truncation;203 cases are counted once. No blocked scan context was accessed.

Evidence: test-479-local-containment-qualification.json and
test-479-real-readonly-qualification.json under `.mdkg/artifacts/goal-86/`.
Remaining case-level aggregate review, Linux ARM64/x86_64 rows, independent
acceptance, full ladder and seal remain open. This is not aggregate completion.

Reuse49 current6154e4ea selected transport/state/recovery rows on macOS (Chk661) and Linux ARM64 (Chk662). The supplements above complete native macOS read-only-volume and current per-finding regression coverage. Missing: Linux read-only/platform rows and case-level aggregate/independent acceptance; no deferred Bug46/47 hardening prerequisite.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

2026-09-28 current local execution: Goal is to qualify remaining ownership,
transport and sampled recovery behavior against the retained6154e4ea installed
candidate. Context: main6d23981e,174 preserved dirty paths, no staging/lock,
unchanged protected bookends and the separately bound Bug61 qualification
amendment. Owner:mdkg-project-agent, sole writer under Goal86. Boundaries:
private controlled fixtures, existing qualification helpers, sanitized mdkg
evidence and required projections; no canonical migration/bundle, remote,
provider, native helper or blocked scan context. Done when this local tranche
has exact case/input/runtime evidence and remaining aggregate gaps are explicit,
not when intermediate checks are relabeled final acceptance. Evidence: installed
CLI calls, complete refusal inventories, exact Git-index/user-byte controls,
unchanged package/source inputs and owned cleanup. Use selective existing
transport-state and graph-recovery families first; reuse distinct current
Test478 SIGKILL proof, not older different-tarball evidence as a final pass.

2026-09-28 Dec98 amendment: Task841's portable, explicit operator-confirmed
quiescence and exact evidence contract supersedes OS-derived orphan proof.
The Task839 prerequisite already routes through Tasks841/842; Test489 adds
dedicated installed controls without depending on this aggregate. Bugs46/47
remain deferred/unresolved under Goal87, with their disposition recorded, not
passing security regressions. Retain all other containment/refusal checks.

Live runtime exclusion/private portability, real read-only filesystems, malformed/symlink/path attacks, abrupt termination and exact evidence-bound recovery; include ancestor-swap and ACL/ownership disposition without implicit waiver.

This test no longer waits for task826 or Bug7 aggregate closure. Its updated
implementation prerequisites lead into installed cases; task826 consumes the
results. Record historical/current-intermediate/final-artifact-pass/failure/
unverified states. Final qualification uses one frozen0.6.0 tarball; macOS/Linux
completeness is independently bound by test487. Task828 remains independent
acceptance, not an upstream requirement for these test results.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Qualify installed ownership containment and recovery acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Every security bug has a failing-before/passing-after synthetic regression.
2. Symlink, traversal, malformed receipt and oversized/special input attacks fail closed.
3. Interrupted writes, resume/rollback and changed dependencies preserve unknown sentinels.
4. Stale plans reject without writes; original Git index remains byte-identical.
5. Runtime/selection state never becomes portable acceptance authority.

# Results / Evidence

2026-09-28 Chk661 adds49 passing current-intermediate scenario rows on retained
6154e4ea bytes:22 portable/malformed-policy cases,12 sampled caught-error
migration/reconciliation recovery combinations,9 actual SQLite-runtime/leased
queue/selected-goal transport and private-checkpoint scenarios, and6 live/
suspended/ambiguous/unknown-entry/opposite-recovery controls. Inputs and installed
package inventories stayed unchanged. Exact drivers, source capture, timings,
case rows, corrected harness attempt and limits are bound in
`.mdkg/artifacts/goal-86/test-479-local-ownership-qualification.json`.

The real-state supplement closes the synthetic-marker-only evidence gap for
immediate import behavior. It does not prove later explicit DB restoration or
external execution authority. Chk660's actual SIGKILL linked-topology proof uses
the same bytes and is separately reused, not double-counted. Chk655/Test489 used
different9b312e91 bytes. Full current per-finding/containment and actual read-only
filesystem coverage, macOS/Linux final acceptance, independent review, full
ladder and seal remain open. Test479 remains progress. Bugs46/47 remain deferred
and unresolved under Goal87; no native helper or security waiver is inferred.

2026-09-15 current-intermediate transport evidence:
`.mdkg/artifacts/goal-86/bug-17-local-verification.json` binds22 installed CLI-only
scenarios on each required Node runtime against one immutable223-file artifact.
The original live-state inclusion and candidate-only consumer bypasses have
failing-before/passing-after evidence, complete refusal inventories and positive
private-checkpoint controls. Config-less private declarations cannot relabel
conventional runtime state; source replacement after registration also refuses.
Installed bundle/subgraph/visibility smokes pass; capability smoke is separately
identified as built-source. These support Bug17's local implementation closure,
not this aggregate's final-artifact, Linux, recovery or independent-review gates.

Partial case-level proof exists; this aggregate is not complete. Chk599 reruns
36installed graph recovery cases on the current intermediate candidate after
the transaction read optimization, across all three required runtimes. This
supports cases3/4: first/middle/last migration/reconciliation interruptions,
resume/rollback, interrupted rollback, changed user/dependency/control refusal,
unchanged staged index and observational terminal replay. The branch fixture
also preserves stale-plan refusal and immutable external evidence.

Cases1/2/5 require complete per-finding installed evidence aggregation, bug17
completion and final independent review. Killed-writer/abandoned-lock recovery
is explicitly not established by caught exceptions. No final artifact or
automatic compatibility waiver is inferred. Raw evidence is hash-bound through
.mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json and chk599.

# Notes / Follow-ups

Chk600 adds current installed primary regression coverage for cases1/2 across
all twelve locally fixed original findings, on all three required runtimes.
Its per-finding map retains original failing-before evidence and clearly marks
public CLI versus shipped internal-module scope. The shared suite total is
876passing executions,not876security findings. Case5/Bug17, actual read-only
mounts, killed writers and final independent review remain incomplete. No
aggregate closure or release waiver is implied.

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
