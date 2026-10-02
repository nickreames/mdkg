---
id: test-482
type: test
title: Installed Node 24.15.0 supported 24 and Node 26 acceptance for mdkg 0.6.0
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-scale-goal.json, .mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json, .mdkg/artifacts/goal-84/bug-7-init-discovery.json, .mdkg/artifacts/goal-84/bug-7-stale-upgrade.json, .mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json, .mdkg/artifacts/goal-84/bug-7-installed-security-regressions.json, .mdkg/artifacts/goal-86/test-480-old-client-runtime-qualification.json, .mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/final-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json]
relates: []
blocked_by: [test-477, test-478, test-479, test-480, test-481, test-483, test-484, test-486, task-839, task-838]
blocks: []
refs: [bug-7, chk-665]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-596, chk-600]
aliases: []
skills: []
cases: [test-482-case-1, test-482-case-2, test-482-case-3, test-482-case-4, test-482-case-5]
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

Exact supported/minimum24.18.0 counted once per platform; actual24.15.0/26.0.0 refuse graph/DB/MCP without effects, help/version remain usable; missing capabilities refuse; verified isolated downloads.

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

2026-09-29 Test480 supplies actual native macOS24.15.0/26.0.0 early refusal
controls on retained6154e4ea bytes (four graph-operation refusals and two
help/version positives per unsupported runtime). Complete graph inventories
remain unchanged. Supported Node24.18.0 is both the minimum and available
supported local runtime and is counted once across installed family receipts.
Official runtime/package hashes and owned cleanup are bound in
`.mdkg/artifacts/goal-86/test-480-old-client-runtime-qualification.json`.
Linux matrix and complete family aggregation remain open; this test stays backlog.

Aggregate supported24.18.0/selected24 successes, counting identical runtimes once. Node24.15 and26 are unsupported: require early no-effect refusal, not successful families. This supersedes old title/body matrix; Test487 owns platform completeness.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

Aggregate exact Node24.15.0, selected supported24 and26 receipts after family cases. No missing runtime, package mismatch, source import or partial execution is a pass.

This test no longer waits for task826 or Bug7 aggregate closure. Its updated
implementation prerequisites lead into installed cases; task826 consumes the
results. Record historical/current-intermediate/final-artifact-pass/failure/
unverified states. Final qualification uses one frozen0.6.0 tarball; macOS/Linux
completeness is independently bound by test487. Task828 remains independent
acceptance, not an upstream requirement for these test results.

Current case 3 supersedes the historical Node 26 smoke-only wording below.
All required installed test families must pass on Node 24.15.0, the selected
supported Node 24 runtime, and Node 26, on both macOS and Linux. Record each
exact runtime version and platform, the same tarball hash, and case-level
coverage; smoke-only or incomplete Node 26 results remain unverified.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Qualify installed node 24.15.0 supported 24 and node 26 acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Installed exact Node 24.15.0 candidate qualification.
2. Available supported Node 24 line with exact executable/version receipt.
3. Node 26 compatibility smoke with exact version.
4. Missing runtime is an evidence gap, never presumed pass.
5. Isolated caches/config and unauthenticated public runtime downloads only.

# Results / Evidence

Current scale-family result: chk-596 records 15 strengthened 2000-task cases and
266 commands on each exact runtime: Node 24.15.0, 24.18.0 and 26.0.0. Receipt and
package hashes are in .mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json.
All required runtimes were available; no missing or interrupted execution is a
pass. The complete task826 family/runtime matrix and final acceptance remain
open. Earlier partial scale evidence below is retained as history.

Chk-597 additionally binds eight installed init/discovery groups and 77 commands
per exact runtime, with current intermediate package and executable hashes.
All three final runs pass custody checks. The earlier Node24.15 run overlapped
an owned build and failed custody; it is explicitly excluded rather than counted
as a pass or product failure. Remaining family/final-artifact gaps are mapped in
the linked bug-7-init-discovery artifact; aggregate status remains open.

2026-09-09 additional partial runtime proof: 15 installed scale/lifecycle controls
pass on exact Node 24.15.0, 24.18.0 and 26.0.0. The larger 2000-node runs are
incomplete, not runtime passes. Evidence and precise exclusions are recorded in
.mdkg/artifacts/goal-84/bug-7-scale-goal.json; full task-826 matrix remains open.

# Notes / Follow-ups

Chk598 and chk599 add final three-runtime stale-upgrade and mixed-state/graph
recovery proof on the current intermediate candidate. Chk599 includes277commands
per runtime with exact executable/package hashes and matching custody bookends.
No required runtime is missing for these families. Final0.6.0 matrix acceptance,
unresolved policy/coverage gates and the full release ladder remain open.

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
