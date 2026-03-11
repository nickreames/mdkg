---
id: implement-12
type: task
title: implement stream l coverage hardening and threshold gates
status: done
priority: 1
epic: epic-8
tags: [0_0_4x, implementation, coverage, reliability]
owners: []
links: []
artifacts: [package.json, COVERAGE_HARDENING_MATRIX.md, tests/commands/cli_dispatch.test.ts, tests/commands/new_errors.test.ts, tests/commands/show_errors.test.ts, tests/commands/skills.test.ts, tests/commands/workspace_errors.test.ts, tests/util/qid_resolve.test.ts]
relates: [dec-11, edd-9, task-67, test-32, epic-8, epic-13]
blocked_by: [implement-11]
blocks: [test-32]
refs: []
aliases: [stream-l, coverage-hardening]
created: 2026-03-05
updated: 2026-03-08
---

# Overview

Record the completed first coverage hardening phase. Residual improvements now move to `epic-13` as non-blocking follow-up work.

# Acceptance Criteria

- first coverage hardening phase completed and recorded
- residual coverage work explicitly moved to a follow-up epic

# Files Affected

- `package.json`
- `COVERAGE_HARDENING_MATRIX.md`
- `tests/`

# Implementation Notes

- hardening followed the manual behavior audit and simplification work
- remaining improvements are not blocking `0.0.4`

# Test Plan

- `npm run test`
- `mdkg validate`

# Links / Artifacts

- `epic-8`
- `epic-13`
