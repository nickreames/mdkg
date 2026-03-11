---
id: task-61
type: task
title: followup cli defaults simplification and compat map
status: done
priority: 1
epic: epic-7
tags: [v0_5, cli, defaults, compat]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, dec-11, edd-9, task-60, task-66, test-29, epic-7]
blocked_by: []
blocks: [test-29]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Define simplified defaults and a compatibility roadmap for command/flag transitions.

# Acceptance Criteria

- Simplification proposal includes compatibility/deprecation guidance.
- Proposed defaults reduce unnecessary configuration for common flows.
- Proposal keeps `pack <id>` central in the primary workflow.
- Proposal keeps the generic OSS story anchored on `init --llm`.

# Files Affected

- src/cli.ts
- README.md
- .mdkg/core/rule-3-cli-contract.md

# Implementation Notes

- Follow-up work; not a v0.0.4 release blocker.

# Test Plan

- Validate compatibility expectations with `test-29`.

# Links / Artifacts

- prd-1
- dec-11
- epic-7
