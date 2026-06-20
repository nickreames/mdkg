---
id: test-187
type: test
title: project DB queue adapter contract stability
status: done
priority: 1
epic: epic-110
parent: goal-22
tags: [queue, contract]
owners: []
links: []
artifacts: []
relates: [task-421]
blocked_by: [task-421]
blocks: []
refs: []
aliases: [queue-contract-test]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate the public queue adapter contract for downstream integrations.

# Target / Scope

- Queue docs.
- Queue contract JSON or generated reference.
- Public `mdkg db queue` behavior.

# Preconditions / Environment

- Fresh project DB temp repo.

# Test Cases

- Contract describes payload hash, dedupe, claim order, lease ownership, retry, dead-letter, release-expired, pause/resume, snapshot policy, and stats.
- Public CLI behavior matches the contract.
- Contract states queue rows are delivery state, not canonical runtime history.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Reuse existing queue smokes where possible.
