---
id: task-297
type: task
title: add smoke coverage for trigger to order to receipt verification
status: done
priority: 1
epic: epic-57
parent: goal-9
prev: task-296
next: task-298
tags: [smoke, work, trigger, receipt]
owners: []
links: []
artifacts: [scripts]
relates: [goal-9, test-112, test-113]
blocked_by: [task-296]
blocks: [task-298]
refs: [dec-27]
aliases: [trigger-order-receipt-smoke]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Add an end-to-end packed temp-repo smoke that proves the semantic invocation
loop.

# Acceptance Criteria

- Smoke creates or uses a work contract, triggers an order, creates a final receipt, verifies the receipt, validates the repo, and checks deterministic JSON.
- Smoke does not run external workers or mutate production state.
- Smoke is included in the prepublish ladder.

# Files Affected

- `scripts`
- `package.json`

# Implementation Notes

- Use a packed temp repo shape so package consumers are exercised.

# Test Plan

- New smoke script.
- `npm run smoke:archive-work`
- `npm run prepublishOnly`

# Links / Artifacts

- `test-112`
- `test-113`
