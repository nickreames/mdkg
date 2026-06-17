---
id: test-166
type: test
title: same repo graph import rewrites ids and links contract
status: todo
priority: 2
epic: epic-93
parent: goal-18
tags: [0.3.5, import]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-388]
blocks: []
refs: []
aliases: []
skills: []
cases: [Import into same repo rewrites colliding IDs., All links are rewritten according to receipt., Imported start goal routes correctly.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate same repo graph import rewrites ids and links contract.

# Target / Scope

- task-388

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Import into same repo rewrites colliding IDs.
- All links are rewritten according to receipt.
- Imported start goal routes correctly.

# Expected Evidence

- Import receipt and validation output.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
