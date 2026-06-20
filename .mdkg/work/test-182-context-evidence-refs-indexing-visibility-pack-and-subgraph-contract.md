---
id: test-182
type: test
title: context evidence refs indexing visibility pack and subgraph contract
status: done
priority: 1
epic: epic-106
parent: goal-22
tags: [refs, indexing, pack, subgraph]
owners: []
links: []
artifacts: []
relates: [task-416]
blocked_by: [task-416]
blocks: []
refs: []
aliases: [semantic-refs-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate that context and evidence refs behave as semantic reference lanes rather than executable scope.

# Target / Scope

- Work node frontmatter parsing.
- JSON and SQLite indexes.
- Search/show/pack output.
- Visibility policy and subgraph qids.

# Preconditions / Environment

- Temp repo with local refs, URI refs, and configured read-only subgraph refs.

# Test Cases

- `context_refs` and `evidence_refs` parse and validate on work nodes.
- Refs appear in show/search/pack/index output.
- Pack traversal includes referenced context without making it actionable.
- Visibility checks preserve public/internal/private boundaries.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Pair with `npm run smoke:semantic-refs`.
