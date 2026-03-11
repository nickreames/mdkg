---
id: test-29
type: test
title: 0.0.4x cli defaults compatibility regression contract
status: done
priority: 1
epic: epic-7
tags: [v0_5, cli, compat, regression]
owners: []
links: []
artifacts: [CLI_COMMAND_MATRIX.md, .mdkg/core/rule-3-cli-contract.md, README.md]
relates: [task-61, task-62, epic-7]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [default-behavior-shifts, deprecation-guidance, script-compatibility]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Validate compatibility guidance and regression coverage for CLI default simplification changes.

# Target / Scope

Ensures simplified defaults preserve predictable behavior or provide explicit migration guidance.

# Preconditions / Environment

- Simplification proposal and compatibility map are available.

# Test Cases

- Verify changed defaults are documented with migration guidance.
- Verify scripted workflows have compatibility notes.

# Results / Evidence

Capture compatibility matrix and regression notes.

# Notes / Follow-ups

Expand with executable regression tests during implementation.
