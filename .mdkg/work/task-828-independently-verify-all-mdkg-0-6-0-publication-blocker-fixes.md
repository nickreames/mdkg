---
id: task-828
type: task
title: Independently verify all mdkg 0.6.0 publication blocker fixes
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [bug-5, bug-6, bug-7, bug-8, bug-9, bug-10, bug-11, bug-12, bug-13, bug-14, bug-15, bug-16, bug-17, bug-18, bug-19, bug-20, task-826, task-827, bug-21, bug-22, bug-23, bug-24, bug-25, test-483, bug-26, bug-27, bug-28, bug-29, bug-30, bug-31, bug-32, bug-33, bug-34, bug-35, bug-36, bug-37, test-484, bug-38, test-485, bug-39, test-486, task-837, test-487, bug-40, bug-41, bug-42, bug-43, bug-44, bug-45, bug-46, bug-47, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60, task-838, task-839, test-488]
blocks: []
refs: [dec-95, edd-82, task-833]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-17
---

# Current Successor Contract - 2026-09-13

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
