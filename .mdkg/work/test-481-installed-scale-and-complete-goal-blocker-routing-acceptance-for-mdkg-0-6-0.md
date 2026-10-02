---
id: test-481
type: test
title: Installed scale and complete goal blocker-routing acceptance for mdkg 0.6.0
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-scale-goal.json, .mdkg/artifacts/goal-84/bug-7-nullable-read.json, .mdkg/artifacts/goal-84/bug-7-scale-identity-progress.json, .mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json, .mdkg/artifacts/goal-86/test-481-local-scale-qualification.json, .mdkg/artifacts/goal-86/test-481-installed-scale.cjs, .mdkg/artifacts/goal-86/test-487-docker-arm64-scale.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale-disposition.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale-partial.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale-retry.json, .mdkg/artifacts/goal-86/test-487-local-platform-composition.json, .mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/final-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json]
relates: []
blocked_by: [task-835, task-836, bug-35, task-827, task-839, task-838]
blocks: []
refs: [bug-7]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-595, chk-596]
aliases: []
skills: []
cases: [test-481-case-1, test-481-case-2, test-481-case-3, test-481-case-4, test-481-case-5]
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

2000-node/20000-event JSON/SQLite legacy/v2 warm/cold/history/routing. Original x86_64 600000ms JSON timeout preserved; one bounded900000ms JSON retry and remaining SQLite execution pass with unchanged assertions/size, no native performance claim.

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

2026-09-29 completed Linux case execution: the reviewed x86_64 SQLite-only
retry passes11 cases/239 commands in718362ms. SQLite v2 migration completed
in593517ms, with2010 persisted identities including2000 task identities,
2013 exact plan writes and unchanged20000-event history. Default input bounds,
the2049-commit refusal and all four goal-routing combinations pass unchanged.
Compose four earlier JSON rows with these11 rows for15 unique cases; do not
double-count two prior SQLite legacy rows. Native ARM64 and macOS each already
have a complete15-row pass. Candidate/package bytes remain unchanged.

The original timeout and both harness identities remain preserved in the
platform composition and retry receipts. This completes recorded platform
case execution, not independent security acceptance, the full ladder or final
artifact sealing. Earlier failed/incomplete statements below describe the first
attempt. No product timeout, support limit or performance target was changed.

2026-09-29 Test487 continuation: the identical6154e4ea installed package passes
all15 scale/history/goal-routing cases and266 commands on native Linux ARM64,
Ubuntu24.04.4 userspace/ext4 fixture volume, Node24.18.0. Total416153ms;
the two2000-task migrations took186076ms and191554ms. These are local
observations, not a new SLA.

The Rosetta-emulated Linux x86_64 family is failed/incomplete. Six scale rows
completed (JSON legacy/v2 warm/cold and SQLite legacy warm/cold); JSON migration
took574818ms, then SQLite migration timed out at600064ms against the existing
600000ms allowance. Remaining SQLite v2, bound/history and goal-routing rows
were not executed. Preserve this failure; no automatic timeout increase,
smaller graph, performance redesign or compatibility waiver is authorized by
the receipt. Exact source/output hashes and limitations live in the linked
Test487 Docker scale receipts and failure disposition. This test stays open.

Follow-up within the approved local qualification scope: source review confirmed
that the timeout is only a bounded harness guard. One reviewed Linux x86_64
retry now permits900000ms per command, leaves the helper default180000ms and
all product assertions unchanged, and selects SQLite scale plus the unexecuted
bound/history/all-backend goal-routing cases. Eighteen focused harness tests
pass. Require the actual11-row result and unchanged artifact/custody checks;
compose it with four previously completed JSON rows, not a manufactured15-row
rerun. The old600000ms failure remains historical evidence even if this passes.

2026-09-28 current-candidate milestone: all15 existing cases and266 commands pass
on native macOS arm64, Node24.18.0, retained6154e4ea bytes. This includes2000
cross-linked tasks/20000 events in each JSON/SQLite graph, legacy/v2 and warm/cold
reads, exact persisted migration identities/event preservation, default input
ceilings, the2049-commit history refusal, and complete goal/checkpoint/blocker
routing. Candidate, package inputs, installed inventory and harness bookends
match; all owned fixtures were removed. Duration888805ms; migration applications
took424975ms and420502ms. These are measurements within the existing600000ms
per-command qualification allowance, not a product SLA or a redesigned limit.
Remaining Linux/platform acceptance and later review/ladder/seal are still open.
Evidence: `.mdkg/artifacts/goal-86/test-481-local-scale-qualification.json`.

Run the existing representative2000-node correctness and complete goal/checkpoint/blocker routing on current bytes. No new performance SLA or transaction redesign. This test precedes Task826; later review/ladder/seal records consume it, not vice versa.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

Representative scale and complete goal/checkpoint/blocker routing; preserve measured allowances, custody and event-history checks without new arbitrary limits. Large transaction redesign remains later work.

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

Qualify installed scale and complete goal blocker-routing acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Representative large graphs with recorded sizes and bounded history thresholds.
2. Clear fail-closed limits without lowering existing safety budgets.
3. Complete task/goal execution with checkpoints, blocker-goal verification and publication routing.
4. Publication remains blocked until both completed audit checkpoint and blocker verification task.
5. Goal done/evaluate alone cannot satisfy artifact identity or publication authority.

# Results / Evidence

Current bounded result: chk-596 records 45 strengthened installed cases across
Node 24.15.0, 24.18.0 and 26.0.0, with 2000 tasks per large graph. All five case
areas have representative evidence in
.mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json. This node remains
open for task826 and final independent acceptance; no missing runtime,
interrupted case or source-only assertion is counted as a pass. Earlier partial
results below are retained as investigation history, not current acceptance.

2026-09-09 partial execution supersedes the initial not-executed placeholder:
scripts/installed-scale-goal.js has 15 passing 100-node control cases on all three
required runtimes. Cases 3-5 have installed legacy/v2 and JSON/SQLite evidence;
case 2 has default per-node/event-line and actual history-limit refusal controls.
Case 1 remains incomplete: 2000-node migration applications timed out at the
explicit 180-second harness bound, including an isolated Node26 run. This is not
a declared product SLA. The four partial fixtures/journals are retained and the
cost investigation stays under bug-7. Do not count these incomplete runs as full
scale acceptance or complete this aggregate node before task-826 and final review.
Evidence: .mdkg/artifacts/goal-84/bug-7-scale-goal.json.

2026-09-09 further evidence: the earlier full-size harness passes on Node24.15.0
and24.18.0, but read-only review identified missing explicit v2 identity and
event-history preservation assertions. The strengthened installed100-task
control passes15 cases/266 commands, including those assertions against public
CLI plan hashes and persisted graph state. All three strengthened2000-task
runtimes remain pending; the smaller control does not satisfy case1. Artifact:
.mdkg/artifacts/goal-84/bug-7-scale-identity-progress.json. The full ordinary suite
passes1383 and independent bounded review has no remaining finding. This does
not complete task826, test481, final security review or release qualification.

# Notes / Follow-ups

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
