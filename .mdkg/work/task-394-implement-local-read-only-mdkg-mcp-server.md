---
id: task-394
type: task
title: implement local read only mdkg mcp server
status: done
priority: 2
epic: epic-95
parent: goal-19
tags: [0.3.6, mcp, implementation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-392, task-393]
blocks: [test-168, test-169, test-170, task-395]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Implement the first local read-only mdkg MCP server.

# Acceptance Criteria

- Server starts locally.
- Read-only tools call the same graph APIs as the CLI.
- Mutation attempts are absent or refused.

# Files Affected

- src/**
- tests/**
- package.json

# Implementation Notes

- Keep auth and network exposure conservative.

# Test Plan

- MCP unit tests and temp smoke.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
