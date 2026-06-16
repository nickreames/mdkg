---
id: test-169
type: test
title: mcp read only no mutation contract
status: todo
priority: 2
epic: epic-95
parent: goal-19
tags: [0.3.6, mcp, security]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-394]
blocks: []
refs: []
aliases: []
skills: []
cases: [MCP exposes no broad mutation tools., Mutation attempts fail or are absent., No secrets are exposed.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate mcp read only no mutation contract.

# Target / Scope

- task-394
- task-396

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- MCP exposes no broad mutation tools.
- Mutation attempts fail or are absent.
- No secrets are exposed.

# Expected Evidence

- Security/no-mutation receipt.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
