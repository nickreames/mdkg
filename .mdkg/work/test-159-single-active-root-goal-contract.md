---
id: test-159
type: test
title: single active root goal contract
status: done
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
cases: [Multiple active local root goals fail validation., Activating one goal pauses competing active local root goals., Default current/next routes through the selected or unique active goal.]
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

- Multiple active local root goals fail validation.
- Activating one goal pauses competing active local root goals.
- Default current/next routes through the selected or unique active goal.

# Expected Evidence

- Unit and CLI test output.

# Results / Evidence

- Passed on 2026-06-16.
- `node --test dist/tests/commands/goal.test.js` passed 12 tests, including `goal activate selects target and pauses competing active root goals` and `goal next without selection falls back only for a unique active goal`.
- `node --test dist/tests/graph/validate_graph.test.js` passed 5 tests, including `collectGraphErrors rejects multiple active local root goals`.

# Notes / Follow-ups

- Archived-goal routing belongs to `test-161`.
