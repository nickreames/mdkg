---
id: test-159
type: test
title: single active root goal contract
status: todo
priority: 1
epic: epic-85
parent: goal-16
tags: [0.3.3, single-active]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-374]
blocks: []
refs: []
aliases: []
skills: []
cases: [Creating or activating a second root active goal fails., Activating one goal deactivates or refuses others according to the accepted design., Default current/next ignores archived goals.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate single active root goal contract.

# Target / Scope

- task-374

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Creating or activating a second root active goal fails.
- Activating one goal deactivates or refuses others according to the accepted design.
- Default current/next ignores archived goals.

# Expected Evidence

- Unit and CLI test output.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
