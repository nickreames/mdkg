---
id: task-256
type: task
title: define safe projection export design
status: done
priority: 2
epic: epic-43
parent: goal-6
tags: [projection, exporter, no-secret]
owners: []
links: []
artifacts: []
relates: [goal-6, epic-43, test-92]
blocked_by: [task-255]
blocks: [task-257]
refs: [dec-21, dec-22, edd-14]
aliases: [safe-projection-export-design-task]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Design the future `.codex/agents` exporter while explicitly deferring
implementation.

# Acceptance Criteria

- Generated projection files must link back to source SPECs.
- Manual edits are detected and not silently overwritten.
- Export is no-secret by default.
- Unknown product-specific fields are projection metadata until explicitly
  supported.

# Files Affected

- Child mdkg planning nodes only.

# Implementation Notes

- Do not implement an exporter in this task.

# Test Plan

- `mdkg capability search "projection export" --json`

# Links / Artifacts

- `edd-14`
