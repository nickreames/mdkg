---
id: test-26
type: test
title: v0.4x llms txt and prompt snippet artifact contract
status: todo
priority: 1
epic: epic-6
tags: [v0_4x, docs, llm, validation]
owners: []
links: []
artifacts: []
relates: [task-57, task-59, epic-6]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [llms-txt-fields, prompt-snippet-determinism, cli-parity-labeling]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Validate non-blocking follow-up artifacts for llms.txt and agent prompt snippet guidance.

# Target / Scope

Covers field-level completeness and parity with current CLI behavior.

# Preconditions / Environment

- Follow-up docs artifacts are present.

# Test Cases

- Verify llms.txt includes deterministic mdkg bootstrap content.
- Verify prompt snippet remains pack-first and deterministic.
- Verify command claims align with source-truth CLI help.

# Results / Evidence

Capture artifact snapshots and parity checks.

# Notes / Follow-ups

Track updates when CLI defaults evolve.
