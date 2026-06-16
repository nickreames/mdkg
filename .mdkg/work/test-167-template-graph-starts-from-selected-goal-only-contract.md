---
id: test-167
type: test
title: template graph starts from selected goal only contract
status: todo
priority: 2
epic: epic-94
parent: goal-18
tags: [0.3.5, template, demo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-389]
blocks: []
refs: []
aliases: []
skills: []
cases: [Template graph contains a selected goal., Agent handoff can start from that goal alone., No hidden chat context is required.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate template graph starts from selected goal only contract.

# Target / Scope

- task-389

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Template graph contains a selected goal.
- Agent handoff can start from that goal alone.
- No hidden chat context is required.

# Expected Evidence

- Pack and goal-next receipt.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
