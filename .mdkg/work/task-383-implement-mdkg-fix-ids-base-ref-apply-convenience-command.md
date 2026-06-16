---
id: task-383
type: task
title: implement mdkg fix ids base-ref apply convenience command
status: todo
priority: 2
epic: epic-90
parent: goal-17
tags: [0.3.4, fix-ids, git]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-382]
blocks: [test-163, test-164, task-384]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Implement `mdkg fix ids --base-ref main --apply --json` as the focused ID repair command surface.

# Acceptance Criteria

- Command can plan and apply duplicate ID repair.
- Command handles clean trees and unresolved Git conflict-stage inputs.
- Main/base IDs are preserved by default.

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md

# Implementation Notes

- Expose one command surface for both phases.
- Refuse unsafe Git state with receipts.

# Test Plan

- Branch fixture tests.
- Git-stage conflict smoke.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
