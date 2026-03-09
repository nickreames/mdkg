---
id: implement-12
type: task
title: implement stream l coverage hardening and threshold gates
status: todo
priority: 1
epic: epic-8
tags: [v0_4x, implementation, coverage, reliability]
owners: []
links: []
artifacts: [package.json, COVERAGE_HARDENING_MATRIX.md, tests/commands/cli_dispatch.test.ts, tests/commands/new_errors.test.ts, tests/commands/show_errors.test.ts, tests/commands/skills.test.ts, tests/commands/workspace_errors.test.ts, tests/util/qid_resolve.test.ts]
relates: [dec-11, edd-9, task-67, test-32, epic-8]
blocked_by: [implement-11]
blocks: [test-32]
refs: []
aliases: [stream-l, coverage-hardening]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Raise automated confidence after the simplified CLI and internal skills stabilize, with explicit coverage thresholds and targeted test additions.

# Acceptance Criteria

- Coverage commands/scripts exist in the repo.
- Coverage thresholds match the agreed targets.
- Lowest-covered user-facing modules are improved first.

# Files Affected

- package.json
- tests/

# Implementation Notes

- Hardening follows the manual behavior audit and simplification work.

# Test Plan

- Satisfy `test-32` plus build/test/validate/coverage gates.

# Links / Artifacts

- epic-8
