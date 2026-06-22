---
id: test-191
type: test
title: 1000 warning validate summary and bounded output contract
status: done
priority: 1
epic: epic-114
parent: goal-23
tags: [validate, warnings, test]
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
cases: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Prove `mdkg validate` remains usable when a repo has 1000 or more heading warnings.

# Target / Scope

- validate command JSON output
- high-volume heading warnings
- summary grouping and truncation metadata

# Preconditions / Environment

- Temp repo or fixture with at least 1000 warning-producing mdkg nodes.

# Test Cases

- `validate --summary --json --limit 20` emits parseable JSON.
- Output includes grouped warning counts and truncation metadata.
- Output does not include every diagnostic in summary mode.
- Full errors still run and remain strict.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If full diagnostics are needed, use default JSON or `--json-out`.
