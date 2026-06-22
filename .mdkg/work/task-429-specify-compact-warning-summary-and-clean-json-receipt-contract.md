---
id: task-429
type: task
title: specify compact warning-summary and clean JSON receipt contract
status: done
priority: 1
epic: epic-114
parent: goal-23
tags: [warnings, json, contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Lock the public receipt contract for warning-heavy validation and heading-format commands before implementation.

# Acceptance Criteria

- `validate` keeps full `warnings` and `warning_diagnostics` arrays by default.
- JSON receipts add deterministic `warning_summary` and truncation metadata.
- `--summary` emits bounded diagnostics suitable for agent logs.
- `--limit <n>` bounds sampled diagnostics in summary mode.
- `--json-out <path>` writes the full clean JSON receipt while `--out <path>` remains a text report.

# Files Affected

- src/commands/validate.ts
- src/commands/format.ts
- CLI_COMMAND_MATRIX.md

# Implementation Notes

- Keep output additive and backward-compatible unless a separate decision records otherwise.

# Test Plan

- Unit tests assert default and summary receipt shapes.
- Command matrix documents both text report and clean JSON receipt paths.

# Links / Artifacts

- spike-12
- test-191
- test-192
