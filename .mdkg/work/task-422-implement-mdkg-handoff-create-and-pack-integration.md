---
id: task-422
type: task
title: implement mdkg handoff create and pack integration
status: done
priority: 1
epic: epic-111
parent: goal-22
tags: [handoff, pack, agent]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-416, task-418]
blocks: [test-188, task-423]
refs: []
aliases: [handoff-create-command]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Add `mdkg handoff create` as a first-class command for sanitized agent handoffs.

# Acceptance Criteria

- `mdkg handoff create <id-or-qid> --json` emits a structured receipt and writes or prints a copy-ready handoff artifact.
- Handoffs include objective, current state, boundaries, required checks, relevant nodes, checkpoints, validation evidence, and next actions.
- Handoffs use pack, context/evidence refs, goal state, and checkpoint summaries.
- Raw-content marker warnings are included; structural failures fail closed.

# Files Affected

- CLI command dispatcher and help.
- Pack/handoff helper modules.
- Docs, command matrix, and help snapshots.

# Implementation Notes

- Handoff generation packages context and boundaries; it does not author detailed node content automatically.
- The command should expose structured JSON receipts for agent orchestration.

# Test Plan

- Unit tests for handoff output and raw-marker warnings.
- npm run smoke:handoff
- test-188

# Links / Artifacts

- test-188
