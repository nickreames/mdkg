---
id: task-175
type: task
title: subgraph projection and sqlite hydration
status: done
priority: 1
epic: epic-21
tags: [subgraph, sqlite, index, projection, cache]
owners: []
links: []
artifacts: []
relates: [epic-21, epic-20, task-174]
blocked_by: []
blocks: [task-176, task-177, task-179]
refs: []
aliases: [subgraph-sqlite-hydration]
skills: []
created: 2026-05-27
updated: 2026-05-30
---

# Overview

Project configured subgraph bundle records into local JSON and SQLite indexes so
root graphs can query child capabilities without scanning child checkouts.

# Acceptance Criteria

- Imported bundle records include subgraph alias, original qid, source repo/path,
  bundle hash, bundle profile, freshness state, visibility, permissions, and
  read-only source metadata.
- SQLite indexes subgraph records as rebuildable derived state.
- JSON compatibility caches remain available for non-SQLite paths.
- Local graph state remains valid on its own; subgraph records are read-only
  planning context.
- Read commands can distinguish local actionable nodes from imported subgraph
  reference nodes.

# Files Affected

- graph projection/index modules
- SQLite index modules
- cache health and reindex tests

# Implementation Notes

Do not make SQLite the durable interchange format. Rebuild it from local
markdown, archive sidecars, bundle manifests, and configured subgraph bundle
sources.

# Test Plan

- Unit tests for projected qids, source metadata, stale state, permissions, and
  read-only flags.
- SQLite rebuild test proves subgraph data is restored after deleting the DB.
- JSON-mode test proves non-SQLite users receive equivalent read behavior.

# Verification Evidence

Completed in the 0.1.4 implementation pass.

- Replaced import projection internals with `src/graph/subgraphs.ts`.
- `mdkg index` now writes `.mdkg/index/subgraphs.json`.
- Subgraph records project under `<alias>:<id>` with read-only source metadata,
  original qid/path, visibility, permissions, bundle profile/hash, freshness,
  warnings, and errors.
- SQLite schema version was bumped and rebuilt with subgraph source metadata.
- Verified with `npm run smoke:sqlite`, `npm run smoke:subgraph`, and local
  `node dist/cli.js index` / `node dist/cli.js validate`.

# Links / Artifacts

- `epic-20`
- `epic-21`
- `task-174`
