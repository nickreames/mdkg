---
id: test-470
type: test
title: Verify fast-matrix and full exact-SHA release topology from the smoke manifest
status: done
priority: 1
parent: goal-78
prev: task-811
tags: [ci, smoke, release, test]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-78/ci-topology-verification.json]
relates: [task-811, prop-9]
blocked_by: [task-811]
blocks: []
refs: [goal-78, prop-9, spike-33, task-811, dec-91, chk-554]
context_refs: [goal-78, prop-9, spike-33, task-811]
evidence_refs: [chk-554]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [manifest_47_to_46, fast_runtime_matrix, curated_fast_membership, full_release_all_canonical, exact_sha_manual_trigger, exact_sha_detached_checkout, shard_partition_and_load, artifact_timeout_and_failure_evidence, immutable_tarball_consumers, concurrency_and_cancellation, aggregate_release_gate, final_tracked_drift, local_only_receipt]
created: 2026-07-25
updated: 2026-07-26
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
- Goal 1 test receipts and compact measurements are available as historical
  planning inputs; this test does not rerun the shared full ladder.
- Provider/API access is not required.

# Test Cases

- All 47 aliases resolve deterministically to 46 canonical identities with no
  cycle, duplicate canonical execution, or unclassified entry.
- Fast CI contains both Node `24.15.0` and `24.x`, the accepted curated domains,
  enforced coverage, and final tracked-drift proof.
- The manual exact-SHA full tier validates its input, verifies the detached
  checkout matches it before release work, uses Node `24.15.0`, and partitions
  all 46 canonical identities exactly once with accepted measured shard loads.
- Every job and shard has the accepted timeout, artifact retention,
  concurrency/cancellation, and `if: always()` failure-evidence behavior.
- One immutable tarball producer supplies SHA-verifying consumers, including
  the accepted docs and mdkg-dev profile/cache behavior.
- One aggregate job requires every full-release shard before release authority.
- Removing a runtime, alias, canonical identity, shard, artifact, timeout,
  exact-SHA constraint, or aggregate dependency fails with a precise identity.
- Focused local manifest/workflow contract checks pass and leave no
  unauthorized tracked output.

# Results / Evidence

Attach manifest expansion, structured workflow receipt, negative fixtures,
source-inspected runtime/trigger/DAG semantics, artifact inventory, and Git
boundary to a test-proof checkpoint. State explicitly that neither provider
execution nor local execution of exact Node `24.15.0` was proven.

# Notes / Follow-ups

- A local source proof does not claim the GitHub workflow executed remotely.
- Branch-protection or provider-retention administration remains separate
  authority.
- The final Goal 78 checkpoint, not this lane, owns exactly one shared
  `ci:release` and one shared optimized `prepublishOnly` run after all five
  scoped test nodes are complete.
