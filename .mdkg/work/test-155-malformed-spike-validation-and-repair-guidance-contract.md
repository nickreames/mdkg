---
id: test-155
type: test
title: malformed spike validation and repair guidance contract
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, validation, fix-plan, ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-367]
blocks: []
refs: []
aliases: []
skills: []
cases: [malformed spike fails validate clearly, fix plan reports actionable guidance, json diagnostics remain parseable]
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Validate malformed spike diagnostics and non-mutating repair guidance.

# Target / Scope

- `task-367`
- graph validation
- fix-plan output
- JSON stdout/stderr discipline

# Preconditions / Environment

- Temp repo fixtures with malformed spike frontmatter, invalid ids/statuses, and
  broken refs.

# Test Cases

- `mdkg validate --json` rejects malformed spikes with actionable error text.
- `mdkg fix plan --json` remains non-mutating and reports applicable repair
  hints for missing caches, duplicate ids, and broken refs involving spikes.
- JSON output remains parseable and diagnostics do not contaminate JSON stdout.
- No automatic repair apply behavior is introduced for spike bodies.

# Results / Evidence

- Passed focused validation/fix/help suites:
  `node --test dist/tests/commands/validate.test.js
  dist/tests/commands/fix.test.js
  dist/tests/commands/cli_help_matrix.test.js
  dist/tests/graph/node.test.js`.
- Passed full `npm run test` with 467 tests.
- Passed `npm run smoke:fix-plan`.
- Passed `npm run smoke:spike`; packed installed CLI malformed repo:
  `/private/tmp/mdkg-spike.WRqi2V/malformed-repo`.
- Passed `npm run cli:check`.
- Passed `npm run cli:contract`.
- Passed `node dist/cli.js validate --json`.
- Passed `git diff --check`.

# Notes / Follow-ups

- Keep this focused on diagnostics and planning, not repair mutation.
