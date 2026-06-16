---
id: task-387
type: task
title: implement separate repo graph clone preserving ids
status: todo
priority: 2
epic: epic-92
parent: goal-18
tags: [0.3.5, clone]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-386]
blocks: [test-165, task-389]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Implement separate-repo graph clone that preserves node IDs and graph links.

# Acceptance Criteria

- Destination repo validates.
- IDs and links are preserved.
- Source repo is not mutated.

# Files Affected

- src/**
- tests/**
- scripts/**

# Implementation Notes

- Root-contained path checks required.

# Test Plan

- Temp-repo clone smoke.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
