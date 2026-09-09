---
id: test-482
type: test
title: Installed Node 24.15.0 supported 24 and Node 26 acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-scale-goal.json, .mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json]
relates: []
blocked_by: [task-826]
blocks: []
refs: [bug-7, chk-596]
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
cases: [test-482-case-1, test-482-case-2, test-482-case-3, test-482-case-4, test-482-case-5]
created: 2026-09-07
updated: 2026-09-09
---

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

2026-09-09 additional partial runtime proof: 15 installed scale/lifecycle controls
pass on exact Node 24.15.0, 24.18.0 and 26.0.0. The larger 2000-node runs are
incomplete, not runtime passes. Evidence and precise exclusions are recorded in
.mdkg/artifacts/goal-84/bug-7-scale-goal.json; full task-826 matrix remains open.

# Notes / Follow-ups

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
