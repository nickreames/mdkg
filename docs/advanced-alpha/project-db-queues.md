# Project DB And Queues

Project DB and queue surfaces are advanced alpha local infrastructure.

Markdown remains the durable source of truth. SQLite helps with rebuildable access caches, optional project application state, and local queue delivery workflows.

Queue state is local delivery state, not canonical event history.

Useful commands:

```bash
mdkg db init
mdkg db migrate
mdkg db verify
mdkg db queue contract --json
mdkg db queue stats --json
```

The queue adapter contract covers payload hashing, dedupe keys, oldest-ready claim ordering, lease-owner checked ack/fail, retry delay, expired lease release, dead letters, pause/resume, snapshot policy, and stats.

Public queue boundaries:

- Queue payloads are local delivery data. Do not treat them as durable semantic graph memory.
- `ack`, `fail`, and `dead-letter` validate lease ownership.
- Expired leases can be released or reclaimed by later workers.
- Snapshot sealing defaults to a drain policy so active delivery state is not committed accidentally.
- A paused queue can support a reviewable sealed state when the queue policy allows it and no messages are leased.

Use `mdkg db queue contract --json` when writing adapters. It is the stable machine-readable summary for public queue semantics.
