---
id: task-408
type: task
title: run final mdkg dev no secret and example e2e
status: todo
priority: 2
epic: epic-103
parent: goal-21
tags: [0.4.0, launch-gate, e2e]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-406, task-407]
blocks: [test-176, test-177, task-409]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Run final launch-readiness checks for public docs and examples.

# Acceptance Criteria

- Public examples run in temp repos.
- No secrets or local absolute paths leak.
- Generated reference matches CLI contract.

# Files Affected

- scripts/**
- docs/**

# Implementation Notes

- Use temp directories for evidence.

# Test Plan

- Launch gate smoke.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
