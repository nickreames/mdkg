---
id: chk-122
type: checkpoint
title: Generated command contract schema and drift contract passed
status: backlog
priority: 9
tags: [cli-spec, command-contract, test, 0-3-8]
owners: []
links: []
artifacts: [tests/commands/command_contract.test.ts, scripts/generate-command-contract.js, dist/command-contract.json]
relates: [test-141]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [test-141]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

The generated CLI command contract schema and drift contract passed. The test
node now proves public help target parity, required command metadata fields,
mutating/read-only safety classifications, check-mode drift detection, and
stable contract hashing.

# Scope Covered

- `test-141`
- `task-345` verification

# Decisions Captured

- `edd-22`
- Drift detection is script-based and compares the generated artifact against
  the current compiled CLI/help target registry.

# Implementation Summary

- Added `tests/commands/command_contract.test.ts`.
- The tests require every `scripts/cli_help_targets.js` entry to have exactly
  one command contract record.
- Representative mutating commands must include write paths, non-read-only
  danger, lock policy, and atomic write policy.
- `fix plan` and `status` remain read-only in contract metadata.

# Verification / Testing

- `node --test dist/tests/commands/command_contract.test.js` passed 4/4 tests.
- `npm run cli:contract` passed.
- `npm run cli:check` passed.
- `node scripts/assert-publish-ready.js` passed.
- `npm run test` passed 454/454 tests.

# Known Issues / Follow-ups

- `task-346` should add a packed/local docs-readiness smoke that consumes the
  contract as its source of truth.

# Links / Artifacts

- `tests/commands/command_contract.test.ts`
- `scripts/generate-command-contract.js`
- `dist/command-contract.json`
