---
id: test-95
type: test
title: public queue CLI contract
status: done
priority: 1
epic: epic-33
parent: goal-7
tags: [project-db, queue, cli, test]
owners: []
links: []
artifacts: []
relates: [goal-7, task-262, task-261]
blocked_by: [task-262]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Validate the public `mdkg db queue ...` command contract.

# Target / Scope

`mdkg db queue` help, dispatch, JSON receipts, queue lifecycle, and error
handling.

# Preconditions / Environment

Temp repo with `mdkg init --agent`, `mdkg db init`, and `mdkg db migrate`.

# Test Cases

- Help lists all queue commands and no longer says public queue CLI is absent.
- Create, pause, resume, enqueue, duplicate enqueue, claim, ack, fail,
  dead-letter, release-expired, stats, list, and show return stable JSON.
- Paused queues reject enqueue and claim.
- Wrong-worker ack/fail is rejected.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- No top-level `mdkg queue` alias in this release.
