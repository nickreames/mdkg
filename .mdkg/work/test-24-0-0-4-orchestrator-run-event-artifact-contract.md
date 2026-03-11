---
id: test-24
type: test
title: 0.0.4 orchestrator run event artifact contract
status: done
priority: 1
epic: epic-5
tags: [v0_4, orchestration, contract]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [prd-1, dec-10, edd-8, task-54, implement-4, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [run-envelope]
cases: [run-envelope-required-fields, event-required-fields, artifact-uri-conventions, commit-gate-guidance]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Validate planned minimal structured interoperability contract for external orchestrators.

# Target / Scope

Covers run/event/artifact field requirements and commit gate guidance from docs.

# Preconditions / Environment

- `edd-8` and `task-54` are integrated
- single-writer guidance remains documentation-level in 0.0.4

# Test Cases

- Verify run-envelope required fields are documented.
- Verify event required fields align with episodic guidance.
- Verify artifact URI conventions are documented.
- Verify commit gate behavior is explicit and consistent.

# Results / Evidence

Capture `mdkg show` outputs for `edd-8` and `task-54`.

# Notes / Follow-ups

- Add contract-validation fixtures when runtime adapters are implemented.
