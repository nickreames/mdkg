---
id: test-470
type: test
title: Verify fast-matrix and full exact-SHA release topology from the smoke manifest
status: backlog
priority: 1
parent: goal-78
prev: task-811
tags: [ci, smoke, release, test]
owners: []
links: []
artifacts: []
relates: [task-811, prop-9]
blocked_by: [task-811]
blocks: []
refs: [goal-78, prop-9, spike-33, task-811]
context_refs: [goal-78, prop-9, spike-33, task-811]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [manifest_47_to_46, fast_runtime_matrix, curated_fast_membership, full_release_all_canonical, exact_sha_manual_trigger, shard_partition, artifact_and_timeout_contract, aggregate_release_gate, final_tracked_drift, local_only_receipt]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Prove the accepted CI topology is a complete deterministic projection of the
source-owned smoke manifest and can be validated locally without claiming a
provider run.

# Target / Scope

- source-owned smoke manifest and expansion
- fast Node runtime matrix and curated membership
- manual exact-SHA full-release shards
- artifact, timeout, aggregate, and tracked-drift gates
- structured workflow validation

# Preconditions / Environment

- `root:spike-33` is done and its derived CI-topology decision is accepted.
- `root:task-811` is done.
- Goal 1 test receipts and one optimized local full ladder are available.
- Provider/API access is not required.

# Test Cases

- All 47 aliases resolve deterministically to 46 canonical identities with no
  cycle, duplicate canonical execution, or unclassified entry.
- Fast CI contains both Node `24.15.0` and `24.x`, the accepted curated domains,
  enforced coverage, and final tracked-drift proof.
- The manual exact-SHA full tier uses Node `24.15.0` and partitions all 46
  canonical identities exactly once.
- Every shard has the accepted timeout and artifact behavior.
- One aggregate job requires every full-release shard before release authority.
- Removing a runtime, alias, canonical identity, shard, artifact, timeout,
  exact-SHA constraint, or aggregate dependency fails with a precise identity.
- Local fast/full commands pass once and leave no unauthorized tracked output.

# Results / Evidence

Attach manifest expansion, structured workflow receipt, negative fixtures,
local command durations, artifact inventory, and Git boundary to a test-proof
checkpoint.

# Notes / Follow-ups

- A local source proof does not claim the GitHub workflow executed remotely.
- Branch-protection or provider-retention administration remains separate
  authority.
