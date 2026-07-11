---
id: test-423
type: test
title: linked upgrade idempotency and partial race receipt contract
status: todo
priority: 1
parent: goal-68
tags: [goal-68, test, idempotency, partial]
owners: []
links: []
artifacts: []
relates: [task-760]
blocked_by: [task-760]
blocks: []
refs: [goal-68, dec-79]
context_refs: [edd-73]
evidence_refs: []
aliases: [linked-upgrade-partial-receipt-test]
skills: []
cases: [complete-apply, idempotent-rerun, pre-apply-race, mid-apply-failure, pending-set]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Prove deterministic successful apply, clean idempotent rerun, and truthful
partial evidence when state changes after strict preflight.

# Target / Scope

- Sequential apply, mutation locks, race recheck, aggregate receipt.

# Preconditions / Environment

- Controllable temporary multi-repo fixtures.

# Test Cases

- Complete apply matches every accepted child receipt.
- Second run reports no writes.
- Race before first write leaves all untouched.
- Mid-apply injected failure stops and lists applied/failed/pending roots.
- Receipt never claims rollback or atomicity after writes start.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- Operator decides remediation from the partial receipt.
