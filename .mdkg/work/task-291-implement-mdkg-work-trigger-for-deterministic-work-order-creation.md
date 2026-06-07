---
id: task-291
type: task
title: implement mdkg work trigger for deterministic work order creation
status: done
priority: 1
epic: epic-57
parent: goal-9
prev: task-290
next: task-292
tags: [work, trigger, cli, work-order]
owners: []
links: []
artifacts: [src/commands/work.ts, src/cli.ts]
relates: [goal-9, epic-57, test-112]
blocked_by: [task-290]
blocks: [task-292, test-112]
refs: [dec-27]
aliases: [mdkg-work-trigger]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Add `mdkg work trigger <work-or-capability-ref>` as the high-level invocation
helper.

# Acceptance Criteria

- Command creates a deterministic `WORK_ORDER.md` for a work contract or capability ref.
- Supports `--id`, `--title`, `--requester`, optional `--enqueue`, and `--json`.
- Does not execute work.

# Files Affected

- `src/commands/work.ts`
- `src/cli.ts`
- `tests`

# Implementation Notes

- Trigger creates a mirror and optional delivery event only.

# Test Plan

- CLI tests for deterministic order creation.
- `node dist/cli.js work trigger <dogfood-work-ref> --json`
- `npm run smoke:archive-work`

# Links / Artifacts

- `test-112`
