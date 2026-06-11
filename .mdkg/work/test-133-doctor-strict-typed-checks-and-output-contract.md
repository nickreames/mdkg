---
id: test-133
type: test
title: doctor strict typed checks and output contract
status: done
priority: 1
epic: epic-74
parent: goal-13
tags: [doctor, strict, json, stderr, test, 0-3-2]
owners: []
links: []
artifacts: []
relates: [task-332]
blocked_by: [task-332]
blocks: []
refs: [edd-17]
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate `mdkg doctor --strict --json` typed checks and output discipline.

# Target / Scope

- `task-332`
- `edd-17`

# Preconditions / Environment

- Temp repos with clean, invalid, stale, and selected-goal states.

# Test Cases

- Every check row has stable `id`, `status`, `severity`, `message`, and
  `remediation`.
- JSON stdout parses as one object.
- Human diagnostics stay off JSON stdout.
- Strict mode fails invalid graph and stale achieved selected goal.

# Results / Evidence

- Passed focused strict-doctor tests:
  `node --test dist/tests/commands/doctor.test.js dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/cli_error_matrix.test.js dist/tests/commands/cli_dispatch.test.js`.
- Passed full suite: `npm run test` with 434 passing tests.
- Passed command matrix: `npm run cli:check`.
- Passed local strict health check: `node dist/cli.js doctor --strict --json`.
- Covered strict failure fixtures for stale generated graph cache, achieved
  selected goal, enabled project DB verification failure, and invalid graph
  state.
- Covered JSON stdout discipline with a CLI-level
  `mdkg doctor --strict --json` fixture.

# Notes / Follow-ups

- Packed/temp-repo operator-health smoke remains under `task-333` and
  `test-134`.
