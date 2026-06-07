---
id: test-114
type: test
title: optional project DB queue bridge validation
status: done
priority: 2
epic: epic-58
parent: goal-9
prev: test-113
next: test-115
tags: [db, queue, work-order]
owners: []
links: []
artifacts: []
relates: [goal-9, task-294]
blocked_by: [task-294]
blocks: []
refs: [dec-27]
aliases: [work-trigger-queue-bridge-validation]
skills: []
cases: [enqueue-bridge, missing-db-error]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate the opt-in queue bridge for triggered work orders.

# Test Cases

- Trigger with `--enqueue` writes a delivery message when DB and queue exist.
- Missing DB or queue returns a clear error.
- Queue payload references the work order and payload hash.
