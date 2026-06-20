---
id: test-184
type: test
title: checkpoint kind template heading and safety-warning contract
status: done
priority: 1
epic: epic-107
parent: goal-22
tags: [checkpoint, templates, safety]
owners: []
links: []
artifacts: []
relates: [task-418]
blocked_by: [task-418]
blocks: []
refs: []
aliases: [checkpoint-template-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate checkpoint kind templates, heading completeness, and raw-content warning behavior.

# Target / Scope

- `mdkg checkpoint new`.
- `mdkg task done --checkpoint`.
- Validation warning output.

# Preconditions / Environment

- Temp repo with task, test, audit, goal closeout, and handoff checkpoint cases.

# Test Cases

- Each checkpoint kind renders required headings.
- Generated checkpoint nodes pass validation.
- Raw marker examples produce warnings, not hard failures.
- Checkpoint receipts expose kind and created node id.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Pair with `npm run smoke:checkpoint-templates`.
