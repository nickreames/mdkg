---
id: task-271
type: task
title: define SPEC validation diagnostics and command surface
status: todo
priority: 1
epic: epic-48
parent: goal-8
tags: [spec, validation, diagnostics, cli]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-48, test-102]
blocked_by: [task-268, task-270]
blocks: [task-272, task-276]
refs: [edd-14]
aliases: [spec-validation-diagnostics]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define future validation behavior and command-surface options for SPEC files.

# Acceptance Criteria

- Diagnostics distinguish fatal errors, warnings, repair suggestions, and
  informational notes.
- Candidate command surfaces are compared, including `mdkg spec validate` and
  integration with existing `mdkg validate` and capability commands.
- This task records a design, not source implementation.

# Test Plan

- `mdkg capability search "SPEC validation diagnostics" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Compare command-surface options without implementing them.

# Links / Artifacts

- `goal-8`
- `epic-48`
