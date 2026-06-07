---
id: task-289
type: task
title: harden WORK_ORDER trigger refs payload hash status and queue refs
status: done
priority: 1
epic: epic-56
parent: goal-9
prev: task-288
next: task-290
tags: [work-order, trigger, hash, queue]
owners: []
links: []
artifacts: [.mdkg/templates/default/work_order.md, src/graph/agent_file_types.ts]
relates: [goal-9, epic-56, test-111]
blocked_by: [task-288]
blocks: [task-290, task-291]
refs: [dec-27]
aliases: [work-order-trigger-schema]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Make work orders deterministic invocation mirrors that can be linked to queue
delivery without becoming runtime state.

# Acceptance Criteria

- Work orders support trigger refs, stable payload hashes, order status, optional queue refs, requested outputs, and constraints.
- Hash and ref fields are validated.
- Queue refs remain optional.

# Files Affected

- `.mdkg/templates/default/work_order.md`
- `src/graph/agent_file_types.ts`
- `tests`

# Implementation Notes

- Treat work orders as semantic mirrors even when linked to queue delivery.

# Test Plan

- Unit fixtures for valid and invalid work orders.
- `npm run test`
- `node dist/cli.js validate`

# Links / Artifacts

- `test-111`
