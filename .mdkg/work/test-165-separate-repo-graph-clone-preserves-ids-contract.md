---
id: test-165
type: test
title: separate repo graph clone preserves ids contract
status: todo
priority: 2
epic: epic-92
parent: goal-18
tags: [0.3.5, clone]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-387]
blocks: []
refs: []
aliases: []
skills: []
cases: [Clone into separate repo preserves IDs., Destination validates., Source is not mutated.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate separate repo graph clone preserves ids contract.

# Target / Scope

- task-387

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Clone into separate repo preserves IDs.
- Destination validates.
- Source is not mutated.

# Expected Evidence

- Temp-repo clone receipt.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
