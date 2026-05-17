---
id: epic-19
type: epic
title: json capability cache and dal foundation
status: progress
priority: 1
tags: [0_1_2, capability-cache, index, dal]
owners: []
links: []
artifacts: [src/graph/capabilities_indexer.ts, src/graph/capabilities_index_cache.ts, src/commands/capability.ts, CLI_COMMAND_MATRIX.md, README.md]
relates: [epic-18, epic-20, epic-21, epic-22, epic-23, epic-24, epic-27]
blocked_by: []
blocks: [epic-20, epic-21]
refs: []
aliases: [capability-cache-json, json-capabilities]
skills: []
created: 2026-05-14
updated: 2026-05-14
---

# Goal

Implement the first JSON-backed mdkg capability cache as a derived access layer over Markdown.

# Scope

The cache covers deterministic capability surfaces only:
- canonical skills
- `SPEC.md`
- `WORK.md`
- core docs
- design docs

Normal task, epic, test, checkpoint, bug, and feat nodes remain in the standard graph index and are not duplicated into the capability cache.

This cache is a query and projection layer. It is related to, but not equivalent
to, the future full `.mdkg` graph snapshot bundle work. Snapshot bundles are
portable read-only graph transport artifacts; capability cache records remain
derived access metadata.

# Milestones

- `mdkg index` writes `.mdkg/index/capabilities.json` alongside the existing node and skill indexes.
- Capability records aggregate enabled registered workspaces.
- Workspace visibility metadata is indexed and filterable as advisory source metadata.
- `mdkg capability list/search/show` exposes deterministic JSON output.
- `mdkg doctor` reports capability cache health.
- Capability cache deletion is recoverable through index rebuild or capability command auto-reindex.
- Tests and smoke coverage prove skills, `SPEC.md`, `WORK.md`, core docs, design docs, child workspaces, and exclusion of normal work nodes.

# Out of Scope

- No SQLite runtime dependency in this epic.
- No vector search, embeddings, generated summaries, or hosted index.
- No hard permission enforcement beyond recording visibility metadata.

# Risks

- Capability records must remain deterministic projections of Markdown, not a second source of truth.
- Workspace aggregation must not accidentally expose child repo internals as enforced permissions before a formal visibility model exists.
- Cache staleness checks must stay cheap enough for normal CLI use.
- Future snapshot bundle import must not treat capability-cache presence as the
  full source-of-truth graph.

# Links / Artifacts

- `src/graph/capabilities_indexer.ts`
- `src/graph/capabilities_index_cache.ts`
- `src/commands/capability.ts`
- `scripts/smoke-capabilities.js`
- `CLI_COMMAND_MATRIX.md`
- `epic-22`
- `epic-23`
