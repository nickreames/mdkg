---
id: task-395
type: task
title: add mcp temp repo smoke tests
status: todo
priority: 2
epic: epic-96
parent: goal-19
tags: [0.3.6, mcp, smoke]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-394]
blocks: [task-397]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Add temp-repo smoke coverage for local MCP graph inspection.

# Acceptance Criteria

- Fresh repo can be inspected through MCP.
- Subgraph selection is read-only.
- No mutation occurs.

# Files Affected

- scripts/**
- package.json

# Implementation Notes

- Use local temp dirs.

# Test Plan

- Run smoke directly and through prepublish.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
