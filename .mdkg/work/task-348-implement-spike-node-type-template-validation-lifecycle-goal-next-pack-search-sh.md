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
- `spike` is included in work-node parsing, validation, priority/status policy,
  skills metadata, lifecycle mutations, `mdkg next`, and `mdkg goal next`.
- `spike` appears in search/show/list/pack behavior and preserves deterministic
  ordering.
- Default and bundled spike templates are available in source, init assets, and
  test helpers.
- Unit tests cover creation, malformed frontmatter, lifecycle, next/goal routing,
  pack inclusion, and discovery.

# Files Affected

- Type/parser and graph traversal code.
- New/default templates and init assets.
- Command help, docs snapshots, and tests.

# Implementation Notes

- Follow existing `task`/`test`/`feat` work-node patterns rather than inventing
  a new surface.
- Keep `spike` actionable; do not classify it as a passive doc node.
- Do not expose a new top-level `mdkg spike` command family in this slice.

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
