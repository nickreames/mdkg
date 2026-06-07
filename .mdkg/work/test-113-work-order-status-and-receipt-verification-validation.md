---
id: test-113
type: test
title: work order status and receipt verification validation
status: done
priority: 1
epic: epic-57
parent: goal-9
prev: test-112
next: test-114
tags: [work-order, receipt, verify]
owners: []
links: []
artifacts: []
relates: [goal-9, task-292, task-293]
blocked_by: [task-292, task-293]
blocks: []
refs: [dec-27]
aliases: [order-status-receipt-verify-validation]
skills: []
cases: [order-status-json, receipt-verify-json]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate the read-only status and receipt verification commands.

# Test Cases

- `mdkg work order status <order-id> --json` reports deterministic state.
- `mdkg work receipt verify <receipt-id> --json` validates final evidence.
- Invalid receipt linkage fails.
