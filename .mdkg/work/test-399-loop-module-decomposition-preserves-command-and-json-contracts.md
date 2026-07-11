---
id: test-399
type: test
title: Loop module decomposition preserves command and JSON contracts
status: todo
priority: 2
tags: [loop, cli, descriptor, regression]
owners: []
links: []
artifacts: []
relates: [loop-6, task-728, goal-60, prop-5]
blocked_by: []
blocks: []
refs: [loop-6, task-728, goal-60, prop-5]
context_refs: [spike-31, prop-5]
evidence_refs: [spike-31]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Define the future compatibility contract for decomposing loop command internals without changing the operator-facing or machine-readable loop surface.

# Target / Scope

- `task-728`
- `mdkg loop list`, `show`, `fork`, `plan`, `next`, and `runs`
- Typed descriptor help, generated docs, dry-run, readiness, routing, and provenance behavior

# Preconditions / Environment

Run against source and an installed tarball with both JSON and SQLite backends. Use the seeded loop catalog and deterministic temporary workspaces.

# Test Cases

- Preserve command flags, exit behavior, JSON envelope fields, and text help for every loop command.
- Preserve dry-run ID reuse and zero-write guarantees.
- Preserve readiness identity isolation, optional/required approvals, lane waivers, and closeout projections.
- Preserve stale/current/missing-template provenance states and non-destructive warnings.
- Preserve installed-package seven-seed smoke coverage and generated command-contract parity.

# Results / Evidence

This is a future `goal-60` acceptance contract. Results remain pending until that goal authorizes implementation; current v0.5.0 regression receipts establish the baseline to compare against.

# Notes / Follow-ups

- Avoid snapshot-only coverage where semantic assertions can make compatibility failures clearer.
- Broader generic CLI descriptor rollout remains a separate decision after the loop pilot is stable.
