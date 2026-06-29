---
id: test-321
type: test
title: website demo template goal only startup contract
status: done
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, template, goal, next, pack]
owners: []
links: []
artifacts: [examples/demo-runs/demo-001/DEMO_RUN_RECEIPT.md, scripts/smoke-demo-graph.js]
relates: []
blocked_by: [task-618, task-620]
blocks: [task-621]
refs: [edd-58]
context_refs: [edd-58]
evidence_refs: []
aliases: []
skills: []
cases: [forked template validates from a fresh branch path., mdkg goal next goal-1 selects the intended first node., mdkg pack <first-node> --profile concise --dry-run --stats is sufficient for an agent handoff.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that the canonical website demo template can start from one goal id
after being forked into a branch path.

# Target / Scope

- `task-618`
- `task-620`
- `examples/website-demo-template/`
- `examples/demo-runs/demo-001/`

# Preconditions / Environment

- Canonical template exists.
- A fresh branch-path run can be created without hidden chat context.

# Test Cases

- Forked template validates from a fresh branch path.
- `mdkg goal next goal-1 --json` selects the intended first node.
- `mdkg pack <first-node> --profile concise --dry-run --stats` is sufficient
  for an agent handoff.

# Results / Evidence

Pending.

# Notes / Follow-ups

- This contract must pass before Vercel preview work starts.
