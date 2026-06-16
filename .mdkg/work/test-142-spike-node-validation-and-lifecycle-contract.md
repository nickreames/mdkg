---
id: test-142
type: test
title: spike node validation and lifecycle contract
status: done
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, validation, lifecycle]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: []
refs: []
aliases: []
skills: []
cases: [new spike validates, task lifecycle accepts spike, invalid spike frontmatter fails]
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Validate that `spike` is a legal mdkg work-node type and can move through the
same lifecycle as existing task-like work items.

# Target / Scope

- `task-348`
- Parser/type policy
- `mdkg new spike`
- `mdkg task start/update/done`
- structured lifecycle JSON receipts

# Preconditions / Environment

- Fresh temp repo initialized with `mdkg init --agent`.
- Built or packed mdkg CLI that includes spike support.

# Test Cases

- `mdkg new spike "research mdkg.dev docs" --json` returns `spike-1` and writes
  under `.mdkg/work/`.
- `mdkg validate --json` accepts the new spike.
- `mdkg task start spike-1 --json`, `mdkg task update spike-1 ... --json`, and
  `mdkg task done spike-1 --json` work and preserve valid graph state.
- Lifecycle help text describes spikes as task-like actionable nodes.
- Malformed spike frontmatter fails validation with actionable diagnostics.

# Results / Evidence

- Passed. Evidence from `task-348`, `chk-128`, and `chk-130`.
- `tests/graph/node.test.ts` covers spike parsing and malformed status
  rejection.
- `tests/commands/new.test.ts` covers `mdkg new spike` receipt/template
  behavior.
- `tests/commands/task_event.test.ts` covers `mdkg task start/update/done` on a
  spike.
- `tests/commands/cli_help_matrix.test.ts` covers help text and command matrix
  parity for spike lifecycle behavior.
- `npm run test` passed with 461 tests.
- `npm run smoke:spike` passed from a packed installed tarball.
- `node dist/cli.js validate --json` passed with zero warnings/errors.

# Notes / Follow-ups

- Keep lifecycle coverage aligned with task-like work nodes.
- Pack/discovery behavior belongs in `test-143`; packed smoke belongs in
  `test-144`.
