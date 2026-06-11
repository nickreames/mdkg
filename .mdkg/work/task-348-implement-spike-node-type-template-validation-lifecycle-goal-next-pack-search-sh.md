---
id: task-348
type: task
title: implement spike node type template validation lifecycle goal next pack search show support
status: todo
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, implementation, cli, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-347]
blocks: [task-349, task-350, task-351, test-142, test-143]
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Implement first-class `spike` node support across mdkg's type system, template
system, task lifecycle, next selection, goal traversal, discovery, and pack
behavior.

# Acceptance Criteria

- `mdkg new spike "..." --json` creates `spike-#` nodes in `.mdkg/work/`.
- `spike` is included in type policy, id allocation, parser/indexer behavior,
  validation, priority/status policy, skill metadata, lifecycle mutations,
  `mdkg next`, and `mdkg goal next`.
- `spike` appears in list/search/show, all structured show exports, pack roots,
  goal-scope pack closure, and deterministic pack ordering.
- `mdkg task start/update/done` explicitly treats spikes as task-like actionable
  work while help text no longer says the task command only supports feat, task,
  bug, and test.
- Default and bundled spike templates are available in source, init assets, and
  test helpers.
- Unit tests cover creation, malformed frontmatter, lifecycle, next/goal routing,
  pack inclusion, discovery, and command contract behavior.

# Files Affected

- Type/parser, id allocation, indexer, graph traversal, and filter code.
- `new`, `task`, `next`, `goal`, `list`, `search`, `show`, and `pack` behavior.
- New/default templates, init assets, command contract, help snapshots, and
  tests.

# Implementation Notes

- Follow existing `task`/`test`/`feat` work-node patterns rather than inventing
  a new surface.
- Keep `spike` actionable; do not classify it as a passive doc node.
- Do not expose a new top-level `mdkg spike` command family in this slice.
- Keep Markdown body citations/sources as template sections; do not introduce a
  structured citation schema in this release.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json`

# Links / Artifacts

- `task-347`
- `test-142`
- `test-143`
