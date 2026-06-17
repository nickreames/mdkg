---
id: task-375
type: task
title: add archived goal status and goal-state support
status: done
priority: 1
epic: epic-86
parent: goal-16
tags: [0.3.3, archived, goals]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-373]
blocks: [task-376, test-161]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Add archived goal semantics so historical roadmap goals can be preserved without remaining actionable.

# Acceptance Criteria

- Archived is accepted for goal lifecycle state/status as designed.
- Archived goals are readable and ref-valid.
- Archived goals are excluded from default actionable routing.
- Explicit list/search filters can include archived goals.

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md
- assets/init/**

# Implementation Notes

- Do not apply archived to legacy files until this support is tested.
- Record compatibility behavior for older graphs.

# Test Plan

- Unit tests for parser and routing.
- CLI tests for list/show/search filters.

# Links / Artifacts

- 2026-06-16 implementation:
  - Added goal-only `status: archived` parser support and `goal_state: archived`.
  - Added public `mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]`.
  - Kept archived goals show/list/search readable while excluding them from default current/next routing.
  - Rejected archived goals from select, activate, claim, pause/resume/done mutations.
  - Updated help, command matrix, init assets, generated command contract metadata, and agent quickstart guidance.
- Verification:
  - `npm run build` passed; command contract hash `b5752d6b367616471f18af7240260005ccc58c45c0f70e4a27fa5f0e4a7e7b6f`.
  - `npm run build:test` passed.
  - `node --test dist/tests/graph/node.test.js` passed 15 tests.
  - `node --test dist/tests/commands/goal.test.js` passed 13 tests.
  - `node --test dist/tests/commands/json_discovery.test.js` passed 7 tests.
  - `node --test dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/command_contract.test.js` passed 9 tests.
  - `node dist/cli.js validate --json` passed with 0 warnings/errors.
  - `git diff --check` passed.
