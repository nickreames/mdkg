---
id: test-172
type: test
title: Vercel preview deploy handoff contract
status: todo
priority: 2
epic: epic-99
parent: goal-20
tags: [0.3.7, vercel]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-399, task-402]
blocks: []
refs: []
aliases: []
skills: []
cases: [Preview deploy instructions are explicit., Secrets are external to mdkg., Promotion is separate from preview.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate Vercel preview deploy handoff contract.

# Target / Scope

- task-399
- task-402

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Preview deploy instructions are explicit.
- Secrets are external to mdkg.
- Promotion is separate from preview.

# Expected Evidence

- Handoff review receipt.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
