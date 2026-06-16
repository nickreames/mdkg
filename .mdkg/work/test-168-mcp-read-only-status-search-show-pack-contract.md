---
id: test-168
type: test
title: mcp read only status search show pack contract
status: todo
priority: 2
epic: epic-95
parent: goal-19
tags: [0.3.6, mcp]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-394]
blocks: []
refs: []
aliases: []
skills: []
cases: [MCP status/search/show/pack tools return CLI-equivalent data., Outputs are bounded and structured.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate mcp read only status search show pack contract.

# Target / Scope

- task-394

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- MCP status/search/show/pack tools return CLI-equivalent data.
- Outputs are bounded and structured.

# Expected Evidence

- MCP smoke output.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
