---
id: task-393
type: task
title: design mcp workspace and graph selection
status: todo
priority: 2
epic: epic-96
parent: goal-19
tags: [0.3.6, mcp, workspace]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-392]
blocks: [task-394, test-170]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design explicit root/workspace/subgraph selection for the local MCP server.

# Acceptance Criteria

- Root graph selection is explicit.
- Subgraph selection is read-only.
- Path containment is enforced.

# Files Affected

- src/**
- tests/**
- docs/**

# Implementation Notes

- Avoid hidden workspace switching.

# Test Plan

- Selection fixture tests.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
