---
id: task-828
type: task
title: Independently verify all mdkg 0.6.0 publication blocker fixes
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json, .mdkg/artifacts/goal-86/current-security-audit-20260929.json, .mdkg/artifacts/goal-86/independent-diff-review-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-package-gates-20260930.json, .mdkg/artifacts/goal-86/successor-private-preview-20260930.json]
relates: []
blocked_by: [bug-5, bug-6, bug-7, bug-8, bug-9, bug-10, bug-11, bug-12, bug-13, bug-14, bug-15, bug-16, bug-17, bug-18, bug-19, bug-20, task-826, task-827, bug-21, bug-22, bug-23, bug-24, bug-25, test-483, bug-26, bug-27, bug-28, bug-29, bug-30, bug-31, bug-32, bug-33, bug-34, bug-35, bug-36, bug-37, test-484, bug-38, test-485, bug-39, test-486, task-837, test-487, bug-40, bug-41, bug-42, bug-43, bug-44, bug-45, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60, task-838, task-839, test-488, task-841, task-842, test-489, bug-61, test-490, bug-62, bug-63, bug-64, bug-65, bug-66, bug-67, bug-68, bug-69, test-491, test-492, bug-70, bug-71, bug-72, test-493, bug-73]
blocks: []
refs: [dec-95, edd-82, task-833, chk-624, dec-98, goal-87, chk-660, dec-99, dec-100, chk-667]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-30
---

# Current accepted package closeout contract - 2026-09-28 Dec100

Require fresh independent frozen-current-source and complete remediation-diff reviews, source/report/input hashes, coverage/exclusions and retained regressions. Include Task843 release-chain changes. Dec99 forbids accessing/recovering/rerunning blocked historical context. Account for12 in-scope remedies and2 unresolved deferrals, not14 fixes. Missing required current coverage remains blocking.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

## Current evidence contract - 2026-09-28 Dec99

Nick approved fresh independent frozen-current-source and complete
remediation-diff review, retained finding/disposition records and installed
regressions as the final evidence contract. Explicitly document unavailable
original reports; do not recover, rerun or inspect blocked historical context.
The recovery/report-availability prerequisites below are superseded only to
that extent. Historical Task837 completion is not current-source clearance.
Require source-backed current coverage, exclusions, exact source/diff/artifact
hashes and canonical new report evidence; failed/incomplete required coverage
still blocks. This update launches no scan and keeps this task backlog.

2026-09-28 Dec98 scope amendment: Bugs46/47 remain DEFERRED and unresolved in
paused Goal87. This review must verify their accurate disposition, retained
evidence and public limitation wording, not require or claim their remediation
for 0.6.0. Preserve all fourteen original findings (five medium, nine low): two
deferred findings are not two verified fixes. All other in-scope findings and
new Tasks841/842/Test489 remain required. Review the final portable SQLite and
explicit-recovery contracts and exact supported Node range. No native helper
or quiet restoration of OS-dependent behavior is permitted.

The earlier ACL/ancestor-swap remediation requirement is superseded only by
this explicit version-specific deferral; all other acceptance remains. Nick's
no-recovery/no-rerun direction for blocked historical scan context still
applies. Current-source independent acceptance remains unverified; this
planning update launches no scan and grants no publication authority.

Require fresh task837 Standard coverage plus all local blocker fixes and
test487 macOS/Linux results. Independently review the complete remediation range
from the recorded original audit source through the frozen final candidate,
including deleted code and supporting behavior. Do not substitute Bug37's local
functional review or original task825 for this independent workflow. Resolve the
ancestor-directory swap and ACL/ownership limitations with source/platform evidence;
documentation alone cannot waive an in-scope defect. Failed/incomplete scans block.
Route fresh findings without creating a dependency on their own verification;
implementation-local closure and this final independent acceptance are distinct.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Goal: Independent verification of every publication blocker and exact remediation diff.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

2026-09-21 user direction supersedes the historical recovery proposal below:
use retained mdkg findings and evidence for remediation; do not access blocked
context, recover old scan artifacts or rerun the blocked historical findings.
Record provenance limits honestly. This does not turn intermediate tests into
final acceptance or waive current-source independent verification; do not launch
any new scan merely to repair old evidence availability. Continue source fixes
and their local regressions under Goal86 without requesting recovery again.

Chk624 adds an explicit evidence-availability gate: the recorded Task837
canonical report, manifest, findings and coverage files are inaccessible at
their stored paths in the current environment. Historical completion remains
recorded, but a sanitized summary/hash cannot substitute for the reports this
acceptance must inspect. Recover originals and verify exact hashes, or preserve
the loss and supersede the missing qualification through a fresh authorized
workflow on a frozen candidate. Do not fabricate original bodies, silently
re-finalize the sealed scan, or mark this gate passed from chat history.

The live workbench retains all14 findings but reports reportAvailable=false and
disables built-in remediation because current HEAD differs from the scanned
e42f1d9 revision. Do not reset current main or pretend the historical scan covers
new source. Bind the planned final review to a fresh frozen target; preserve
historical scan identities and distinguish current local fixes from workbench
remediation state. Reading the old scan context is not a new scan or approval.

Require every bug in goal-84 fixed with failing-before/passing-after regression and affected-version assessment. Run a separate Codex Security diff workflow on the exact fix range after writers freeze it. Validate realistic consumers and dependency routing. Missing security coverage, failed tests, data loss or unresolved decisions keep this task incomplete. No automatic risk waivers.

# Files Affected

Read exact fix range and supporting code; write sanitized verification evidence only unless a newly validated bounded bug is explicitly routed first.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Independent diff report/hash, complete regression matrix, no unresolved publication-blocking finding and exact source range.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.

## Required Limitation Review

Bug-13 verification confirms an active concurrent ancestor-swap race in the
shared path authority, distinct from the fixed static-input unbounded-read
finding. Review the single-writer/static-checkout guarantee and public wording;
do not claim portable openat race immunity. Bug-20 also leaves extended ACL and
ownership metadata preservation unqualified. Independently assess both during
final platform/security qualification; no automatic release waiver is allowed.
