---
id: task-382
type: task
title: implement mdkg fix apply
status: done
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, fix-apply, implementation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-380, task-381]
blocks: [test-162, task-383]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Implement receipt-backed apply behavior for accepted fix plans.

# Acceptance Criteria

- `mdkg fix apply --json` applies supported plans.
- Receipts include before/after ids and files.
- Unsupported plans fail closed.

# Files Affected

- src/**
- tests/**
- scripts/**

# Implementation Notes

- Keep mutation commands explicit.
- Preserve JSON stdout discipline.

# Test Plan

- Unit tests.
- Temp-repo clean duplicate repair.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
