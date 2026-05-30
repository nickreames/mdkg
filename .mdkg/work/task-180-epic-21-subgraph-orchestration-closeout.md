---
id: task-180
type: task
title: epic 21 subgraph orchestration closeout
status: todo
priority: 1
epic: epic-21
tags: [subgraph, closeout, release, verification]
owners: []
links: []
artifacts: []
relates: [epic-21, task-172, task-173, task-174, task-175, task-176, task-177, task-178, task-179]
blocked_by: [task-172, task-173, task-174, task-175, task-176, task-177, task-178, task-179]
blocks: []
refs: []
aliases: [subgraph-orchestration-closeout]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Close `epic-21` only after subgraph orchestration is implemented, documented,
tested, and verified in fresh temp mdkg graphs.

# Acceptance Criteria

- `mdkg subgraph ...` is the public orchestration command family.
- Public docs and init assets no longer expose `mdkg bundle import ...` as the
  recommended path.
- `mdkg capability resolve` discovers local and subgraph capabilities
  deterministically.
- Root graphs can register child bundles, verify freshness, resolve child
  `WORK.md` capabilities, pack relevant context, and keep child graph views
  read-only.
- Full release gates pass before the epic is closed.

# Files Affected

- Epic closeout node and checkpoint evidence.

# Implementation Notes

Do not close the epic from source inspection alone. Close only after the smoke
proves root, child, and grandchild graph behavior with a packed package.

# Test Plan

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- existing smoke scripts
- `npm run smoke:subgraph`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Links / Artifacts

- `epic-21`
- `task-179`
