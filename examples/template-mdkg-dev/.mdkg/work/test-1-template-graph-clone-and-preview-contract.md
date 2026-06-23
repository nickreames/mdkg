---
id: test-1
type: test
title: Template graph clone and preview contract
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [template, validation, preview-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-1]
blocks: []
refs: []
context_refs: [goal-1, spike-1, task-1, edd-3, dec-1]
evidence_refs: [chk-1]
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that the template graph can be cloned or forked, started from `goal-1`, and used to produce a local website candidate without production promotion.

# Target / Scope

- goal-1
- spike-1
- task-1
- edd-3
- dec-1

# Preconditions / Environment

- Local mdkg CLI available.
- No Vercel credentials, analytics IDs, DNS access, or production secrets required.

# Test Cases

- `mdkg goal next goal-1 --json` returns `spike-1` or the next unblocked scoped node.
- `mdkg pack goal-1 --profile concise` contains enough context for an agent to begin.
- Local candidate-site check passes.
- Closeout records discard, preview, or later promotion recommendation.

# Results / Evidence

Record outcomes in a checkpoint after implementation.

# Notes / Follow-ups

- Future preview deployment should be a separate explicit goal with teardown/promotion evidence.
