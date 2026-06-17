---
id: test-170
type: test
title: mcp workspace and subgraph selection contract
status: todo
priority: 2
epic: epic-96
parent: goal-19
tags: [0.3.6, mcp, workspace]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-393, task-394]
blocks: []
refs: []
aliases: []
skills: []
cases: [Root workspace selection is explicit., Subgraph selection is read-only., Path containment is enforced.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate mcp workspace and subgraph selection contract.

# Target / Scope

- task-393
- task-394

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Root workspace selection is explicit.
- Subgraph selection is read-only.
- Path containment is enforced.

# Expected Evidence

- Workspace fixture output.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
