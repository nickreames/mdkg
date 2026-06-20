---
id: test-181
type: test
title: achieved goal last-active-node and no stale next warning contract
status: done
priority: 1
epic: epic-105
parent: goal-22
tags: [goal-lifecycle, test]
owners: []
links: []
artifacts: []
relates: [task-415]
blocked_by: [task-415]
blocks: []
refs: []
aliases: [last-active-node-test]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate completed-goal lifecycle behavior after `last_active_node` support lands.

# Target / Scope

- Goal closeout commands.
- Goal routing and validation.
- Upgrade or migration path for existing achieved goals.

# Preconditions / Environment

- Temp repo with active, paused, blocked, done, achieved, and archived goals.

# Test Cases

- Closing a goal moves `active_node` to `last_active_node`.
- Done/achieved goals return `node: null` without stale actionable warnings.
- Archived goals remain non-actionable and readable.
- Migration preserves previous final active node ids.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Pair with `npm run smoke:goal-lifecycle`.
