---
id: prop-9
type: prop
title: choose a risk-tier CI smoke and release gate topology
tags: [audit-followup, ci, smoke, release]
owners: []
links: []
artifacts: []
relates: [loop-7]
refs: [loop-7, spike-32, test-461, chk-541, chk-542, task-803, task-804]
aliases: []
created: 2026-07-17
updated: 2026-07-17
---
# Summary

Adopt a staged risk-tier gate after `root:task-803` removes build amplification:
fast deterministic tests/coverage and representative high-risk smokes on every
push/PR matrix row, then a sharded complete smoke gate for release authority.

# Motivation

Current CI runs eight direct gates and only two of 47 smoke aliases; 45 direct
prepublish gates are absent. Running the current full ladder in each matrix job
would multiply an estimated 87 root, 12 docs, and 17 mdkg-dev builds and exceed
the useful 30-minute budget. The repo needs an explicit risk/latency topology,
not an accidental choice between shallow CI and an unoptimized full ladder.

# Proposal

Recommended path: staged risk tiers.

1. Prerequisites: complete `root:task-802`, `root:task-803`, and
   `root:task-804` so pack readiness, deterministic builds, and coverage are
   trustworthy.
2. PR/push matrix tier: run tests, enforced coverage, CLI/docs/security
   contracts, graph validation, tracked-drift proof, and a curated smoke set
   covering package consumer, init/upgrade, loop/goal, DB/SQLite,
   bundle/subgraph, and docs/public-site risk.
3. Release tier: shard the full effective 47-alias smoke map by subsystem with
   independent timeouts and artifacts; require all shards before publication.
4. Generate both tiers from one machine-readable smoke inventory so aliases
   such as `smoke:bundle-import -> smoke:subgraph` cannot skew coverage counts.
5. Parse workflow structure in tests rather than checking four substrings.

# Impact

- Fast feedback remains bounded on both Node matrix rows.
- Full publication risk is verified without serially rebuilding every surface.
- Coverage, timeout, drift, and smoke membership become explicit contracts.
- Remote execution and provider changes still require separate authority.

# Risks

- Curated PR smokes can miss a bad domain selection; mitigate with explicit
  subsystem ownership and periodic/full release shards.
- Matrix/shard concurrency increases provider minutes; measure durations after
  build deduplication before fixing shard counts.
- A generated inventory can drift from actual script recursion; validate the
  expansion against `package.json` and the smoke entrypoints.

# Alternatives

1. Run full `prepublishOnly` in every Node matrix job. Strong parity, but
   unacceptable until build/install amplification is fixed and still costly on
   ordinary PRs.
2. Keep the current two-smoke CI subset. Fastest, but leaves 45 direct release
   gates and coverage outside normal feedback.
3. Run one full serial job only on `main`. Lower provider cost than sharding,
   but slow failure localization and one coarse timeout.

# Next Steps

- Accept, revise, or reject this proposal after `root:task-803` produces real
  optimized duration/build-count receipts.
- On acceptance, create one implementation task and one workflow-contract test;
  do not overload the residual audit children or mutate CI from `root:loop-7`.
