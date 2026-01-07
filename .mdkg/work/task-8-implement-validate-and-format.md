---
id: task-8
type: task
title: implement validate and format commands
status: todo
priority: 2
epic: epic-1
tags: [validate, format]
links: [cmd:validate, cmd:format]
artifacts: [validator, formatter, enum-checks, dangling-edge-checks, chain-cycle-checks]
relates: [rule-6, dec-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-06
---

# Overview

Implement strict validation and conservative formatting to keep the repo consistent and robust against LLM edits.

# Acceptance Criteria

- `mdkg validate`:
  - strict frontmatter checks
  - required fields per type
  - enum checks for status/priority
  - dangling edge detection
  - cycle detection in prev/next
  - duplicate IDs detection
- `mdkg format`:
  - normalizes frontmatter key ordering and formatting
  - normalizes casing to lowercase
  - does not destructively modify body

# Files Affected

- src/commands/validate.ts
- src/commands/format.ts
- src/graph/validate_graph.ts
- src/graph/frontmatter.ts

# Implementation Notes

- `format` should be safe and idempotent.
- Prefer producing clear diffs for git review.

# Test Plan

- introduce an invalid enum and confirm validate fails
- run format and confirm it normalizes a messy frontmatter list

# Links / Artifacts

- rule-6
- dec-4