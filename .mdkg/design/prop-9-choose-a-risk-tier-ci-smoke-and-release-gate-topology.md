---
id: prop-9
type: prop
title: choose a risk-tier CI smoke and release gate topology
tags: [audit-followup, ci, smoke, release]
owners: []
links: []
artifacts: []
relates: [loop-7]
refs: [loop-7, spike-32, test-461, chk-541, chk-542, chk-544, goal-77, test-463, test-464, goal-78, spike-33, task-811, test-470, dec-87, dec-88]
aliases: []
created: 2026-07-17
updated: 2026-07-25
---
# Summary

Adopt a staged risk-tier gate after `root:goal-77` proves deterministic local
bootstrap, reusable artifacts, profile-aware builds, and scoped coverage:
fast deterministic tests/coverage plus representative high-risk smokes on
every PR/push matrix row, then a manual exact-SHA sharded complete smoke gate
for release authority.

# Motivation

The Loop 7 baseline found eight direct CI gates and only two of 47 smoke
aliases; 45 direct prepublish gates were absent. Running the old full ladder in
each matrix row would multiply severe root/docs/mdkg-dev build work. Goal 1 now
owns the prerequisite optimization and coverage evidence, which removes the
former circular dependency between this proposal and `root:task-804`.

# Proposal

Recommended path: staged risk tiers.

1. Prerequisites: complete `root:test-463` and `root:test-464` so local
   artifact/build timing and scoped coverage are trustworthy.
2. Decision gate: `root:spike-33` binds measured receipts to curated fast
   membership, full shard membership, timeouts, artifact retention, and a
   structured workflow validation strategy. Workflow implementation waits for
   the resulting accepted decision.
3. Fast matrix tier: run on PR, `main` push, and manual triggers for Node
   `24.15.0` and `24.x`. Perform explicit bootstrap/build, complete enforced
   coverage, CLI/docs/security/graph/readiness gates, final tracked-drift proof,
   and a curated smoke set covering package consumer, init/upgrade, loop/goal,
   DB/SQLite, bundle/subgraph, and docs/site risk.
4. Full release tier: manual exact-SHA execution on Node `24.15.0`; shard all
   46 canonical smoke identities by subsystem with independent timeouts and
   artifacts, then require one aggregate success job.
5. Source both tiers from the same machine-readable 47-alias/46-canonical
   manifest used by local prepublish.
6. Parse or deterministically generate/check workflow structure rather than
   extending the existing substring assertions.

# Impact

- Fast feedback remains bounded on both Node matrix rows.
- Full publication risk is verified without serially rebuilding every surface.
- Coverage, timeout, drift, and smoke membership become explicit contracts.
- Local publication requires the optimized prepublish receipt plus a green
  exact-SHA full-release aggregate when a future release goal has current
  publication approval.
- Remote execution evidence, provider settings, branch protection, push, and
  publication remain separate authority.

# Risks

- Curated PR smokes can miss a bad domain selection; mitigate with explicit
  subsystem ownership and periodic/full release shards.
- Matrix/shard concurrency increases provider minutes; bind shard counts only
  after Goal 1 measurements.
- A generated inventory can drift from actual script recursion; validate the
  expansion against `package.json` and the smoke entrypoints.
- A provider artifact policy can outlive source assumptions; bind retention in
  the decision and validate checked-in source without claiming provider state.

# Alternatives

1. Run full `prepublishOnly` in every Node matrix job. Strong parity, but still
   costly on ordinary PRs after optimization.
2. Keep the current two-smoke CI subset. Fastest, but leaves 45 direct release
   gates and coverage outside normal feedback.
3. Run one full serial job only on `main`. Lower provider cost than sharding,
   but slow failure localization, no explicit exact-SHA manual release gate,
   and one coarse timeout.

# Next Steps

- Complete `root:goal-77`.
- Run `root:spike-33` and accept, revise, or reject this proposal with measured
  receipts.
- On acceptance, execute existing `root:task-811` and `root:test-470`; do not
  create duplicate workflow work or mutate CI from completed `root:loop-7`.
