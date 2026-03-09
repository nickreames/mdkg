---
id: test-27
type: test
title: v0.4x example pack doc freshness contract
status: done
priority: 1
epic: epic-6
tags: [v0_4x, docs, examples, validation]
owners: []
links: []
artifacts: [PACK_EXAMPLES.md, README.md]
relates: [task-58, task-59, epic-6]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [task-pack-shape, edd-pack-shape, skills-pack-shape]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Validate example-pack documentation remains aligned with current pack output contracts.

# Target / Scope

Covers task/edd/skills example shape correctness and freshness checks.

# Preconditions / Environment

- Example pack docs are present.

# Test Cases

- Verify each example class maps to current pack fields/ordering expectations.
- Verify examples are updated when pack contract changes.

# Results / Evidence

Capture example snapshots and comparison notes.

# Notes / Follow-ups

Add automated drift checks if docs tooling is introduced later.
