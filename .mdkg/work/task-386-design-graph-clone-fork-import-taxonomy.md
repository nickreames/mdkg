---
id: task-386
type: task
title: design graph clone fork import taxonomy
status: todo
priority: 2
epic: epic-92
parent: goal-18
tags: [0.3.5, clone, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-7]
blocks: [task-387, task-388]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design clone, fork, and import terminology and command boundaries.

# Acceptance Criteria

- Separate-repo clone preserves IDs.
- Same-repo import rewrites IDs.
- Template import can select start goal.

# Files Affected

- src/**
- CLI_COMMAND_MATRIX.md
- .mdkg/work/**

# Implementation Notes

- Avoid ambiguous clone/import names.

# Test Plan

- Design review in node body.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
