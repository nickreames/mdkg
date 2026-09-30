---
id: test-477
type: test
title: Installed initialization and real 0.5.2 upgrade acceptance for mdkg 0.6.0
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-init-discovery.json, .mdkg/artifacts/goal-84/bug-7-recovery-runtime.json, .mdkg/artifacts/goal-84/bug-7-stale-upgrade.json, .mdkg/artifacts/goal-86/bug-17-local-verification.json, .mdkg/artifacts/goal-86/test-477-local-bootstrap-qualification.json, .mdkg/artifacts/goal-86/test-477-installed-bootstrap.cjs, .mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/final-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json]
relates: []
blocked_by: [task-835, task-836, task-827, task-839, task-838]
blocks: []
refs: [chk-658, dec-98]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
cases: [test-477-case-1, test-477-case-2, test-477-case-3, test-477-case-4, test-477-case-5]
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

All retained bootstrap cases pass against the exact f7cbdc1d tarball on native
macOS ARM64 and Ubuntu24 ARM64/native and x86_64/emulated. This includes the
recorded published0.5.2 upgrade, default compact/graph-only/--agent behavior,
custom user instructions/project documents, repeated/stale/interrupted
upgrade, native skill mirrors/resource links and recovery. Exact source,
artifact and platform receipts are bound by final-installed-family-case-
acceptance-20260930.json and final-installed-platform-qualification-20260930.json
under `.mdkg/artifacts/goal-86/`. Earlier candidates remain historical.
Functional family completion is not Task828 security clearance, Task830
sealing or Goal85 publication authority. No canonical upgrade was applied.

# Current accepted package closeout contract - 2026-09-28 Dec100

Reuse Chk658 current6154e4ea macOS compact/default/graph-only/--agent and actual pinned0.5.2 standard/customized upgrade, authored docs/skills/staging and sampled recovery proof. Missing: required Linux rows and final case acceptance.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

2026-09-28 execution amendment under Dec98: supported Node24.18.0 and the
approved24.x capability contract replace historical24.15/26 support assertions.
Goal: qualify current installed bootstrap/upgrade behavior on retained candidate
bytes. Context: main6d23981e,157 preserved dirty paths, Test486 local milestone
and an exact cached published0.5.2 tarball verified by pinned size/SHA256/SHA512.
Boundaries: existing installed smoke entrypoints, owned local fixture/harness and
sanitized mdkg evidence only; no download, canonical Git mutation, source feature,
blocked-context access or publication. Done when the local bootstrap, actual
published upgrade and interruption cases pass with preserved candidate/protected
bytes and exact coverage limits. Retain the candidate for later consumers;
retention is not Task830 sealing, final-platform acceptance or completion here.
Evidence: installed smoke receipts, artifact delivery/consumption hashes,
source-input bookends, customization/staging controls and owned cleanup.

Actual0.5.2 upgrades, compact defaults, graph-only/--agent, customized instructions/docs/skills and repeated/stale/interrupted/recovered upgrade cases.

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

Qualify installed initialization and real 0.5.2 upgrade acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Actual published 0.5.2 tarball integrity and installed upgrade, not a mock legacy seed.
2. Default compact init, --graph-only and --agent compatibility.
3. Customized AGENTS/CLAUDE and project README/LICENSE preserved.
4. Repeated preview/apply, stale plan, interrupted upgrade and recovery.
5. Native skill mirrors, resource links and rollback compatibility.

# Results / Evidence

2026-09-28 current local milestone, Chk658: retained candidate SHA256
6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca passes
the existing installed init/upgrade smokes on Node24.18.0/macOS arm64. Exact
published0.5.2 standard/customized upgrades use the pinned local cached archive,
without a download. Seven current-upgrade cases and six caught-error
first/middle/last resume/recover cases pass with user content, unknown files,
native skill projections and Git staging preserved. The six cases are not
abrupt-death proof. Final rerun reused the retained tarball without repacking;
candidate, source-input capture and all273 source inputs match before/after.
Both runner review corrections and the initial harness-only failure are retained
in the sanitized receipt. This is current-intermediate evidence, not final
macOS/Linux, independent acceptance or Task830 sealing; this test stays progress.

Partial installed evidence exists; this aggregate remains open. Chk-597 binds
fresh default/explicit-agent/graph-only initialization, customized root/project
documents, focused skill discovery and complete canonical/native resource
preservation on Node 24.15.0, 24.18.0 and 26.0.0. This supports cases 2/3 and the
discovery portion of case 5 on the current intermediate candidate.

The linked bug-7-recovery-runtime artifact already records actual published
0.5.2 standard/customized upgrades and caught-error upgrade recovery on all
three runtimes, supporting cases 1/3 and portions of 4/5 on an older candidate.
Do not repeat those as never executed or infer final-candidate freshness.
Chk598 now verifies installed fresh preview -> user edit -> stale apply refusal
and fresh-plan edited-wrapper resume/rollback on all three runtimes, using the
current intermediate candidate. This closes that case4 gap and strengthens
cases1/3/5 with18actual published-upgrade/recovery cases. Still required:
final-candidate upgrade/recovery reruns and independent aggregate acceptance.
No interrupted, missing-runtime or source-only assertion is counted as a pass.

# Notes / Follow-ups

2026-09-15 bootstrap qualification observation, bound in
`.mdkg/artifacts/goal-86/bug-17-local-verification.json`: compact default init emits
root-scoped history. Registering that independently initialized child as a mutable
parent workspace and then writing parent-scoped events produces a scope-validation
failure. Published0.5.2 bare init and current explicit graph-only setup pass the
original parent-workspace control without deleting or relabeling history.
The bundle/capability smoke fixtures now state that setup explicitly; this is not
proof of independent graph re-aliasing. Reverify the documented setup and diagnose
any required unsupported transition during final bootstrap qualification, alongside
task827's guidance. No new federation or event-history migration is authorized.

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
