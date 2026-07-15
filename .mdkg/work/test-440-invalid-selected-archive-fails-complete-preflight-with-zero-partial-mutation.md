---
id: test-440
type: test
title: Invalid selected archive fails complete preflight with zero partial mutation
status: done
priority: 0
epic: epic-249
tags: [archive, preflight, atomicity]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-778]
blocks: []
refs: [goal-70, task-778]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Prove one invalid local selection cannot leave earlier valid archives rewritten.

# Target / Scope

At least two selected local archives where the later sorted item has an invalid
source, containment, symlink, frontmatter, or destination condition.

# Preconditions / Environment

Hash every ZIP and sidecar before command execution.

# Test Cases

- Each invalid condition fails during full-set preflight.
- Every selected archive output remains byte-for-byte unchanged.
- No reindex or mutation receipt claims success.

# Results / Evidence

Passed: removing the later secondary raw archive caused full-set preflight to
fail, while both earlier root ZIP/sidecar and secondary ZIP/sidecar hashes
remained unchanged.

# Notes / Follow-ups

- Unexpected apply-time I/O rollback remains outside this test contract.
