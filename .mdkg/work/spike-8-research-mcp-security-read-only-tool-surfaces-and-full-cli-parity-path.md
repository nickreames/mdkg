---
id: spike-8
type: spike
title: research MCP security read-only tool surfaces and full CLI parity path
status: todo
priority: 2
epic: epic-95
parent: goal-19
tags: [0.3.6, spike, mcp, security]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-392, task-396]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Research Question

What local MCP surface gives orchestrators useful mdkg graph access now while preserving CLI-first single-writer ownership?

# Context And Constraints

- Phase one is read-only.
- Long-term path may include explicit lifecycle mutations, but broad CLI parity is future work.
- Manual node body editing remains LLM/agent responsibility.

# Search Plan

- Review MCP security and local-server patterns.
- Map mdkg CLI JSON outputs to read-only MCP tools.
- Identify future mutation allowlist boundaries and approval requirements.

# Findings

- Pending research.

# Options And Tradeoffs

- Pending research.

# Recommendation

- Pending research-backed recommendation.

# Follow-Up Nodes To Create

- task-392
- task-393
- task-394
- task-396
- test-168
- test-169
- test-170

# Skill Candidates

- Record repeatable workflows that should become mdkg skills after the spike is complete.

# Data Structures And Algorithms Notes

- Capture relevant structure, algorithm, and scaling implications discovered during research.

# UX Notes

- Capture command naming, operator experience, and docs implications.

# Security Notes

- Capture trust boundaries, no-secret requirements, and mutation safety implications.

# Evidence And Sources

- Add local files, command receipts, external documentation, and citations during spike execution.
