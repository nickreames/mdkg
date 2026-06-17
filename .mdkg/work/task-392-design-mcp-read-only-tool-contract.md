---
id: task-392
type: task
title: design mcp read only tool contract
status: todo
priority: 2
epic: epic-95
parent: goal-19
tags: [0.3.6, mcp, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-8]
blocks: [task-393, task-394, task-396]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design read-only local MCP tools for mdkg graph inspection.

# Acceptance Criteria

- Tools cover status, search, show, pack, goal current/next, and validation summaries.
- No mutation tools are enabled in phase one.
- Output contracts map cleanly to CLI JSON.

# Files Affected

- src/**
- docs/**
- .mdkg/work/**

# Implementation Notes

- Manual node body editing remains an agent responsibility.

# Test Plan

- Design review before implementation.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
