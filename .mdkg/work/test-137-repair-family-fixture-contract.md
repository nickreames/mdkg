---
id: test-137
type: test
title: repair family fixture contract
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, fixtures, repair, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-336, task-337, task-338]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate the three initial repair families with deterministic fixtures.

# Target / Scope

- `task-336`
- `task-337`
- `task-338`
- `edd-19`

# Preconditions / Environment

- Fixture repos or in-test temp repos for index/cache, refs, and duplicate-id
  states.

# Test Cases

- Index/cache fixture returns low-risk command-hint findings.
- Missing-reference fixture returns stable source path, field, and reason code.
- Duplicate-id fixture returns deterministic candidate ids and affected
  reference paths.
- All family findings are sorted deterministically.
- Every proposed change reports `apply_supported: false`.

# Results / Evidence

- Passed with `node --test dist/tests/commands/fix.test.js`.
- Passed as part of `npm run test` with 444 tests.
- `node dist/cli.js fix plan --family index --json`, `--family refs`, and
  `--family ids` all succeeded in the live repo.

# Notes / Follow-ups

- Add higher-risk branch-conflict repair fixtures under the later multi-writer
  epic instead of expanding this test beyond `0.3.3`.
