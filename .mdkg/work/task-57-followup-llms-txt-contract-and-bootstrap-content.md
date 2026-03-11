---
id: task-57
type: task
title: followup llms txt contract and bootstrap content
status: done
priority: 1
epic: epic-6
tags: [v0_4x, docs, llm]
owners: []
links: []
artifacts: []
relates: [prd-2, dec-11, edd-9, task-45, task-64, test-26, epic-6]
blocked_by: []
blocks: [test-26]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Create root `llms.txt` with deterministic mdkg usage bootstrap guidance.

# Acceptance Criteria

- Defines docs index, command starter list, directory shape, and pack-first workflow guidance.
- Keeps `init --llm` as the generic OSS bootstrap path.
- Treats `init --omni` as optional agent-ready scaffolding.
- Stays source-truth aligned to current CLI behavior.

# Files Affected

- llms.txt
- README.md

# Implementation Notes

- Non-blocking follow-up for post-0.0.4 cut.

# Test Plan

- Validate via `test-26` contract checks.

# Links / Artifacts

- prd-2
- dec-11
- epic-6
