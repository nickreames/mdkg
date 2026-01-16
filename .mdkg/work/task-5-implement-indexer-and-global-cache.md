---
id: task-5
type: task
title: implement indexer and global cache (global.json)
status: done
priority: 1
epic: epic-1
tags: [cache, index, workspaces]
owners: []
links: [index:global.json, ws:registered-only]
artifacts: [global-json, indexer, reverse-edges, staleness-check]
relates: [dec-2, dec-3, edd-1]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Overview

Build the indexer that scans registered workspaces and produces `.mdkg/index/global.json`.

# Acceptance Criteria

- indexer reads workspace registry from config
- scans each workspace’s `.mdkg/` docs folders for markdown nodes
- builds node map with qids and normalized edges
- builds reverse edges (children-of-epic, blocked graphs, etc.)
- writes deterministic JSON output to `.mdkg/index/global.json`
- strict mode fails on invalid frontmatter; tolerant mode can skip invalid nodes

# Files Affected

- src/graph/indexer.ts
- src/graph/validate_graph.ts
- src/graph/staleness.ts
- src/commands/index.ts

# Implementation Notes

- Treat templates as non-nodes (do not index `.mdkg/templates/`).
- Normalize edges to qids internally.
- Include workspace alias and relative file path on each node.

# Test Plan

- run `mdkg index` and verify global.json contains at least root docs
- introduce invalid frontmatter to confirm strict failure behavior

# Links / Artifacts

- edd-1
- dec-2, dec-3
