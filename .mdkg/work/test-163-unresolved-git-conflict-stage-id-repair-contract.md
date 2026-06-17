---
id: test-163
type: test
title: unresolved Git conflict stage id repair contract
status: done
priority: 2
epic: epic-90
parent: goal-17
tags: [0.3.4, git-conflict]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-383]
blocks: []
refs: []
aliases: []
skills: []
cases: [Unresolved conflict-stage mdkg files can be inspected., Repair command reports staged alternatives., Apply resolves ID collisions or fails closed with receipt.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate unresolved Git conflict stage id repair contract.

# Target / Scope

- task-383

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Unresolved conflict-stage mdkg files can be inspected.
- Repair command reports staged alternatives.
- Apply resolves ID collisions or fails closed with receipt.

# Expected Evidence

- Git fixture receipt.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
