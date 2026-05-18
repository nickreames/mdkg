---
id: task-140
type: task
title: implement read only bundle projection and import cache
status: done
priority: 1
epic: epic-23
tags: [bundle-import, index, cache]
owners: []
links: []
artifacts: []
relates: [task-139]
blocked_by: []
blocks: [task-141, task-142, task-143, test-83]
refs: []
aliases: [bundle-import-projection]
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Load bundle manifests and bundled indexes without extraction, then project
enabled imports into alias-prefixed read-only graph views.

# Acceptance Criteria

- Imported nodes use `ws=<import-alias>` and `qid=<import-alias>:<id>`.
- Source metadata preserves original qid, workspace, path, bundle path/hash,
  bundle profile, import alias, visibility, read-only state, and stale state.
- Edges between nodes inside the same imported bundle are remapped to projected
  qids.
- Duplicate projected IDs inside one import fail verification with actionable
  guidance.
- `mdkg index` writes a derived `.mdkg/index/imports.json` cache and auto
  reindex refreshes it when config or bundle files change.

# Files Affected

- `src/graph/bundle_imports.ts`
- `src/graph/index_cache.ts`
- `src/graph/indexer.ts`
- `src/graph/node_body.ts`
- `src/commands/index.ts`

# Implementation Notes

- Projection loads bundle indexes directly from the ZIP and keeps authored
  child graph files in the bundle.
- Import cache is rebuildable and derived; the child bundle remains the source
  transport artifact.

# Test Plan

- Tests cover projection, edge remapping, duplicate IDs, source metadata,
  malformed bundles, missing indexes, stale bundle metadata, and cache writes.

# Results / Evidence

- `npm run test`
- `npm run smoke:bundle-import`
- `npm pack --dry-run --json`

# Links / Artifacts

- `.mdkg/index/imports.json`
