---
id: task-294
type: task
title: add optional project DB queue enqueue bridge for triggered orders
status: done
priority: 2
epic: epic-58
parent: goal-9
prev: task-293
next: task-295
tags: [db, queue, trigger, work-order]
owners: []
links: []
artifacts: [src/db, src/commands/work.ts]
relates: [goal-9, epic-58, test-114]
blocked_by: [task-293]
blocks: [task-295, test-114]
refs: [dec-27]
aliases: [trigger-order-queue-enqueue]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Bridge `mdkg work trigger --enqueue <queue>` to project DB queue delivery when
the project DB is enabled.

# Acceptance Criteria

- Queue enqueue is opt-in and fails clearly when DB or queue is unavailable.
- Enqueued payload references the work order and payload hash.
- No worker execution happens inside mdkg.

# Files Affected

- `src/db`
- `src/commands/work.ts`
- `tests`

# Implementation Notes

- Fail clearly when DB or queue support is unavailable.

# Test Plan

- Queue bridge unit or smoke test.
- `npm run smoke:db-queue-cli`
- `node dist/cli.js work trigger <dogfood-work-ref> --enqueue <queue> --json`

# Links / Artifacts

- `test-114`
