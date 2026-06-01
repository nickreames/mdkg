---
id: task-209
type: task
title: add scope refs schema template new command index support
status: done
priority: 1
epic: epic-37
prev: task-208
next: task-210
tags: [goal, schema, template, index]
owners: []
links: []
artifacts: [.mdkg/templates/default/goal.md, src/graph/node.ts, src/commands/new.ts]
relates: [epic-37, task-208, task-211]
blocked_by: [task-208]
blocks: [task-211, task-213]
refs: [rule-3, rule-6]
aliases: [goal-scope-refs]
skills: []
created: 2026-06-01
updated: 2026-06-01
---

# Overview

Add `scope_refs` as the deterministic goal scope field across parser,
template, scaffolding, and index metadata.

# Acceptance Criteria

- Goal template includes `scope_refs: []`.
- `mdkg new goal` creates validation-clean goals with empty `scope_refs`.
- Parser accepts local graph ids/qids for `scope_refs`.
- Parser rejects invalid `scope_refs` shapes.
- Goal JSON receipts and index attributes expose `scope_refs`.

# Files Affected

- `.mdkg/templates/default/goal.md`
- `src/graph/node.ts`
- `src/graph/frontmatter.ts`
- `tests/commands/new.test.ts`
- `tests/graph/node.test.ts`

# Implementation Notes

- `scope_refs` accepts local ids/qids for `epic`, `feat`, `task`, `bug`, and
  `test`; validation checks target existence and active-node scope.

# Test Plan

- Unit tests for valid and invalid `scope_refs`.
- CLI test for `mdkg new goal`.
- `node dist/cli.js validate`

# Verification Evidence

- `scope_refs` was added to goal template, parser/index attributes, JSON
  receipts, and graph validation.
- `npm run test` passed with goal parser, creation, and validation coverage.

# Links / Artifacts

- `task-208`
- `task-211`
