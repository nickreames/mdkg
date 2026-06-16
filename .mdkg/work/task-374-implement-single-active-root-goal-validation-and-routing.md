---
id: task-374
type: task
title: implement single-active root goal validation and routing
status: todo
priority: 1
epic: epic-85
parent: goal-16
tags: [0.3.3, goal-lifecycle, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-373]
blocks: [test-159, test-160, task-378]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Implement single-active root goal enforcement and route default goal commands away from archived or conflicting states.

# Acceptance Criteria

- Multiple active root goals fail strict validation with typed diagnostics.
- Subgraphs can independently validate their own active goal without mutating root state.
- Default current/next routing is deterministic.

# Files Affected

- src/**
- tests/**
- scripts/**

# Implementation Notes

- Keep JSON diagnostics machine-readable.
- Avoid changing child repo state.

# Test Plan

- Unit tests for active-goal validation.
- Temp-repo smoke in task-378.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
