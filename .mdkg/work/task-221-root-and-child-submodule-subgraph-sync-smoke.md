---
id: task-221
type: task
title: root and child submodule subgraph sync smoke
status: done
priority: 1
epic: epic-38
prev: task-220
next: task-222
tags: [subgraph, smoke, submodule, bundle]
owners: []
links: []
artifacts: []
relates: [task-216, task-218]
blocked_by: []
blocks: []
refs: [rule-3]
aliases: [subgraph-sync-smoke]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Add packed-package smoke coverage with a root repo and two child Git submodules
under `projects/`.

# Acceptance Criteria

- Root and two child repos initialize cleanly.
- Child graph refs across aliases are created.
- `sync --dry-run` writes nothing.
- `sync` updates bundle hash and `source_repo` after a committed child change.
- Dirty child tracked changes are refused by default.
- Materialize extracts views and writes manifests.
- Validate/index/search/show/pack/capability resolve all pass after sync.

# Files Affected

- `scripts/smoke-subgraph.js`
- `package.json`
- tests

# Implementation Notes

Use local submodules or nested Git repos under `projects/` without network
access. Do not mutate external consumer repos.

# Test Plan

- `npm run smoke:subgraph`
- focused temp-repo CLI assertions.

# Links / Artifacts

- `task-216`
- `task-218`
- Extended packed-package smoke to create a root repo and child Git repo, register a root-owned bundle as a subgraph, dry-run sync, materialize, create root semantic mirrors pointing at child qids, sync after a child commit, verify stale handling, and reject root-side child mutation.
- Evidence: `npm run smoke:subgraph` passed for `mdkg@0.1.7`.
