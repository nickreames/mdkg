---
id: task-191
type: task
title: define queue backed ephemeral materializer runtime pattern
status: done
priority: 1
epic: epic-33
parent: goal-5
tags: [project-db, queue, materializer, sandbox]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-33, goal-5, task-190, task-244, task-246, task-250, task-251, test-86]
blocked_by: []
blocks: [task-193, task-250]
refs: []
aliases: [ephemeral-materializer-pattern]
skills: []
created: 2026-05-27
updated: 2026-06-04
---

# Overview

Define the future queue-backed materializer pattern where disposable workers
hydrate state, process durable events, emit receipts, and shut down.

This task defines the worker/materializer integration layer now that the local
node:sqlite queue primitives from `goal-3` and the event, receipt, reducer, and
lease/CAS foundation from `goal-4` have shipped.

# Acceptance Criteria

- Queue messages carry lightweight references such as project, branch, and event
  ids.
- Worker loads durable event bodies from the event store.
- Worker hydrates latest sealed snapshot, applies typed reducers, verifies,
  seals, writes receipts, and acknowledges the queue.
- Sandbox filesystem, active WAL, and scratch files are disposable.
- Helper behavior is internal-only; no public queue, event, reducer, lease, or
  materializer CLI is introduced by this design.
- Follow-on implementation in `task-250` has a concrete input/output contract
  and failure policy.

# Explicit Exclusions

- Queue is not the durable event history.
- No external queue adapter required in the first local project DB phase.
- No public queue CLI requirement.
- No public worker or queue CLI requirement in this planning task.

# Files Affected

- Future worker pattern docs, local worker smoke, and queue adapter contracts.

# Implementation Notes

Plan queue-backed materialization on top of the now-tested local queue, event,
receipt, reducer, lease, and sealed snapshot contracts.

Use the internal queue helpers as delivery infrastructure once they exist; do
not make queue rows the canonical event/audit history.

## Materializer Message Contract

Queue name: `project-db.materialize`.

Payload v1:

```json
{
  "kind": "project-db.materialize",
  "schema_version": 1,
  "project_id": "project",
  "branch_id": "main",
  "event_id": "event-1",
  "reducer_name": "project_meta.set",
  "reducer_version": "v1"
}
```

The queue row stores only delivery state and lightweight references. Durable
event payloads remain in `project_event`; durable outcomes remain in
`project_receipt` plus receipt artifacts under `.mdkg/db/receipts`; branch
commit state remains in `project_branch_state`; sealed review state remains
under `.mdkg/db/state`.

## Worker Lifecycle

1. Release expired queue leases for `project-db.materialize`.
2. Claim the oldest ready/expired queue message for the worker owner.
3. Parse and validate the message payload.
4. Compute the current runtime DB hash before any reducer write; this is the
   writer lease base hash.
5. Acquire a writer lease for `project_id` and `branch_id` with the base hash.
6. Load the durable event referenced by `event_id` through the reducer helper.
7. Apply the typed reducer using short SQLite transactions only.
8. Compute the post-reducer branch commit hash and commit the writer lease with
   CAS. If the current branch snapshot hash no longer matches the base hash,
   keep the queue message retryable and rely on the conflict receipt emitted by
   the lease helper.
9. Acknowledge the queue message only after reducer application and lease commit
   both succeed.
10. Seal the runtime DB to `.mdkg/db/state/project.sqlite` after commit/ack so
    `db snapshot verify` remains fresh and the sealed snapshot is a reviewable
    artifact of the completed materializer pass.

## Failure Policy

- Invalid materializer payload: write a rejected receipt and dead-letter the
  queue message.
- Missing event or reducer rejection: fail the queue message with retry semantics
  until queue max attempts sends it to dead letter.
- CAS conflict: fail the queue message with retry semantics so a later worker can
  rebase on the latest branch snapshot hash.
- Wrong-worker ack/fail remains rejected by the queue helper.
- No arbitrary SQL is exposed through CLI or materializer inputs.
- No long-running worker work happens inside SQLite transactions beyond the
  helper calls that already use short `BEGIN IMMEDIATE` sections.

## Helper Boundary For `task-250`

The internal helper should expose:

- `enqueueProjectDbMaterialization(databasePath, input)`
- `runNextProjectDbMaterializer(databasePath, input)`
- `readProjectDbMaterializerStats(databasePath, input)`

The helper should return deterministic receipts/results with statuses such as
`idle`, `applied`, `rejected`, `conflict`, `retry`, and `dead_letter`, while
preserving the underlying queue/event/lease receipts for auditability.

# Test Plan

- Future integration smoke can replay a local event batch through a simulated
  worker without an external queue service.
- Unit coverage should prove enqueue/claim/apply/seal/ack success, invalid
  payload dead-letter, missing-event retry/dead-letter, CAS conflict retry, and
  no public CLI exposure.
- Packed smoke should install the tarball into a temp prefix and require the
  packaged internal helper from `dist/core/project_db_materializer.js`.

# Links / Artifacts

- `epic-33`
- `goal-5`
- `task-190`
- `goal-3`
- `goal-4`
- `task-250`

# Evidence

- `node dist/cli.js pack task-191` wrote
  `.mdkg/pack/pack_standard_task-191_20260604-204518448.md`.
- Existing queue helpers in `src/core/project_db_queue.ts`, event/reducer/lease
  helpers in `src/core/project_db_events.ts`, and snapshot helpers in
  `src/core/project_db_snapshot.ts` provide the implementation boundary.
- `task-250` implementation corrected the sequence to commit and acknowledge
  before the final seal; otherwise the commit/ack writes make the snapshot stale
  immediately after helper success.
