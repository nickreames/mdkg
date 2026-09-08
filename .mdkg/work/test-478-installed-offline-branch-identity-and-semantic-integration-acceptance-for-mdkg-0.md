---
id: test-478
type: test
title: Installed offline branch identity and semantic integration acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
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
updated: 2026-09-07
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

Not executed. Record case-level expected/actual, exact commands/runtime/package identity, stdout/exit results and compact reproducible evidence. No missing runtime, interrupted case or source-only assertion is a pass.

# Notes / Follow-ups

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
