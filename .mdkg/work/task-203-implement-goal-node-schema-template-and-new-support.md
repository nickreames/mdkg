---
id: task-203
type: task
title: implement goal node schema template and new support
status: done
priority: 1
epic: epic-36
next: task-204
tags: [goal, schema, template, new-command]
owners: []
links: []
artifacts: []
relates: [epic-36, prd-3, edd-10]
blocked_by: []
blocks: [task-204, task-206]
refs: [rule-3, rule-6]
aliases: [goal-schema-template]
skills: []
created: 2026-05-31
updated: 2026-05-31
---

# Overview

Add the minimal first-class `goal` node contract to mdkg's graph parser,
templates, seed assets, bundled fallback, `mdkg new`, indexing, and SQLite
projection.

# Acceptance Criteria

- `goal` is an allowed node type.
- `goal` behaves as work-like for status, priority, graph links, and skills
  where appropriate, but remains distinct from `epic` and `task`.
- `mdkg new goal "..."` creates a validation-clean goal node under
  `.mdkg/work/`.
- Goal frontmatter supports the intended fields from `edd-10`: `goal_state`,
  `goal_condition`, `active_node`, `required_skills`, `required_checks`,
  `max_iterations`, and `blocked_after_attempts`.
- The local template and bundled/init template coverage allow old workspaces to
  use fallback and `mdkg upgrade --apply` to vendor the template.
- JSON and SQLite indexes expose goal metadata deterministically enough for
  list/search/show/pack.

# Files Affected

- `src/graph/node.ts`
- `src/commands/new.ts`
- `.mdkg/templates/default/goal.md`
- init/bundled template assets
- index/cache code and tests as needed

# Implementation Notes

- Preserve existing `status` semantics; use `goal_state` only for goal-specific
  lifecycle.
- Do not let `mdkg next` select goals by default.
- Keep required checks report-only; no mdkg command execution is introduced in
  this task.

# Test Plan

- Unit tests for valid and invalid goal frontmatter.
- CLI test for `mdkg new goal "..."`.
- Search/show/pack/index tests proving goal nodes are discoverable and
  deterministic.
- Validate a fresh temp workspace with a generated goal node.

# Verification Evidence

- Implemented `goal` in `src/graph/node.ts`, `src/commands/new.ts`,
  `src/pack/order.ts`, and `.mdkg/templates/default/goal.md`.
- `npm run test` passed 373 tests, including goal parser and `mdkg new goal`
  coverage.
- `node dist/cli.js validate` passed after indexing the local graph.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  included `dist/init/templates/default/goal.md`.

# Links / Artifacts

- `prd-3`
- `edd-10`
- `task-204`
- `task-206`
