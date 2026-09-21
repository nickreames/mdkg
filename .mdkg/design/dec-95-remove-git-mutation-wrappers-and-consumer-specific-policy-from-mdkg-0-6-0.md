---
id: dec-95
type: dec
title: Remove Git mutation wrappers and consumer-specific policy from mdkg 0.6.0
status: accepted
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
refs: [goal-83, goal-84, dec-94]
aliases: []
created: 2026-09-11
updated: 2026-09-11
---
# Context

Nick explicitly rejects both proposed compatibility bridges for 0.6.0: remove
Git mutation convenience wrappers completely, and remove consumer-specific
tooling/capabilities rather than retaining an Omni adapter in mdkg. Generic
agent capabilities may remain when their semantics, not just names, are generic.
This supplements dec-94; it does not reopen its accepted recovery/transport rules.

# Decision

1. Remove public Git mutation conveniences, including clone/fetch/push and
   stage-all/commit behavior, without deprecated aliases, redirects or hidden
   fallback execution. Native Git owns repository/worktree/PR operations.
   Edd-82 inventories adjacent materialization and closeout orchestration for
   removal/export review; internal observational Git reads remain necessary.
2. Remove the omni-room profile and privileged ochatr metadata behavior from
   shipped CLI/contracts/seeds/projections. No compatibility adapter or automatic
   rewrite. Preserve user-authored files and historical evidence; unsupported
   operations fail without mutation rather than silently bypassing validation.
3. Keep only genuinely generic memory/contracts. Runtime owns agent execution,
   authentication, orchestration policy and consumer integration; backend systems
   own operational/economic records. Renaming cannot conceal consumer semantics.
4. Before removing code, task-833 must preserve a sanitized source-bound export
   context with predicates, contracts, dependencies, safety requirements and
   fixtures. This is a local handoff artifact, not consumer installation,
   dispatch, publication or consumer acceptance. No root/sibling writes.
5. Worktrees belong to individual project repositories. One writer per checkout,
   native Git lifecycle, same graph identity across branches, separate local
   state, and one reviewed ancestry-preserving integration owner remain the
   qualification contract in task-826/test-478. No mdkg worktree manager.
6. Large-transaction optimization is a proposed post-0.6.0 goal, not a new
   release dependency unless testing demonstrates a correctness/required-gate
   failure. Do not weaken custody checks for speed.

# Alternatives considered

- Deprecated Git commands or product-specific adapters: explicitly rejected.
- Rename all consumer policy to agent policy: rejected; classify semantics first.
- Remove every DB/receipt/agent primitive: unsupported by the source evidence;
  generic optional primitives do not become product-specific through consumption.

# Consequences

Bug-36 and bug-37 are publication-blocking product-boundary changes, not new
security scan findings. Test-484 and task-828 independently verify the resulting
surface; task-827 owns breaking-change guidance. Goal-85 remains paused/blocked.
The current enhancement pass is planning/evidence only. New work is backlog and
unclaimed; no source/docs/skills change, test execution, Git commit/push, bundle
refresh, canonical migration or consumer action is authorized by this receipt.
Exact additional recommendations (pricing removal, runtime-mode vocabulary and
remaining Git orchestration surfaces) are source-grounded in edd-82, not claimed
as implemented or automatically accepted consumer migrations.

# Links / references

- edd-82; bug-36; bug-37; task-833; test-484; task-826; test-478; task-827; task-828.
