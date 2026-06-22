---
id: task-430
type: task
title: implement validate warning summaries compact output and JSON receipt output
status: done
priority: 1
epic: epic-114
parent: goal-23
tags: [validate, warnings, json]
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

Implement scalable `mdkg validate` warning output so large repos can produce useful, bounded receipts without losing full diagnostics.

# Acceptance Criteria

- `mdkg validate --json` includes `warning_summary`.
- `mdkg validate --summary --json --limit 20` prints bounded warnings and diagnostics with truncation metadata.
- `mdkg validate --json-out <path> --summary --json` writes a full parseable JSON receipt to the path.
- `mdkg validate --out <path> --json` still writes the existing text report path for compatibility.
- 1000+ warning fixtures remain deterministic and parseable.

# Files Affected

- src/commands/validate.ts
- tests/commands/validate.test.ts

# Implementation Notes

- Summary mode must preserve full error checking.
- Machine-readable JSON should stay on stdout when `--json` is requested.

# Test Plan

- `npm run test -- tests/commands/validate.test.ts`
- `npm run smoke:warning-ux`

# Links / Artifacts

- task-429
- test-191
- test-192
