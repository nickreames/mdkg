---
id: epic-23
type: epic
title: read only bundle import and lazy subgraph loading
status: done
priority: 2
tags: [future, bundle-import, subgraph, orchestration, lazy-loading]
owners: []
links: []
artifacts: []
relates: [epic-21, epic-22, epic-27]
blocked_by: []
blocks: [epic-20, epic-21]
refs: [edd-3, edd-8]
aliases: [read-only-bundle-import, lazy-subgraph-loading]
skills: []
created: 2026-05-17
updated: 2026-05-17
---

# Goal

Let root graphs import compressed child `.mdkg` snapshots as read-only
subgraphs for planning, search, show, and pack flows.

# Scope

The root orchestration graph can import child bundle views from private git
without scanning every child submodule by default.

The intended high-level topology is:
- root repo, such as `~/omni-chat-rooms`
- `agents/` submodules for agent repositories
- `project/` submodules for product or project repositories
- one-way child capability and graph visibility into the root orchestrator

# Milestones

- Define dedicated read-only bundle import config and command receipts.
- Project imported bundle indexes into alias-prefixed read-only graph views.
- Register imported bundles as read-only graph sources with source repo,
  source commit, freshness, and visibility metadata.
- Support search, show, and pack from imported bundle content.
- Keep child repositories as owners of real mutations and commits.
- Make bundle import failures degrade clearly without corrupting root graph
  state.
- Preserve public/private filtering when packing or exporting imported content.

# Completion Evidence

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:consumer`
- `npm run smoke:matrix`
- `npm run smoke:upgrade`
- `npm run smoke:init`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `npm run smoke:bundle-import`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Out of Scope

- No write-through mutation into imported child bundle snapshots.
- No automatic full submodule scan when a bundle is available.
- No child dependency on higher-level root metadata.

# Risks

- Root orchestration can plan from stale child snapshots unless freshness is
  obvious.
- Read-only imports may be mistaken for mutable workspaces unless command output
  labels them clearly.
- Private-local bundle imports must not leak into public packs or external
  output by default.

# Links / Artifacts

- `epic-22`
- `epic-21`
- `epic-27`
- `~/omni-chat-rooms`
- `task-139`
- `task-140`
- `task-141`
- `task-142`
- `task-143`
- `test-83`
