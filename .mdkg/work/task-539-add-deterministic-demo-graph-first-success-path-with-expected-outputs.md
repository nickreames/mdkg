---
id: task-539
type: task
title: add deterministic demo graph first-success path with expected outputs
status: todo
priority: 1
epic: epic-176
parent: goal-34
tags: [mdkg-dev, demo, first-success]
owners: []
links: []
artifacts: []
relates: [goal-34, task-532, task-533, test-263]
blocked_by: [task-537]
blocks: [task-540, task-543]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-45, dec-43]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Give users one deterministic first success path with expected outputs and validation proof.

# Acceptance Criteria

- Demo includes or documents one goal, task, spike, checkpoint, decision, skill, and passing validation.
- Quickstart explains how to use returned IDs instead of hardcoding brittle numeric IDs.
- Each command has a short expected result.
- Demo path takes under 10 minutes.
- `test-263` passes.

# Files Affected

- `docs/**`
- `mdkg-dev/**`
- `examples/**`
- demo smoke scripts if needed

# Implementation Notes

- Keep demos noindex until promotion.
- Do not link unfinished demos as canonical proof.

# Test Plan

Run the documented demo path in a temp repo or fixture and assert expected outputs.

# Links / Artifacts

- `test-263`
