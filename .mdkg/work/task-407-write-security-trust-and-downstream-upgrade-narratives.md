---
id: task-407
type: task
title: write security trust and downstream upgrade narratives
status: todo
priority: 2
epic: epic-103
parent: goal-21
tags: [0.4.0, trust, downstream]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-405]
blocks: [test-176, task-408]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Write public trust, no-secret, dry-run, subgraph safety, and downstream upgrade narratives.

# Acceptance Criteria

- No-secret policy is explicit.
- Dry-run boundaries are clear.
- Downstream upgrade story is practical and tested.

# Files Affected

- docs/**
- README.md
- .mdkg/work/**

# Implementation Notes

- Avoid overpromising deferred capabilities.

# Test Plan

- No-secret audit.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
