---
id: dec-4
type: dec
title: Use graph-only writer leases with one root integration owner
status: accepted
tags: [ownership, writers, git, integration]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-platform/activation-contract.json, artifacts/demo-platform/proposed-source-allowlist.json, artifacts/demo-platform/goal-2-activation-receipt.json, artifact://ai-native-sdlc-demo/writer-lease]
relates: []
refs: [prd-1, edd-1]
aliases: [graph-only-writer-lease]
created: 2026-07-26
updated: 2026-07-27
---

# Context

The nested graph reduces planning conflict but shares a Git checkout and index with parallel mdkg work. Graph separation is not filesystem, staging, or history isolation.

# Decision

The program writer owns presentations/ai-native-sdlc-demo/ and uses nested mdkg commands. One root integration owner exclusively performs root mdkg commands, bundle refresh, staging, commits, and pushes.

An executable child goal may own the publication node in its work topology, but only the root integration owner may claim and execute that node's Git mutation. The child implementation writer yields after accepted local/canonical validation; the integration owner then stages and pushes the child-approved allowlist, after which read-only verification resumes. These roles never hold overlapping write leases.

Shared-source phases use two gates:

1. A discovery gate may authorize a named read-only spike to inspect current source and write only inside its owning program graph and artifact directory.
2. A mutation gate requires that spike's accepted recommendation plus a frozen path allowlist, accepted clean base commit, full dirty/staged inventory, explicit shared-source writer, exclusive quiet window, invalidation rules, and release condition.

For Goal 2, `spike-2` owns the discovery gate. Before `task-5` starts, the root integration owner must accept `artifacts/demo-platform/goal-2-activation-receipt.json`. That receipt binds the Goal 1 checkpoint and bundle, proposed allowlist, base commit, worktree inventory hash, owner handoffs, lease window, and forbidden surfaces. Any HEAD, path, ownership, or parallel-writer drift invalidates it.

After spike-2, the program orchestrator releases its nested writer lease. The accepted mutation receipt then grants one shared-source writer both the enumerated shared-source paths and only the Goal 2 nested task/evidence/index paths needed to execute task-5 through test-6. That writer yields before any root bundle, root index, staging, commit, or publication action. The program orchestrator may resume only after the shared-source lease is released.

`examples/demo-runs/demo-001/**` is immutable historical evidence. Goal 2 regression language refers to the canonical mdkg.dev Demo 1 routes unless a later explicit goal reopens that historical run.

Root registration, bundle refresh, staging, commits, pushes, and root Remotion nodes remain root-integration-owner actions during serialized windows. Goal execution and local validation do not imply any Git or provider authority.

Timed demo preparation uses four additional ownership boundaries:

1. The canonical source-release owner may change authored template/operator
   inputs only under an accepted shared-source lease.
2. The program orchestrator may freeze a versioned run binding before
   materialization, but may not alter the accepted source while creating a run.
3. The child writer may update runtime state, evidence, decisions, checkpoints,
   and allowlisted outputs, but may not edit the source identity, immutable
   binding, contract seal, or authority reference.
4. Human approval plus the root integration owner own the external authority,
   Git lease, baseline publication, allowlist, validity window, and provider
   boundary. The writable child may consume that authority but never author or
   expand it.

The child contract seal binds only immutable authored topology and policy
references. Normal status, event, evidence, index, pack, and checkpoint writes
must not invalidate authority. Any edit to immutable authored content or the
run binding invalidates the child and requires absent-target regeneration.

# Alternatives Considered

- Dedicated worktree: safer but not selected.
- Uncoordinated path-only writes: rejected because root indexes and Git remain shared.
- One writer for all phases: rejected because isolated nested planning can proceed safely.

# Consequences

Nested read-only discovery and graph authoring can continue alongside unrelated root work. Shared-source mutation waits for an accepted mutation receipt, and root mutation, bundle refresh, Git integration, and publication wait for the root integration owner.

This separation prevents an executing child from self-authorizing, avoids
whole-tree hash churn, and makes Demo 3 and Demo 4 independently reproducible
from accepted source releases.

# Links / references

- prd-1
- edd-1
