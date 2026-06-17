---
id: task-402
type: task
title: add live demo handoff prompts
status: todo
priority: 2
epic: epic-98
parent: goal-20
tags: [0.3.7, handoff, demo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-398, task-399, task-400, task-401]
blocks: [test-171, test-172, task-403]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Write handoff prompts for agents to run the demo from the selected goal.

# Acceptance Criteria

- Prompt starts from the template goal id.
- Prompt explains preview deployment and optional promotion boundaries.
- Prompt includes validation and checkpoint requirements.

# Files Affected

- .mdkg/work/**
- docs/**

# Implementation Notes

- Keep prompts copy-ready but not executable by default.

# Test Plan

- Dry-run handoff review.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
