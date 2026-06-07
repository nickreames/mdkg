---
id: test-122
type: test
title: public worker execution no-secret runtime contract
status: todo
priority: 2
epic: epic-65
parent: goal-11
tags: [security, worker, execution, test, deferred]
owners: []
links: []
artifacts: []
relates: [task-310, task-311]
blocked_by: [task-310]
blocks: []
refs: []
aliases: []
skills: []
cases: [no-secret-runtime, operator-approval, execution-boundary]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate post-0.3.0 public worker execution does not capture secrets or bypass
operator approvals.

# Target / Scope

- `task-310`
- `task-311`

# Preconditions / Environment

- Deferred until worker execution design is approved.

# Test Cases

- Worker execution requires explicit operator approval.
- Runtime logs and receipts do not contain raw secrets.
- Execution cannot mutate production/payment/ledger state without explicit
  external authority.

# Results / Evidence

- Deferred.

# Notes / Follow-ups

- Not part of 0.3.0.
