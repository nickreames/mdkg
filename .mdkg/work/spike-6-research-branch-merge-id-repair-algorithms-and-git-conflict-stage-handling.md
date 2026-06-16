---
id: spike-6
type: spike
title: research branch merge ID repair algorithms and Git conflict-stage handling
status: todo
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, spike, id-repair, git]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-380, task-381, task-383]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Research Question

What repair model best resolves duplicate mdkg IDs created on separate branches while preserving links and prioritizing main branch IDs?

# Context And Constraints

- Both clean-tree duplicate repair and unresolved Git conflict-stage repair belong to the same future command surface.
- Base/main IDs should win by default.
- Repair output must be receipt-shaped and auditable.

# Search Plan

- Review Git index stage behavior and common merge-conflict tooling patterns.
- Inspect mdkg node reference fields and validation failure modes.
- Compare deterministic rename-map and content-hash-assisted repair approaches.

# Findings

- Pending research.

# Options And Tradeoffs

- Pending research.

# Recommendation

- Pending research-backed recommendation.

# Follow-Up Nodes To Create

- task-380
- task-381
- task-383
- test-162
- test-163
- test-164

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
