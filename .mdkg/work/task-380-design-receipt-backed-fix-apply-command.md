---
id: task-380
type: task
title: design receipt backed fix apply command
status: todo
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, fix-apply, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-6]
blocks: [task-382]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design receipt-backed `mdkg fix apply` behavior for graph repair plans.

# Acceptance Criteria

- Plan receipts identify every rewritten id and reference.
- Apply refuses dirty or unsupported states unless explicitly allowed.
- Output is deterministic and reviewable.

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md

# Implementation Notes

- Use spike findings before implementation.
- Keep dry-run-first behavior.

# Test Plan

- Design notes reviewed before task-382.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
