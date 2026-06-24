---
id: test-259
type: test
title: llms txt formatting and canonical agent path contract
status: todo
priority: 1
epic: epic-173
parent: goal-34
tags: [mdkg-dev, llms]
owners: []
links: []
artifacts: []
relates: [goal-34, task-535]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [plain-text-linebreaks, agent-path, no-raw-markers]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify LLM-facing text endpoints are readable, line-preserved, and safe.

# Target / Scope

`task-535`, `/llms.txt`, `/llms-full.txt`, and docs agent path copy.

# Preconditions / Environment

Local marketing build or preview plus direct HTTP fetch.

# Test Cases

- `llms.txt` responds as readable plain text with headings and bullets.
- Canonical agent path is present.
- No raw secret/prompt/token/payload markers appear.
- Browser/Chrome or direct HTTP proof is recorded.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- None.
