---
id: task-67
type: task
title: coverage gap audit thresholds and hardening plan
status: done
priority: 1
epic: epic-8
tags: [v0_4x, coverage, reliability, tests]
owners: []
links: []
artifacts: []
relates: [dec-11, edd-9, task-63, test-32, epic-8]
blocked_by: []
blocks: [test-32]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Inventory remaining coverage gaps after manual behavior audit, then define practical thresholds and hardening priorities.

# Acceptance Criteria

- Coverage inventory calls out the highest-value user-facing gaps first.
- Threshold proposal includes line and branch targets plus sequencing.
- Plan distinguishes meaningful behavioral coverage from low-value branch padding.

# Files Affected

- package.json
- tests/

# Implementation Notes

- Coverage policy should follow behavior clarity, not precede it.

# Test Plan

- Validate via `test-32`.

# Links / Artifacts

- epic-8
