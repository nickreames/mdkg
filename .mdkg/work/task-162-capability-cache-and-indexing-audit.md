---
id: task-162
type: task
title: capability cache and indexing audit
status: done
priority: 1
epic: epic-28
tags: [release, audit, capability-cache, index]
owners: []
links: []
artifacts: [src/commands/capability.ts, src/graph/capabilities_indexer.ts, src/graph/capabilities_index_cache.ts]
relates: [epic-28, epic-19, epic-20, epic-21]
blocked_by: []
blocks: [task-163, task-164]
refs: [rule-3, edd-3]
aliases: [capability-cache-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Audit the JSON capability cache and indexing behavior added after 0.1.1.
Capability cache remains a derived view from Markdown, not a replacement source
of truth.

# Acceptance Criteria

- `mdkg index` writes `global.json`, `skills.json`, and `capabilities.json`.
- `mdkg capability list/search/show` works for skills, specs, work contracts,
  core docs, and design docs.
- Normal task/epic/test/checkpoint nodes are not projected as capability
  records.
- Child workspace capability aggregation honors enabled workspaces and advisory
  visibility metadata.
- Missing or stale `capabilities.json` is recoverable through index rebuild or
  auto-reindex.
- Doctor and validate report capability cache health clearly.

# Files Affected

Read-only audit targets:
- `src/commands/capability.ts`
- `src/graph/capabilities_indexer.ts`
- `src/graph/capabilities_index_cache.ts`
- `src/commands/index.ts`
- `src/commands/doctor.ts`

# Implementation Notes

Keep SQLite DAL work out of this release audit. SQLite remains future optional
cache infrastructure and should not be required for `0.1.4`.

# Test Plan

- Run `npm run smoke:capabilities`.
- Run `node --test dist/tests/commands/capability.test.js dist/tests/graph/capabilities_indexer.test.js`.
- Confirm `node dist/cli.js doctor --json` reports capability cache health.

# Links / Artifacts

- `epic-19`
- `epic-20`
- `epic-21`

# Audit Evidence

- `npm run smoke:capabilities` passed.
- `npm run test` passed capability/indexing coverage for:
  - deterministic projection of skills, `SPEC.md`, `WORK.md`, core docs, and
    design docs
  - exclusion of normal task/epic/test/checkpoint nodes from capability cache
  - child workspace capability aggregation with visibility metadata
  - cache rebuild when missing or stale
  - stale cache reads when reindex is disabled
  - `mdkg capability list/search/show` JSON envelopes
- `node dist/cli.js validate` passed after all tests and smokes.
- Package dry-run contents include `dist/commands/capability.js`,
  `dist/graph/capabilities_indexer.js`, and
  `dist/graph/capabilities_index_cache.js`.

# Result

Capability cache generation, stale rebuild behavior, child workspace
aggregation, and capability command discovery are release-ready.
