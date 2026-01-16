---
id: task-10
type: task
title: implement checkpoints and pack integration
status: todo
priority: 3
epic: epic-1
tags: [checkpoint, pack]
owners: []
links: [cmd:checkpoint, pack:checkpoint-ordering, type:checkpoint]
artifacts: [checkpoint-indexed, checkpoint-new, pack-checkpoint-priority]
relates: [dec-7, rule-2]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Overview

Add checkpoint node support and ensure packs treat checkpoints as high-value context anchors.

# Acceptance Criteria

- `mdkg checkpoint new "<title>"` creates a `chk-*` node using global template
- checkpoints are allowed per workspace and indexed normally
- pack ordering includes related checkpoints early (after epic/parent)
- checkpoint nodes can include `scope` list without breaking parsing

# Files Affected

- src/commands/checkpoint.ts
- src/pack/pack.ts
- src/templates/loader.ts

# Implementation Notes

- Keep checkpoint creation simple in v1.
- `scope` in frontmatter is optional; do not enforce hard.

# Test Plan

- create a checkpoint and verify it appears in search/list
- generate a pack for a task that relates to the checkpoint and confirm ordering

# Links / Artifacts

- dec-7
- rule-2
