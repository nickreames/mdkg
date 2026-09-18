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
blocked_by: [bug-35, task-835, task-836, task-827]
blocks: []
refs: [dec-94, dec-95, test-484]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-603]
aliases: []
skills: []
cases: [test-478-case-1, test-478-case-2, test-478-case-3, test-478-case-4, test-478-case-5, test-478-case-6, test-478-case-7, test-478-case-8, test-478-case-9, test-478-case-10, test-478-case-11, test-478-case-12]
created: 2026-09-07
updated: 2026-09-13
---

# Current Successor Contract - 2026-09-13

Two actual concurrent linked worktrees, isolated state, exact pinned target/incoming/ancestor, reconciliation before native ancestry-preserving merge, separate source/config resolution, repeated integration and distinct submodule/gitdir-indirection proof.

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

Confirmed topology: individual project repositories, not the orchestration
superproject. Use native Git CLI worktree/branch/merge operations, no mdkg Git
mutation convenience wrappers. Default integration uses reviewed ancestry-
preserving merge commits. Test whole source-plus-graph outcomes and pinned refs;
do not re-ask these decisions or substitute branch-only tests. Test484 separately
checks removed CLI surfaces; shared tests must not depend on those wrappers.

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
6. A disposable ordinary Git repository with two actual linked worktrees on
   distinct branches: .git files, separate HEAD/index paths, one common object
   store. Resolve paths through Git, not root/.git/index assumptions.
7. Concurrent installed creation of colliding aliases/cross-links in both v2
   worktrees: shared graph ID, distinct new node IDs; ordinary commands work
   before commit. Same-identity concurrent edits remain explicit conflicts.
8. Locks/journals/selection/runtime DB/caches are local to each checkout.
   One active writer in A does not globally lock B; a second writer in A is
   refused. Recovery in A cannot remove B's lock or journal, even under the same
   graph ID. Never relocate a writer lock to the shared Git common directory.
9. Inspection preserves every worktree's Git index, staged contents and authored
   bytes; include stale-stat caches, Bug35 paths, overridden environment and
   explicit --root invocation. Warm/cold JSON and SQLite backends are covered.
10. Complete serial integration of branches containing both source and graph
    changes: preserve accepted source outcomes and stable graph references,
    retain full reviewable ancestry, and prove repeated integration behavior.
    Reconcile refuses unresolved Git stages and binds HEAD/index, so establish
    a tested ordering rather than bypassing those guards or assuming Git merge
    plus reconciliation composes automatically. No force or history rewrite.
11. Pin exact incoming/ancestor revisions: a concurrently advancing sibling
    branch cannot change reviewed inputs silently. Dirty/untracked evidence and
    incomplete journals prevent cleanup; Git worktree lock is not a writer lease.
12. Exercise the submodule/gitdir-indirection topology separately from ordinary
    linked worktrees. No generic worktree pass proves nested submodule support.
    Preserve failed/unsupported topology evidence and route any required scope
    decision before claiming the public support envelope.

# Results / Evidence

Cases6-12 are planned and NOT EXECUTED as of chk603. Static review finds good
product foundations but existing installed helpers hard-code .git/index; no
actual worktree-add fixture was found in the searched test/script sources.
Do not relabel ordinary branch tests as concurrent linked-worktree proof.

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
