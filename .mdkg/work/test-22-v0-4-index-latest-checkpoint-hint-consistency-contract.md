---
id: test-22
type: test
title: v0.4 index latest checkpoint hint consistency contract
status: done
priority: 1
epic: epic-5
tags: [v0_4, checkpoint, index]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05]
relates: [prd-1, dec-10, edd-2, edd-6, task-52, implement-3, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [latest_checkpoint_qid]
cases: [hint-present-shape, hint-stale-does-not-win, hint-pack-selection-consistency]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Validate planned consistency contracts for optional index hinting of latest checkpoints.

# Target / Scope

Covers metadata-hint expectations and their relationship to authoritative pack-time selection.

# Preconditions / Environment

- `task-52` and linked architecture docs are integrated
- hint remains planned metadata contract only

# Test Cases

- Verify optional hint field name `latest_checkpoint_qid` is documented consistently.
- Verify docs state hint is optimization only.
- Verify docs state authoritative pack-time resolution on hint mismatch.
- Verify checkpoint selection language remains deterministic.

# Results / Evidence

Capture `mdkg show` outputs for `task-52`, `edd-2`, and `edd-6`.

# Notes / Follow-ups

- Add index serializer/parser tests once hint field is implemented.
