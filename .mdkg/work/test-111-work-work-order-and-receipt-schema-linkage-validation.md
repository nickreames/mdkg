---
id: test-111
type: test
title: WORK WORK_ORDER and RECEIPT schema linkage validation
status: done
priority: 1
epic: epic-56
parent: goal-9
prev: test-110
next: test-112
tags: [work, work-order, receipt, schema]
owners: []
links: []
artifacts: []
relates: [goal-9, task-288, task-289, task-290]
blocked_by: [task-288, task-289, task-290]
blocks: []
refs: [dec-27]
aliases: [work-order-receipt-linkage-validation]
skills: []
cases: [valid-linkage, invalid-linkage]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate schema links from work contract to order to receipt.

# Test Cases

- Valid WORK, WORK_ORDER, and RECEIPT fixture chain passes.
- Missing or mismatched refs fail with actionable diagnostics.
- Hash, proof, artifact, and status fields are validated.
