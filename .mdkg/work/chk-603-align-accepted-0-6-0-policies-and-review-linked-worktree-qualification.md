---
id: chk-603
type: checkpoint
title: Align accepted 0.6.0 policies and review linked worktree qualification
checkpoint_kind: audit
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [root:task-827]
blocked_by: []
blocks: []
refs: [dec-94, goal-83, goal-84, goal-85, task-826, task-827, test-478, bug-7, bug-17, bug-35]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-826, test-478, task-827, bug-7, bug-17, bug-35]
created: 2026-09-11
updated: 2026-09-11
---
# Summary

Nick's accepted recommendations are durable in dec94 and routed to the existing
Goal83/84 work. A source-grounded linked-worktree review identifies both supporting
foundations and missing acceptance evidence. This is alignment, not an executed
parallel-agent/worktree qualification or a source remediation receipt.

# Scope Covered

Existing owner mdkg-project-agent; task827 planning/guidance and task826/test478
qualification. No duplicate goal or loop created. Bugs17/35 move from blocked to
todo because their policy/custody gates are accepted; they are not marked fixed.

## Changed Surfaces

- dec94, this checkpoint, bugs7/17/35, goals83/84, tasks826/827 and test478,
  plus required mdkg projections. Existing Bug17 narrative receives only the
  accepted policy/status/reference update; the partial source patch is preserved.

## Boundaries

- In scope: current source/test/history inspection, official Git documentation,
  accepted-policy nodes and future qualification scenarios.
- No product/source/instruction/skill/release-document edit; no actual worktree
  creation, agent dispatch, canonical migration, Git staging/commit/push/merge,
  bundle refresh, provider/deployment action or other workspace write.
- Root, consumers, and obsolete worktree metadata remain untouched. No secrets
  or operational payloads read. This is not a claim of filesystem sandboxing.

# Decisions Captured

dec94 accepts observational Git helper fixes, capability-compatible v2 writers,
explicit evidence-bound recovery callable by authorized agents, and inspect-only
old public bundles until fresh safe export. Prior unanswered-policy notes are
historical. Do not ask for these same approvals again.

# Implementation Summary

Recommended model: one integration owner on main, one unique branch and checkout
per coding agent, common graph identity for branches of the same project, local
selection/cache/runtime/lock/journal state per checkout, and serial reviewed
integration of complete source-plus-memory outcomes. Independent child projects
retain their own graph IDs and writers; a worktree is not an independent fork.

# Audit Findings

1. src/graph/identity_authoring.ts assigns fresh UUIDs for new node identities,
   independent of branch-local numeric aliases. Migrate a common reviewed base
   once before ordinary same-graph branch work; migration origins are not a
   requirement to regenerate every worktree's graph ID.
2. src/graph/identity_snapshot.ts:202 resolves the index with Git --git-path;
   src/graph/identity_history.ts similarly resolves graft metadata. These support
   gitdir indirection, but static inspection is not linked-worktree execution.
3. src/util/lock.ts anchors the writer lock under each root's .mdkg/index;
   identity transaction journals live under each root's .mdkg/state. Keep those
   local: a graph-ID-wide lock in the shared Git directory would serialize all
   branches. Shared/custom external state paths require separate ownership checks.
4. src/core/paths.ts resolves the supplied root or cwd. A spawned agent must get
   an exact worktree cwd/--root; do not let it inherit canonical checkout cwd.
5. scripts/installed-identity-collaboration.js, installed-graph-recovery.js and
   installed-work-identity.js assume root/.git/index. A search of tests/scripts
   found no actual worktree-add fixture. Ordinary branch passes do not prove
   concurrent linked checkouts, per-worktree Git metadata or cleanup behavior.
