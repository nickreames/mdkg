---
id: test-158
type: test
title: versioned roadmap routing and active 0.3.3 goal contract
status: done
priority: 1
epic: epic-88
parent: goal-16
tags: [0.3.3, routing, alignment]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [goal current identifies goal-16 or no selected conflict before closeout., goal next goal-16 routes to task-372 before alignment closeout., Later goals are paused.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate versioned roadmap routing and active 0.3.3 goal contract.

# Target / Scope

- goal-16
- task-372

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- `goal current` identifies goal-16 or no selected conflict before closeout.
- `goal next goal-16` routes to task-372 before alignment closeout.
- Later goals are paused.

# Expected Evidence

- Validation receipt and goal-next receipt.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
