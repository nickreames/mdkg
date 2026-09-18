---
id: test-479
type: test
title: Installed ownership containment and recovery acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json, .mdkg/artifacts/goal-84/bug-7-installed-security-regressions.json, .mdkg/artifacts/goal-86/bug-17-local-verification.json]
relates: []
blocked_by: [bug-17, bug-35, bug-39, task-836, task-827, bug-40, bug-41]
blocks: []
refs: []
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-600]
aliases: []
skills: []
cases: [test-479-case-1, test-479-case-2, test-479-case-3, test-479-case-4, test-479-case-5]
created: 2026-09-07
updated: 2026-09-15
---

# Current Successor Contract - 2026-09-13

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
