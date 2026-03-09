---
id: test-28
type: test
title: v0.5 cli command matrix inventory contract
status: done
priority: 1
epic: epic-7
tags: [v0_5, cli, validation]
owners: []
links: []
artifacts: [CLI_COMMAND_MATRIX.md, src/cli.ts, README.md]
relates: [task-60, task-62, epic-7]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [command-matrix-completeness, flag-count-baseline, simplification-candidates]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Validate completeness and quality of the CLI command/flag inventory used for simplification planning.

# Target / Scope

Ensures inventory captures current command surfaces and complexity drivers.

# Preconditions / Environment

- Inventory artifact is available.

# Test Cases

- Verify all top-level commands are represented.
- Verify each command's option surface is captured and categorized.

# Results / Evidence

Capture matrix artifact and audit notes.

# Notes / Follow-ups

Update after major CLI feature additions.
