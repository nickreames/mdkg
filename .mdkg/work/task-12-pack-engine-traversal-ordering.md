---
id: task-12
type: task
title: implement pack engine traversal, ordering, and limits
status: done
priority: 2
epic: epic-2
tags: [pack, traversal, ordering]
links: [rule:pack, cmd:pack]
artifacts: [pack-engine]
relates: [rule-2, rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

Implement the core pack engine that selects nodes, orders them deterministically, and enforces limits while recording truncation metadata.

# Acceptance Criteria

- BFS traversal from root to depth with default edges plus `--edges` additions
- de-duplicate by `qid` and preserve root regardless of limits
- deterministic ordering per rule-2 (task-root ordering + fallback ordering)
- verbose core inclusion from `.mdkg/core/core.md` with warnings for missing/ambiguous IDs
- truncation metadata recorded (max_nodes/max_bytes + dropped list)

# Files Affected

- src/pack/pack.ts
- src/pack/order.ts
- src/pack/truncate.ts
- src/pack/verbose_core.ts

# Implementation Notes

- use global index and resolve IDs as qids when needed
- exclude raw frontmatter from body extraction
- prefer high-priority types when enforcing limits

# Test Plan

- covered in task-18 pack tests

# Links / Artifacts

- rule-2
- rule-3
