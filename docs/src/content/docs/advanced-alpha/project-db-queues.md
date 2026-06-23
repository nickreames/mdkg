---
title: Project DB And Queues
description: Local node:sqlite project DB and public queue adapter contract.
---

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
