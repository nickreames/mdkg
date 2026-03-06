---
id: task-60
type: task
title: followup cli command matrix inventory and complexity audit
status: todo
priority: 1
epic: epic-7
tags: [v0_5, cli, audit]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, test-28, epic-7]
blocked_by: []
blocks: [test-28]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Inventory all command flags and identify simplification opportunities with deterministic defaults.

# Acceptance Criteria

- Command/flag matrix is captured with usage frequency and simplification candidates.
- Backward compatibility implications are documented.

# Files Affected

- src/cli.ts
- README.md

# Implementation Notes

- Follow-up work; not a v0.4.0 release blocker.

# Test Plan

- Validate inventory completeness with `test-28`.

# Links / Artifacts

- prd-1
- epic-7
