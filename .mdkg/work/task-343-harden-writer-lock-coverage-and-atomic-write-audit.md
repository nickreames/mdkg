---
id: task-343
type: task
title: harden writer lock coverage and atomic write audit
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [multi-writer, locking, atomic-writes, 0-3-7]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-139]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Audit and harden mdkg mutating command paths so branch/multi-writer repair does
not add unsafe writes.

# Acceptance Criteria

- Every mutating command path is categorized as locked, lock-free by design, or
  read-only.
- Commands that write graph/config/index/bundle/archive/project-db state use
  repo-local mutation locks or have an explicit safe exception.
- Markdown/config writes use atomic write helpers or exclusive file creation as
  appropriate.
- Tests cover parallel creation/checkpoint behavior and absence of duplicate
  ids or truncated files.

# Files Affected

- `src/util/lock.ts`
- `src/util/atomic.ts`
- mutating command tests
- possible operator audit docs

# Implementation Notes

- Do not add a public lock-inspection CLI unless tests prove command-level
  auditing is insufficient.
- Treat SQLite id reservation as a complement to, not a replacement for,
  filesystem mutation locks.

# Test Plan

- `test-139`
- parallel temp repo mutation tests
- `npm run test`

# Links / Artifacts

- `edd-21`
- `test-139`
