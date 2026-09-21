---
id: test-478
type: test
title: Installed offline branch identity and semantic integration acceptance for mdkg 0.6.0
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
cases: [test-478-case-1, test-478-case-2, test-478-case-3, test-478-case-4, test-478-case-5]
created: 2026-09-07
updated: 2026-09-11
---

# Overview

Qualify installed offline branch identity and semantic integration acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Two offline local branches create colliding numeric aliases and cross-linked stable identities.
2. Ordinary commands work on uncommitted, staged and unstaged authored nodes.
3. Different identities remap deterministically; same-identity changes use real ancestry.
4. Lifecycle/evidence conflict, delete/modify, repeated integration and explicit reintroduction.
5. Cherry-pick/revert and newer ancestry preserve immutable external receipt bytes.

# Results / Evidence

Cases1-5 have current intermediate installed evidence in chk599 across
Node24.15.0,24.18.0,26.0.0. Existing natural alias collision/cross-links,
deterministic mapping, same-identity decisions, deletion/evidence conflicts,
repeat integration, cherry-pick/revert/reintroduction and external receipts pass.
Case2 now also uses a genuinely tracked node with distinct HEAD/staged/working
versions: stale SQLite metadata reads observe manual edits, full-body show/pack
and ordinary mutation preserve latest bytes, and Git staging/HEAD stay unchanged.

Final v3 runtime receipts bind exact source/package/runtime hashes. Earlier
matrices are supplemental. This does not claim Windows or JSON mixed-state
coverage, ambiguous unresolved merge mutation, or a final sealed0.6.0 artifact.
Keep aggregate open for final-artifact requalification and independent acceptance.

# Notes / Follow-ups

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
