---
id: test-175
type: test
title: public examples temp repo contract
status: todo
priority: 2
epic: epic-102
parent: goal-21
tags: [0.4.0, examples]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-406]
blocks: []
refs: []
aliases: []
skills: []
cases: [Public examples execute in fresh temp repos., Examples avoid local-only paths and hidden state.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate public examples temp repo contract.

# Target / Scope

- task-406

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Public examples execute in fresh temp repos.
- Examples avoid local-only paths and hidden state.

# Expected Evidence

- Example smoke receipts.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
