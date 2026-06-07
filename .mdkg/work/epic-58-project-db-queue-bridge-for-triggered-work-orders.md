---
id: epic-58
type: epic
title: project DB queue bridge for triggered work orders
status: done
priority: 2
tags: [db, queue, work-order, trigger, delivery]
owners: []
links: []
artifacts: [src/db, src/commands/db.ts]
relates: [goal-9, epic-33]
blocked_by: []
blocks: [task-294, test-114]
refs: [dec-27, edd-15]
aliases: [work-order-queue-bridge, trigger-queue-bridge]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Let triggered work orders optionally enqueue local project DB delivery messages
without making mdkg a worker runtime.

# Acceptance Criteria

- Queue bridge is opt-in.
- No work executes inside mdkg.
- Queue refs and order mirrors are linked deterministically.

# Scope

Optional local delivery bridge from work orders to project DB queues.

# Milestones

- `task-294`
- `test-114`

# Out of Scope

- No canonical event history or worker lifecycle implementation.

# Risks

- Queue rows could be confused with durable graph evidence.

# Links / Artifacts

- `goal-9`
- `epic-33`

# Closeout

Completed by `task-294` and `test-114`.

- Triggered work orders can optionally enqueue local project DB queue delivery
  messages.
- Queue bridge refs are deterministic and linked back to the work order mirror.
- mdkg still does not execute work or turn queue delivery state into canonical
  event history.
