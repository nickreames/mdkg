---
id: epic-29
type: epic
title: project application database roadmap
status: todo
priority: 1
tags: [project-db, sqlite, roadmap, application-state, receipts]
owners: []
links: []
artifacts: []
relates: [epic-20, epic-21, epic-24, epic-25, epic-26]
blocked_by: []
blocks: [epic-30, epic-31, epic-32, epic-33, epic-34, task-181, task-182, task-183, task-184, task-185, task-186, task-187, task-188, task-189, task-190, task-191, task-192, task-193]
refs: []
aliases: [project-db-roadmap, app-db-roadmap]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Plan first-class mdkg project application databases as a future generic mdkg
core capability. The mdkg graph remains the intentional semantic structure and
human-readable project memory. Project SQLite becomes materialized application
state under `.mdkg/db/`, separate from the rebuildable mdkg index cache under
`.mdkg/index/`.

# Goal

Define the future mdkg project application database architecture and split it
into implementable phase epics.

# Scope

- Generic mdkg core project DB planning.
- `.mdkg/db` application-state layout.
- `mdkg db` command family direction.
- Events, receipts, reducers, sealed snapshots, and privacy policy.
- Later queue-backed workers, project profiles, and Rust sidecar planning.

# Locked Direction

- Agents are ephemeral.
- State transitions are durable.
- SQLite is materialized project state.
- mdkg is semantic/project structure.
- Receipts make the loop auditable.
- Snapshots make it portable.
- Queues make it asynchronous.

# Aligned Decisions

- Public CLI direction is `mdkg db ...`.
- Existing `mdkg index` remains as a compatibility shortcut for index rebuilds.
- Default generic layout is `.mdkg/db/`.
- Receipts live both in SQLite rows and reviewable mdkg/JSON artifacts.
- Sealed snapshots are opt-in to commit; active WAL/runtime DBs are ignored.
- First event store target is local mdkg SQLite.
- First implementation uses Node `node:sqlite`; Rust sidecar is later.
- Embeddings and vector databases are out of scope for this roadmap slice.

# Acceptance Criteria

- Phase epics define project DB foundation, snapshots/Git policy, events and
  receipts, queue-backed materialization, and profiles/privacy/Rust follow-up.
- Child tasks define the public command shape, filesystem layout, schema,
  snapshot, event, receipt, reducer, lease, privacy, and smoke-test contracts.
- Future implementation can proceed without re-deciding the durable boundaries
  between mdkg graph, project SQLite, runtime WAL, sealed snapshots, events,
  queues, receipts, and ephemeral agents.

# Milestones

- Foundation, snapshot, event/receipt, worker, and profile phase epics exist.
- Child tasks define the first implementation requirements and smoke coverage.
- A later implementation agent can begin with `task-181`.

# Out of Scope

- No active WAL commits.
- No arbitrary agent SQL writes.
- No embeddings or vector database work.
- No hosted queue requirement in the first implementation phase.
- No source implementation in the planning pass.

# Risks

- Confusing the project application DB with the rebuildable mdkg index cache.
- Letting active runtime/WAL state become a committed artifact.
- Letting agents write arbitrary SQL instead of typed reducer-backed changes.

# Links / Artifacts

- `epic-20`
- `epic-21`
- `epic-24`
- `epic-25`
- `epic-26`
