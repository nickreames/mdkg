---
id: epic-33
type: epic
title: queue backed materializer leases and ephemeral workers
status: done
priority: 1
tags: [project-db, queue, materializer, leases, workers]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-32, goal-3, goal-5]
blocked_by: []
blocks: [task-190, task-191, task-244, task-245, task-246, task-247, task-250, task-251, test-86]
refs: []
aliases: [queue-materializer, ephemeral-workers]
skills: []
created: 2026-05-27
updated: 2026-06-04
---

# Overview

Build local node:sqlite queue primitives first, then use those primitives later
for queue-backed workers that hydrate sealed snapshots, process durable events,
emit receipts, and seal new state.

# Goal

Use the shipped internal local queue capability to define and then implement the
queue-backed materializer path for project DB state. The materializer layer
starts at `task-191`; queue primitives remain internal and no public queue CLI
is required.

# Scope

- Internal node:sqlite queue schema and helpers.
- Local delivery semantics: enqueue, claim, ack, retry, dead-letter, lease
  expiry, and stats.
- Packed temp-repo queue smoke coverage.
- Future worker lifecycle and queue notification semantics after the prerequisite
  event/reducer/lease contracts are stable.
- Materializer helper and packed smoke coverage under `goal-5`.

# Acceptance Criteria

- Local queue tables are mdkg-owned project DB migrations.
- Queue helpers are internal runtime APIs, not public `mdkg db queue ...`
  commands.
- Queue state is delivery infrastructure, not canonical event history.
- Duplicate delivery is idempotent through explicit dedupe keys.
- Lease expiry, retries, and dead-letter outcomes are deterministic and covered
  by tests.
- Worker flow covers lease claim, snapshot hydration, event load, typed reducer
  application, verification, seal, compare-and-swap commit, receipt write, and
  queue acknowledgement once the later materializer layer is in scope.
- Sandbox/runtime files are disposable.

# Milestones

- Local queue schema and lifecycle contract is defined.
- Internal queue helpers are implemented and tested.
- Packed temp-repo `smoke:db-queue` proves package behavior.
- Lease/CAS behavior is defined.
- Worker hydration/apply/seal flow is defined.
- Queue role is documented as notification, not durable history.
- Materializer smoke proves queue, event, reducer, lease/CAS, and snapshot
  integration before a future publish.
- Internal materializer helper and packed smoke are implemented under `goal-5`.

# Out of Scope

- No public queue CLI in the first queue capability pass.
- No external or hosted queue implementation.
- No worker write-through without receipts and snapshot compare-and-swap.
- No real npm publish, tag, or push for queue work without separate approval.

# Risks

- Independent sandboxes racing from the same base snapshot.
- Queue redelivery corrupting state if idempotency and receipts are incomplete.
- Ephemeral worker scratch state being treated as durable.

# Links / Artifacts

- `epic-29`
- `epic-32`
- `goal-3`
- `goal-5`
- `task-247`
- `task-244`
- `task-246`
- `task-245`
- `task-190`
- `task-191`
- `task-250`
- `task-251`
- `test-86`

# Progress Notes

- 2026-06-04: `task-191`, `task-250`, `task-251`, and `test-86` completed the
  internal local queue-backed materializer foundation and packed smoke gate. No
  public materializer CLI, publish, tag, or push was performed.
