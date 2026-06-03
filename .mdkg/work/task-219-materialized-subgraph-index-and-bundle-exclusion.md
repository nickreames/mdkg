---
id: task-219
type: task
title: materialized subgraph index and bundle exclusion
status: done
priority: 1
epic: epic-38
prev: task-218
next: task-220
tags: [subgraph, materialize, index, validation]
owners: []
links: []
artifacts: []
relates: [task-218, epic-22]
blocked_by: []
blocks: []
refs: [rule-3]
aliases: [materialized-subgraph-exclusion]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Ensure generated `.mdkg/subgraphs` inspection trees cannot be indexed or bundled
as local root graph content.

# Acceptance Criteria

- `mdkg index`, `search`, `show`, `pack`, `validate`, and SQLite hydration ignore
  `.mdkg/subgraphs`.
- `mdkg bundle create` excludes materialized views.
- Materialized content never appears as local root nodes.
- Subgraph qid mutation guards continue to reject child graph mutations.

# Files Affected

- `src/graph/workspace_files.ts`
- `src/commands/bundle.ts`
- tests

# Implementation Notes

The conventional generated root is `.mdkg/subgraphs`, but command behavior
should keep target roots generated and ignored when `--gitignore` is requested.

# Test Plan

- Materialize a bundle, run index/search/validate, and prove extracted nodes are
  absent as local root nodes.
- Bundle the root and prove `.mdkg/subgraphs` is excluded.

# Links / Artifacts

- `task-218`
- Implemented `.mdkg/subgraphs` exclusion from bundle creation and confirmed local graph scanning ignores materialized views.
- Evidence: focused subgraph tests disable a subgraph after materialization and prove `search`, `index`, and `validate` do not treat extracted files as local root nodes.
