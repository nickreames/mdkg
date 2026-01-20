---
id: task-8
type: task
title: implement validate and format commands
status: done
priority: 2
epic: epic-1
tags: [format, validate]
owners: []
links: [cmd:format, cmd:validate]
artifacts: [chain-cycle-checks, dangling-edge-checks, enum-checks, formatter, validator]
relates: [dec-4, rule-6]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-20
---

# Overview

Implement strict validation and conservative formatting to keep the repo consistent and robust against LLM edits.

# Acceptance Criteria

- `mdkg validate`:
  - strict frontmatter checks
  - required fields per type
  - enum checks for status/priority (from config)
  - dangling edge detection
  - cycle detection in prev/next
  - prev/next mismatch detection (A.next=B requires B.prev=A, and vice versa)
  - duplicate IDs detection
  - unknown keys are errors (templates are superset of allowed keys)
  - collect all errors and exit once (allow `--out <path>` to write full report, including warnings)
  - `--quiet` suppresses warning output to stderr
- `mdkg format`:
  - normalizes frontmatter key ordering and formatting
  - normalizes casing to lowercase
  - lowercases semantic list entries and sorts lists for stability (preserve case for links/artifacts)
  - does not destructively modify body
  - updates `updated: YYYY-MM-DD` to today when formatting changes are applied

# Files Affected

- src/commands/validate.ts
- src/commands/format.ts
- src/graph/validate_graph.ts
- src/graph/frontmatter.ts

# Implementation Notes

- `format` should be safe and idempotent.
- Prefer producing clear diffs for git review.
- Validation must use config-provided enums (`work.status_enum`, `priority_min`, `priority_max`).
- Unknown frontmatter keys must fail validation; templates must include the superset of keys.
- Validation should skip `.mdkg/core/core.md` (non-node list file); no other exclusions expected.

# Test Plan

- introduce an invalid enum and confirm validate fails
- run format and confirm it normalizes a messy frontmatter list
- verify list lowercasing + sorting and `updated` timestamp refresh
- verify unknown key detection and prev/next mismatch detection

# Links / Artifacts

- rule-6
- dec-4
