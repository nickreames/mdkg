---
id: test-164
type: test
title: link preservation after id rewrite contract
status: done
priority: 2
epic: epic-91
parent: goal-17
tags: [0.3.4, links]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-383]
blocks: []
refs: []
aliases: []
skills: []
cases: [Parents, epics, blockers, scope refs, relates, aliases, and supported body refs remain linked., Rewrite receipt maps old IDs to new IDs.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate link preservation after id rewrite contract.

# Target / Scope

- task-381
- task-383

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Parents, epics, blockers, scope refs, relates, aliases, and supported body refs remain linked.
- Rewrite receipt maps old IDs to new IDs.

# Expected Evidence

- Graph validation and targeted show/search checks.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
