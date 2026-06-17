---
id: task-375
type: task
title: add archived goal status and goal-state support
status: todo
priority: 1
epic: epic-86
parent: goal-16
tags: [0.3.3, archived, goals]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-373]
blocks: [task-376, test-161]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Add archived goal semantics so historical roadmap goals can be preserved without remaining actionable.

# Acceptance Criteria

- Archived is accepted for goal lifecycle state/status as designed.
- Archived goals are readable and ref-valid.
- Archived goals are excluded from default actionable routing.
- Explicit list/search filters can include archived goals.

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md
- assets/init/**

# Implementation Notes

- Do not apply archived to legacy files until this support is tested.
- Record compatibility behavior for older graphs.

# Test Plan

- Unit tests for parser and routing.
- CLI tests for list/show/search filters.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
