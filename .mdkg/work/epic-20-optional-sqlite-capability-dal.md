---
id: epic-20
type: epic
title: optional sqlite capability source artifact snapshot dal
status: backlog
priority: 4
tags: [future, sqlite, capability-cache, source-cache, artifact-cache, snapshot-cache, dal]
owners: []
links: []
artifacts: []
relates: [epic-19, epic-21, epic-22, epic-23, epic-24, epic-27]
blocked_by: [epic-19, epic-22, epic-24]
blocks: []
refs: []
aliases: [sqlite-capability-cache]
skills: []
created: 2026-05-14
updated: 2026-05-14
---

# Goal

Add an optional SQLite backend for mdkg derived access data after the JSON
capability cache, archive sidecar, and snapshot bundle contracts are stable.

SQLite remains a rebuildable cache, never the Markdown or sidecar source of
truth.

# Scope

- Use the same capability projection contract as the JSON cache.
- Index source sidecars, artifact sidecars, full graph snapshot manifests, and
  imported read-only bundle metadata.
- Keep JSON as the compatibility baseline.
- Keep Markdown and sidecar metadata as the source of truth.

# Milestones

- SQLite uses the same capability projection contract as the JSON cache.
- SQLite can index archive/source/artifact/snapshot records without requiring
  callers to scan full child repos.
- The backend is optional and does not add a required database service.
- `mdkg doctor` can diagnose missing, stale, or corrupt SQLite capability caches.
- `mdkg index` can rebuild SQLite from Markdown, sidecars, and bundle manifests.
- JSON remains the compatibility baseline.

# Out of Scope

- No full task graph database.
- No migration away from Markdown.
- No hard dependency on SQLite for small repos.
- No canonical storage of work orders, receipts, ledgers, or marketplace state.

# Risks

- A DAL backend must not introduce inconsistent query semantics between JSON and SQLite.
- Optional dependencies must not break minimum-install mdkg users.
- SQLite cache migration must remain rebuildable and disposable.
- SQLite must not make imported bundle snapshots look mutable when they are
  read-only orchestration views.

# Links / Artifacts

- `epic-19`
- `epic-22`
- `epic-23`
- `epic-24`
- Future implementation should add concrete DAL design docs and smoke tests.
