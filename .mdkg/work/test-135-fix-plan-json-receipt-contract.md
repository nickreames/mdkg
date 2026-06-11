---
id: test-135
type: test
title: fix plan json receipt contract
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, json, receipts, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-335]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate the machine-readable `mdkg fix plan --json` receipt contract.

# Target / Scope

- `task-335`
- `edd-19`

# Preconditions / Environment

- Built CLI from the current source tree.
- A temp mdkg repo with at least one generated-cache planning scenario.

# Test Cases

- `mdkg fix plan --json` emits parseable JSON and no human logs on stdout.
- Receipt has stable `action`, `schema_version`, `plan_id`, `plan_hash`,
  `families`, `risk_counts`, `proposed_changes`, `blocked_changes`, and
  `summary`.
- Repeated runs against the same repo produce the same plan hash except for
  allowed timestamp fields.
- Invalid family values fail with a structured CLI error.

# Results / Evidence

- Passed with `node --test dist/tests/commands/fix.test.js
  dist/tests/commands/cli.test.js`.
- Passed as part of `npm run test` with 438 tests.
- Live `node dist/cli.js fix plan --json` emitted `action: "fix.plan"`,
  `ok: true`, a `sha256:` plan hash, deterministic selected families, and
  `apply_supported: false`.

# Notes / Follow-ups

- Human-readable non-JSON output can follow after the JSON contract is stable.
