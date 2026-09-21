---
id: test-482
type: test
title: Installed Node 24.15.0 supported 24 and Node 26 acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-scale-goal.json, .mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json, .mdkg/artifacts/goal-84/bug-7-init-discovery.json, .mdkg/artifacts/goal-84/bug-7-stale-upgrade.json, .mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json, .mdkg/artifacts/goal-84/bug-7-installed-security-regressions.json]
relates: []
blocked_by: [test-477, test-478, test-479, test-480, test-481, test-483, test-484, test-486, task-839, task-838]
blocks: []
refs: [bug-7]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-596, chk-600]
aliases: []
skills: []
cases: [test-482-case-1, test-482-case-2, test-482-case-3, test-482-case-4, test-482-case-5]
created: 2026-09-07
updated: 2026-09-17
---

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