6. src/graph/identity_reconciliation_plan.ts refuses unresolved Git stages;
   src/graph/identity_transaction.ts checkControl binds HEAD, branch and index.
   A naive Git-merge-first workflow can therefore block semantic reconciliation;
   staging/merging after preview invalidates its plan. Prove a complete supported
   integration ordering without weakening guards, losing source changes or
   inventing Git ancestry. This is a design/qualification gap, not a reproduced
   new product defect or authority for a generic merge engine.
7. Worktrees share objects/most refs and default Git config; own HEAD/index are
   separate. Git worktree lock protects administrative retention, not mdkg writer
   exclusion. Worktrees are not a security boundary, do not isolate ports or
   credentials, and should not share writable node_modules/build/cache outputs.
8. This canonical checkout uses a .git file pointing into the parent repository's
   module storage. Existing worktree listing has one stale Demo3 entry; do not
   prune it. Test submodule topology separately: official Git guidance explicitly
   cautions about incomplete multi-checkout submodule support.

Test478 cases6-12 specify the future installed matrix: real worktrees, concurrent
creation, same-checkout writer refusal, cross-checkout independence, exact index
preservation, crash/recovery isolation, full integration/replay and shared refs,
and separate submodule topology. Not executed during this alignment turn.

# Verification / Testing

## Command Evidence

- Read-only Git HEAD/status/worktree and source/test inspection. Baseline
  cd0eb6fcc3f5945cfa3c29fe0cb356d9805e518c; nine pre-existing dirty paths.
- Runtime lease table:five released, queue empty; no mutation lock at start.
- Canonical source/selected-goal/runtime DB/Demo3 bundle hashes matched the
  prior frozen record before edits. Only Bug17's mdkg node custody is updated
  by explicit current instruction; its partial implementation remains untouched.
- Full graph:zero errors/three inherited stale-subgraph warnings. Changed graph:
  zero errors/warnings. SQLite verify:zero failures. git diff --check passes.
  Logs:/private/tmp/mdkg-worktree-alignment.rvHu2d. No source build, runtime
  fixture, security scan or worktree execution is claimed.
- Bug17 prior body reconstructs to the exact pre-turn hash after removing only
  the approved status/reference/date/current-decision edits. Its new custody
  SHA256 is d1e1d9c7aa643ab9e497b4ead3d5171888620af6ff2c9e657f63c6c94d213d3f.
  This supersedes that node's older frozen hash, not the protected source hashes.
- No writer lease acquired; existing runtime leases remain released. All changes
  remain unstaged/uncommitted for review, with no mutation lock left behind.

## Pass / Fail Status

- Policy alignment and static review complete; full qualification NOT_READY.

## Known Warnings

- Existing stale subgraphs and worktree metadata are preserved. Shared Git
  administration, submodules and source/graph integration remain unqualified.

# Known Issues / Follow-ups

- Confirm the first supported topology: recommend child-project worktrees,
  not duplicating the entire multi-submodule orchestration superproject.
- Confirm the integration default: recommend a single integration owner and
  ancestry-preserving reviewed merge commits, with exact source-plus-graph
  sequencing proven in disposable fixtures before prescribing commands.
- Keep native Git worktree lifecycle as the first implementation assumption;
  a convenience mdkg agent/worktree scheduler is not needed for compatibility.

## Follow-up Refs

- Existing task826/test478 own worktree qualification; bugs7/17/35 own accepted
  remediation; task827 updates draft guidance after this review; task828 remains
  independent final verification. No completed Goal81/82 reopened.

# Links / Artifacts

- https://git-scm.com/docs/git-worktree (details, configuration, refs and bugs)
- https://git-scm.com/docs/gitrepository-layout
- dec94; task826; test478; release/0.6.0-qualification-draft.md (not edited here).

# Raw Content Safety

Portable source findings and accepted policies only. Skills used: goal pursuit,
pack grounding, service-boundary-ownership-check, verify-close-and-checkpoint.
New skill candidates:none; this work belongs in implementation/test contracts
and decision records, not a new procedural skill.
