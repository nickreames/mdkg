---
id: test-25
type: test
title: 0.0.4 manual docs alignment audit contract
status: done
priority: 1
epic: epic-5
tags: [v0_4, docs, governance, audit]
owners: []
links: []
artifacts: [cmd:node_dist_cli_help_parity_audit_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [prd-1, prd-2, dec-10, edd-2, edd-3, edd-7, task-56, implement-5, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [docs-audit]
cases: [help-readme-parity-audit, source-gap-matrix-refresh-audit, planned-vs-implemented-language-audit]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Validate presence and completeness of manual docs alignment audit guidance for 0.0.4.

# Target / Scope

Covers governance process documentation for release-cut parity checks and gap refreshes.

# Preconditions / Environment

- `task-56` and linked docs nodes are integrated
- manual audit path is selected over scripted automation for 0.0.4

# Test Cases

- Verify audit loop includes `mdkg --help` vs README parity checks.
- Verify audit loop includes source-gap matrix refresh checks.
- Verify audit loop includes planned-vs-implemented wording checks.
- Verify cadence expectations are documented for 0.0.4.x cuts.

# Results / Evidence

Capture `mdkg show` outputs for `task-56`, `prd-1`, `prd-2`, and `edd-7`.

# Notes / Follow-ups

- Reassess automation options in a later release if manual audit load grows.
