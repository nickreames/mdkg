---
id: epic-33
type: epic
title: queue backed materializer leases and ephemeral workers
status: todo
priority: 2
tags: [project-db, queue, materializer, leases, workers]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-32]
blocked_by: [epic-32]
blocks: [task-190, task-191]
refs: []
aliases: [queue-materializer, ephemeral-workers]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Plan the future queue-backed worker pattern for ephemeral agents that hydrate a
sealed snapshot, process durable events, emit receipts, and seal new state.

# Goal

Define the future asynchronous materialization pattern after local project DB
primitives are stable.

# Scope

- Writer lease and compare-and-swap snapshot flow.
- Ephemeral worker lifecycle.
- Queue notification semantics.
- Receipt-backed worker closeout.

# Acceptance Criteria

- Worker flow covers lease claim, snapshot hydration, event load, typed reducer
  application, verification, seal, compare-and-swap commit, receipt write, and
  queue acknowledgement.
- Queue is delivery infrastructure, not canonical history.
- Sandbox/runtime files are disposable.

# Milestones

- Lease/CAS behavior is defined.
- Worker hydration/apply/seal flow is defined.
- Queue role is documented as notification, not durable history.

# Out of Scope

- No external queue implementation in the first project DB foundation phase.
- No worker write-through without receipts and snapshot compare-and-swap.

# Risks

- Independent sandboxes racing from the same base snapshot.
- Queue redelivery corrupting state if idempotency and receipts are incomplete.
- Ephemeral worker scratch state being treated as durable.

# Links / Artifacts

- `epic-29`
- `epic-32`
- `task-190`
- `task-191`
