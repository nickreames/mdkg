---
id: task-292
type: task
title: implement mdkg work order status JSON command
status: done
priority: 1
epic: epic-57
parent: goal-9
prev: task-291
next: task-293
tags: [work-order, status, cli, json]
owners: []
links: []
artifacts: [src/commands/work.ts, src/cli.ts]
relates: [goal-9, epic-57, test-113]
blocked_by: [task-291]
blocks: [task-293, test-113]
refs: [dec-27]
aliases: [work-order-status-command]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Add deterministic inspection for a work order without requiring full graph body
inspection.

# Acceptance Criteria

- `mdkg work order status <order-id> --json` reports qid, path, status, work ref, requester, queue refs, artifacts, and receipt linkage when available.
- Read-only imported qid behavior remains enforced.

# Files Affected

- `src/commands/work.ts`
- `src/cli.ts`
- `tests`

# Implementation Notes

- Status must be read-only and deterministic.

# Test Plan

- CLI tests for status output.
- `node dist/cli.js work order status <created-order> --json`

# Links / Artifacts

- `test-113`
