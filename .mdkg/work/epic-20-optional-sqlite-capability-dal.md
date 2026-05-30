---
id: epic-20
type: epic
title: sqlite dal and parallel mutation hardening
status: progress
priority: 1
tags: [0_1_3, sqlite, dal, parallel-safety, index, cache]
owners: []
links: []
artifacts: []
relates: [epic-19, epic-21, epic-22, epic-23, epic-24, epic-27]
blocked_by: []
blocks: [task-165, task-166, task-167, task-168, task-169, task-170, task-171]
refs: []
aliases: [sqlite-capability-cache, sqlite-dal, parallel-mutation-hardening]
skills: []
created: 2026-05-14
updated: 2026-05-20
---

# Goal

Add a first-class SQLite backend for mdkg derived access data after the JSON
capability cache, archive sidecar, and snapshot bundle contracts are stable.

SQLite remains a rebuildable cache, never the Markdown or sidecar source of
truth.

# Scope

- Require Node `>=24.15.0` and use built-in `node:sqlite`.
- Use the same capability projection contract as the JSON cache.
- Index nodes, edges, skills, capabilities, archive/source/artifact sidecars,
  full graph snapshot manifests, imported read-only bundle metadata, and source
  hashes.
- Harden parallel mdkg calls with a shared mutation lock, atomic writes, and
  SQLite transaction-backed id allocation when enabled.
- Keep JSON as the compatibility baseline.
- Keep Markdown and sidecar metadata as the source of truth.

# Milestones

- SQLite uses the same graph and capability projection contracts as the JSON caches.
- SQLite can index archive/source/artifact/snapshot records without requiring
  callers to scan full child repos.
- The backend does not add a required database service or third-party package.
- `mdkg doctor` can diagnose missing, stale, or corrupt SQLite capability caches.
- `mdkg index` can rebuild SQLite from Markdown, sidecars, and bundle manifests.
- JSON remains the compatibility baseline.

# Out of Scope

- No migration away from Markdown.
- No third-party SQLite dependency.
- No canonical storage of work orders, receipts, ledgers, or marketplace state.

# Risks

- A DAL backend must not introduce inconsistent query semantics between JSON and SQLite.
- Dropping Node 18/20 support must be clear in release docs because mdkg is pre-v1.
- SQLite cache migration must remain rebuildable and disposable.
- SQLite must not make imported bundle snapshots look mutable when they are
  read-only orchestration views.

# Active Child Tasks

- `task-165`: Node runtime, package, and pre-v1 release posture. Done.
- `task-166`: mutation lock and atomic write hardening. Done.
- `task-167`: SQLite schema and index rebuild backend. Done.
- `task-168`: transactional id allocation and parallel creation safety. Done.
- `task-169`: doctor, validate, docs, and upgrade policy. Done.
- `task-170`: SQLite and parallel packed-package smoke coverage. Done.
- `task-171`: post-publish repo handoff prompts for SQLite opt-in. Todo until
  `mdkg@0.1.3` is published.

# Current Status

The 0.1.3 implementation slice is code-complete and locally verified. The
epic remains open only for the post-publish consumer handoff prompts that
should be created after the npm package is available.

# Links / Artifacts

- `epic-19`
- `epic-22`
- `epic-23`
- `epic-24`
- `task-165`
- `task-166`
- `task-167`
- `task-168`
- `task-169`
- `task-170`
- `task-171`
