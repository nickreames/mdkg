---
id: test-446
type: test
title: Real root baseline classifies unrelated state and proves no-touch hashes
status: done
priority: 0
epic: epic-252
tags: [release, root-graph, baseline, no-touch]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-785]
blocks: [task-786]
refs: [goal-71, task-785]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-15
---
# Overview

Ensure the real consumer proof has an approved, attributable no-touch baseline.

# Target / Scope

Root Git state, untracked classification, local archive files, imported bundles,
child repositories, gitlinks, materializations, and graph validation.

# Preconditions / Environment

Use live `/Users/nick/omni-chat-rooms` state only after approval; do not mutate.

# Test Cases

- Unrelated state is acknowledged and excluded from staging/mutation.
- Complete hashes and Git/tree identities are captured.
- Baseline validation and stale-warning inventory are recorded separately.

# Results / Evidence

Pending approved baseline checkpoint.

# Notes / Follow-ups

- Incomplete classification blocks `task-786`.
