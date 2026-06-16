---
id: test-161
type: test
title: archived legacy goal contract
status: todo
priority: 1
epic: epic-86
parent: goal-16
tags: [0.3.3, archived]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-375, task-376]
blocks: []
refs: []
aliases: []
skills: []
cases: [Archived goals validate., Archived goals are excluded from default actionable routing., Archived goals remain show/search/list accessible with explicit filters.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate archived legacy goal contract.

# Target / Scope

- task-375
- task-376

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Archived goals validate.
- Archived goals are excluded from default actionable routing.
- Archived goals remain show/search/list accessible with explicit filters.

# Expected Evidence

- CLI test and validation output.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
