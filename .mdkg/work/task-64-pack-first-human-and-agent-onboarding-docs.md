---
id: task-64
type: task
title: pack first human and agent onboarding docs
status: done
priority: 1
epic: epic-6
tags: [v0_4x, docs, onboarding, pack]
owners: []
links: []
artifacts: []
relates: [dec-11, edd-9, task-57, task-58, test-30, epic-6]
blocked_by: []
blocks: [test-30]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Rewrite onboarding docs around a shorter generic mdkg loop centered on `pack <id>` for human and agent collaboration.

# Acceptance Criteria

- Generic OSS path remains `init --llm`.
- Optional `init --omni` path is documented as agent-ready scaffolding, not the sole story.
- README and future `llms.txt` guidance teach the same pack-first mental model.

# Files Affected

- README.md
- llms.txt

# Implementation Notes

- Coordinate with `task-57` and `task-58`.

# Test Plan

- Validate via `test-30`.

# Links / Artifacts

- epic-6
