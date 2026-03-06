---
id: test-14
type: test
title: v0.4 agent memory orchestrator guidance contract
status: todo
priority: 1
epic: epic-4
tags: [v0_4, memory-model, orchestration]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-3, edd-6, task-43]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [single-writer-guidance, commit-cadence-guidance, checkpoint-batching-guidance, docs-vs-runtime-boundary]
created: 2026-02-27
updated: 2026-02-27
---

# Overview

Validate planned v0.4 guidance for external orchestrators managing memory updates, batching, and checkpoint cadence.

# Target / Scope

Covers documentation contracts for safe memory mutation flow without asserting runtime enforcement by mdkg commands.

# Preconditions / Environment

- `edd-3` and `edd-6` linked roadmap docs are integrated
- source-truth gap notes are current
- runtime behavior remains unchanged in this docs pass

# Test Cases

- Verify single-writer policy is documented as external orchestrator guidance.
- Verify commit cadence guidance includes end-of-run and checkpoint batching behaviors.
- Verify docs explicitly discourage commit-on-every-tool-call behavior.
- Verify latest-checkpoint inclusion is documented as a default requirement when available.
- Verify docs clearly distinguish guidance contracts from implemented CLI/runtime enforcement.

# Results / Evidence

Capture `mdkg show` outputs for `edd-3`, `edd-6`, `dec-8`, `dec-9`, and `task-43` and check wording consistency.

# Notes / Follow-ups

- Add runtime enforcement tests only if future implementations introduce explicit orchestration guards.
- Add examples for multi-agent orchestrator handoff if supported later.
