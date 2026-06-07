---
id: test-127
type: test
title: capability sync strict validation and receipt helper contract
status: todo
priority: 2
epic: epic-68
tags: [test, capability-sync, strict-validation, receipt]
owners: []
links: []
artifacts: []
relates: [goal-12, task-319, task-320]
blocked_by: [task-319, task-320]
blocks: [task-321]
refs: []
aliases: [subgraph-capability-sync-receipt-validation]
skills: []
cases: [visibility, strict-mode, refresh-receipt]
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Validate capability summary, strict validation, and refresh receipt semantics.

# Target / Scope

- Capability sync summary.
- Strict subgraph validation.
- Refresh receipt helper.

# Preconditions / Environment

- Designs are complete.

# Test Cases

- Private content is not leaked in summaries.
- Strict validation fails stale or unaccepted states.
- Refresh receipt includes accepted SHA, bundle hash, verification result, and
  no-secret summary.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None.
