---
id: test-431
type: test
title: Workflow import event and changed-only validation preserve complete identity
status: done
priority: 1
epic: epic-243
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: [task-771]
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prove imported workflow identity, event history, and changed-only warning coverage
remain complete across success and failure.

# Target / Scope

`task-771`; work invocation/order/event and changed-only validation.

# Preconditions / Environment

Local and subgraph-qualified work fixtures, injected append failures, new workflow
directories, and unrelated baseline warnings.

# Test Cases

- Qualified trigger identity survives order creation and event append.
- Append/mutation failure leaves no unlogged orphan order; retry is deterministic.
- New workflow-directory file warnings appear in changed-only output.
- Unrelated unchanged warnings do not flood changed-only output.

# Results / Evidence

Pending. Attach order/event joins and changed-path warning receipts.

# Notes / Follow-ups

- Preserve semantic-mirror boundaries and structured output envelopes.
