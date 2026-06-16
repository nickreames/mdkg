---
id: task-373
type: task
title: design mdkg goal activate command and single-active semantics
status: todo
priority: 1
epic: epic-85
parent: goal-16
tags: [0.3.3, goal-activate, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-372]
blocks: [task-374]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design the command and state transition rules that make goal activation explicit and single-writer friendly.

# Acceptance Criteria

- Define `goal activate` behavior relative to `goal select`, `goal claim`, and `goal current`.
- Define failure behavior when another root goal is already active.
- Define how paused and archived goals behave.

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md
- README.md
- assets/init/**

# Implementation Notes

- Preserve subgraph independence.
- Do not archive legacy goals until task-375 support exists.

# Test Plan

- Design review in node body.
- Unit and CLI tests planned in task-374.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
