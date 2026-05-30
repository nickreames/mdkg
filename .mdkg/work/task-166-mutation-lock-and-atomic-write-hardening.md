---
id: task-166
type: task
title: mutation lock and atomic write hardening
status: done
priority: 1
epic: epic-20
tags: [0_1_3, locking, atomic-writes, parallel-safety]
owners: []
links: [src/util/lock.ts, src/util/atomic.ts]
artifacts: []
relates: [epic-20, task-168, task-170]
blocked_by: []
blocks: [task-168, task-170]
refs: [rule-4]
aliases: [repo-mutation-lock, atomic-cache-writes]
skills: []
created: 2026-05-20
updated: 2026-05-20
---

# Overview

Add a shared repository mutation lock and temp-file-plus-rename writes so
parallel mdkg invocations do not corrupt Markdown or derived caches.

# Acceptance Criteria

- Mutating commands acquire a shared lock with clear timeout behavior.
- Index/cache writes use atomic temp writes.
- New Markdown node files use exclusive creation.
- Locking covers `new`, `checkpoint`, `task`, `work`, `archive`, bundle import
  config writes, and index writes.
- Lock release is reliable after both success and failure.

# Files Affected

- `src/util/lock.ts`
- `src/util/atomic.ts`
- `src/commands/new.ts`
- `src/commands/checkpoint.ts`
- `src/commands/task.ts`
- `src/commands/work.ts`
- `src/commands/archive.ts`
- `src/commands/bundle_import.ts`
- `src/commands/index.ts`
- `src/graph/*_cache.ts`

# Implementation Notes

The lock is deliberately a filesystem lock so JSON-mode users get race
hardening too. SQLite adds stronger id allocation, but the public CLI should
not become unsafe when SQLite is disabled.

# Test Plan

- Parallel CLI smoke with JSON and SQLite backends.
- Unit coverage for parallel creation and checkpoint allocation.
- `npm run smoke:parallel`

# Links / Artifacts

- `epic-20`
- `task-168`

# Verification Evidence

- `npm run test`
- `npm run smoke:parallel`
