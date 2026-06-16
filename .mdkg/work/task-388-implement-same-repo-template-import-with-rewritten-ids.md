---
id: task-388
type: task
title: implement same repo template import with rewritten ids
status: todo
priority: 2
epic: epic-93
parent: goal-18
tags: [0.3.5, template-import]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-386]
blocks: [test-166, task-389]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Implement same-repo template import with deterministic ID and link rewriting.

# Acceptance Criteria

- No ID collisions remain.
- Every rewritten reference has a receipt entry.
- Imported graph can be scoped to a selected goal.

# Files Affected

- src/**
- tests/**
- scripts/**

# Implementation Notes

- Reuse ID repair machinery where possible.

# Test Plan

- Template import smoke.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
