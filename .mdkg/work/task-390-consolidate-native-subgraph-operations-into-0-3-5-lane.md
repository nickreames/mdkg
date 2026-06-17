---
id: task-390
type: task
title: consolidate native subgraph operations into 0.3.5 lane
status: todo
priority: 2
epic: epic-94
parent: goal-18
tags: [0.3.5, subgraph]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-389]
blocks: [task-391]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Align existing subgraph sync/materialize safety with clone/import workflows.

# Acceptance Criteria

- Existing surfaces are audited as current functionality.
- No-cross-repo-mutation guarantees are documented.
- Materialized-tree safety remains strict.

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md

# Implementation Notes

- Do not reintroduce existing commands as new.

# Test Plan

- Subgraph smoke remains green.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
