---
id: test-23
type: test
title: 0.0.4 redaction policy doc contract safe vs strict
status: done
priority: 1
epic: epic-5
tags: [v0_4, events, security, redaction]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [prd-1, dec-10, edd-6, edd-8, task-53, implement-4, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [safe-strict]
cases: [safe-policy-guidance, strict-policy-guidance, docs-only-boundary]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Validate planned documentation contract for redaction policy levels and boundaries.

# Target / Scope

Covers policy semantics in docs only; no runtime redaction behavior is asserted.

# Preconditions / Environment

- `task-53`, `edd-6`, and `edd-8` are integrated
- policy-level language is present for `safe` and `strict`

# Test Cases

- Verify `safe` policy guidance is documented.
- Verify `strict` policy guidance is documented.
- Verify docs clearly mark runtime implementation as deferred.
- Verify artifact-reference-over-dump guidance is documented.

# Results / Evidence

Capture `mdkg show` outputs for `task-53`, `edd-6`, and `edd-8`.

# Notes / Follow-ups

- Add pattern-level redaction tests once implementation design is approved.
