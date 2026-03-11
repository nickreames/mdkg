---
id: test-21
type: test
title: 0.0.4 checkpoint hybrid selection determinism contract
status: done
priority: 1
epic: epic-5
tags: [v0_4, checkpoint, determinism]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05]
relates: [prd-1, dec-10, edd-3, edd-6, edd-8, task-52, implement-3, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [checkpoint-hybrid]
cases: [pack-time-authoritative-selection, hybrid-hint-fallback, tie-break-determinism]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Validate planned deterministic behavior for hybrid latest-checkpoint selection.

# Target / Scope

Covers the docs contract where pack-time selection is authoritative and index hints are optional optimizations.

# Preconditions / Environment

- `dec-10` and `task-52` are integrated
- episodic/memory EDDs reference hybrid selection rules

# Test Cases

- Verify pack-time resolver is explicitly authoritative.
- Verify stale hint behavior does not override pack-time selection.
- Verify deterministic tie-break expectations are documented.
- Verify `chk-*` ID conventions remain explicit in examples/contracts.

# Results / Evidence

Capture `mdkg show` outputs for `task-52`, `edd-3`, `edd-6`, and `edd-8`.

# Notes / Follow-ups

- Add runtime deterministic fixture tests after implementation.
