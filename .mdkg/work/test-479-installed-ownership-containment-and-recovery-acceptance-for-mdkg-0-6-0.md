---
id: test-479
type: test
title: Installed ownership containment and recovery acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json]
relates: []
blocked_by: [task-826]
blocks: []
refs: []
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
cases: [test-479-case-1, test-479-case-2, test-479-case-3, test-479-case-4, test-479-case-5]
created: 2026-09-07
updated: 2026-09-11
---

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

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
