---
id: test-86
type: test
title: materializer queue event reducer lease snapshot e2e contract
status: done
priority: 1
epic: epic-33
parent: goal-5
tags: [project-db, materializer, e2e, smoke]
owners: []
links: []
artifacts: []
relates: [goal-5, task-191, task-250, task-251, epic-33]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Validate the future materializer smoke contract across local queue delivery,
durable events, typed reducers, writer leases/CAS, receipts, and sealed
snapshots.

# Target / Scope

- `task-191`
- `task-250`
- `task-251`
- `epic-33`

# Preconditions / Environment

- `task-250` has implemented the internal materializer helper.
- Packed temp-repo install is available for smoke proof.

# Test Cases

- Enqueue a materializer message that references a durable event.
- Claim the message, hydrate state, apply reducer, write receipts, seal a
  snapshot, and acknowledge the queue.
- Simulate stale writer CAS and verify conflict receipt plus retry/dead-letter
  behavior.
- Verify runtime DB/WAL files remain ignored and sealed artifacts remain
  explicit.

# Results / Evidence

- `scripts/smoke-db-materializer.js` packs mdkg, installs into a temp prefix,
  initializes a fresh repo, runs `db init/migrate`, requires packaged
  `dist/core/project_db_materializer.js`, records durable events, enqueues
  materializer messages, applies reducers, commits writer leases, writes
  receipts, seals/verifies/dumps/diffs snapshots, checks materializer stats,
  runs `index` and `validate`, and asserts no public materializer CLI appears in
  `mdkg help db`.
- `npm run smoke:db-materializer` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed
  through the full `prepublishOnly` ladder including `smoke:db-materializer`.

# Notes / Follow-ups

- Public materializer CLI remains intentionally deferred.
