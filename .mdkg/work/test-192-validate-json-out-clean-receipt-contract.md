---
id: test-192
type: test
title: validate json-out clean receipt contract
status: done
priority: 1
epic: epic-114
parent: goal-23
tags: [validate, json, test]
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

Prove callers can obtain clean full JSON validation receipts without relying on warning-heavy stdout.

# Target / Scope

- validate `--json-out`
- validate `--out` compatibility
- summary stdout bounds

# Preconditions / Environment

- Warning-heavy temp repo.
- Writable temp path for JSON receipt and text report.

# Test Cases

- `validate --json-out <path> --summary --json` writes a parseable full receipt to `<path>`.
- Summary stdout remains bounded.
- `validate --out <path> --json` keeps writing the compatibility text report.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If users need clean JSON artifacts, document `--json-out` rather than changing `--out`.
