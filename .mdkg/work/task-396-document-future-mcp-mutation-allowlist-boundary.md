---
id: task-396
type: task
title: document future mcp mutation allowlist boundary
status: done
priority: 2
epic: epic-97
parent: goal-19
tags: [0.3.6, mcp, mutation-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-392]
blocks: [task-397]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Document how future MCP mutation allowlists could evolve without enabling broad mutation now.

# Acceptance Criteria

- Allowed future lifecycle writes are named.
- Secrets policy and operator approval boundaries are clear.
- Full CLI parity remains future work.

# Files Affected

- CLI_COMMAND_MATRIX.md
- README.md
- assets/init/**
- .mdkg/work/**

# Implementation Notes

- Do not implement broad mutation tools.

# Test Plan

- Docs-readiness smoke.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
