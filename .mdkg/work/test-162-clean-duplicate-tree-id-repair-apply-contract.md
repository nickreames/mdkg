---
id: test-162
type: test
title: clean duplicate tree id repair apply contract
status: todo
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, id-repair]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-382]
blocks: []
refs: []
aliases: []
skills: []
cases: [Duplicate IDs in a clean tree are detected., Repair plan preserves base IDs and rewrites incoming IDs., Apply leaves graph validation clean.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate clean duplicate tree id repair apply contract.

# Target / Scope

- task-382

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Duplicate IDs in a clean tree are detected.
- Repair plan preserves base IDs and rewrites incoming IDs.
- Apply leaves graph validation clean.

# Expected Evidence

- Temp-repo repair receipt.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
