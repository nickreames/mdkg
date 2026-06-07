---
id: test-123
type: test
title: internal helper compatibility and public DB CLI contract
status: todo
priority: 2
epic: epic-66
parent: goal-11
tags: [db, cli, compatibility, test, deferred]
owners: []
links: []
artifacts: []
relates: [task-312, task-313]
blocked_by: [task-312]
blocks: []
refs: []
aliases: []
skills: []
cases: [public-db-cli, internal-helper-compatibility, no-arbitrary-sql]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate future public DB CLI surfaces preserve internal helper compatibility
and do not expose arbitrary SQL.

# Target / Scope

- `task-312`
- `task-313`

# Preconditions / Environment

- Deferred until public DB CLI taxonomy is approved.

# Test Cases

- Existing queue/event/reducer/lease/materializer helper smokes remain green.
- Public CLI receipts match approved taxonomy.
- No arbitrary SQL is exposed.

# Results / Evidence

- Deferred.

# Notes / Follow-ups

- Not part of 0.3.0.
