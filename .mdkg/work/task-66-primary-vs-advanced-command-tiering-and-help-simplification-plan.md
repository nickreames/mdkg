---
id: task-66
type: task
title: primary vs advanced command tiering and help simplification plan
status: done
priority: 1
epic: epic-7
tags: [v0_5, cli, ux, docs]
owners: []
links: []
artifacts: []
relates: [dec-11, edd-9, task-60, task-61, test-30, epic-7]
blocked_by: []
blocks: [test-30]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Define a primary-vs-advanced command model so mdkg docs and help teach fewer commands without breaking compatibility.

# Acceptance Criteria

- Primary commands are explicitly named and justified.
- Advanced commands are de-emphasized in first-run docs/help.
- Simplification guidance stays generic and does not become Omni-specific.

# Files Affected

- src/cli.ts
- README.md
- .mdkg/core/rule-3-cli-contract.md

# Implementation Notes

- Compatibility comes first; hide complexity before removing it.

# Test Plan

- Validate via `test-30`.

# Links / Artifacts

- epic-7
