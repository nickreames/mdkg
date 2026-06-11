---
id: chk-121
type: checkpoint
title: Generated command contract implemented
status: backlog
priority: 9
tags: [cli-spec, command-contract, docs, 0-3-8]
owners: []
links: []
artifacts: [scripts/generate-command-contract.js, scripts/cli_help_targets.js, dist/command-contract.json]
relates: [task-345]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-345]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Implemented the mdkg-native generated CLI command contract foundation for
`epic-73`. The build now emits `dist/command-contract.json` from the compiled
CLI help surface, and `cli:contract` verifies the generated artifact is current.

# Scope Covered

- `task-345`
- `test-141` implementation support

# Decisions Captured

- `edd-22`
- The mdkg-native contract remains the source of truth. OpenCLI stays a future
  projection, not the canonical metadata source.
- The contract is deterministic: no generated timestamp is written, command
  records are sorted, and `contract_hash` is computed over canonical metadata.

# Implementation Summary

- Added shared public help target registry in `scripts/cli_help_targets.js`.
- Updated `scripts/cli_help_snapshot.js` and `scripts/smoke-command-matrix.js`
  to consume the shared help target list.
- Added `scripts/generate-command-contract.js` with `--write` and `--check`
  modes.
- Added `dist/command-contract.json` to package files and build output.
- Added `npm run cli:contract` and included it in `prepublishOnly`.
- Extended `scripts/assert-publish-ready.js` to require the generated contract,
  package file inclusion, representative command coverage, and mutating command
  safety metadata.
- Added focused command-contract tests in
  `tests/commands/command_contract.test.ts`.

# Verification / Testing

- `npm run build` passed and wrote
  `dist/command-contract.json e2218e4a4fc5ad35efa356786b9d54e572555fe81bbcb03a7ea2da667ca737be`.
- `node scripts/generate-command-contract.js --check` passed.
- `node --test dist/tests/commands/command_contract.test.js` passed
  4/4 tests.
- `npm run cli:contract` passed.
- `npm run cli:check` passed.
- `node scripts/assert-publish-ready.js` passed.
- `npm run test` passed 454/454 tests.

# Known Issues / Follow-ups

- `task-346` still needs the generated docs readiness smoke and publish gate.
- The contract covers help targets, while detailed sub-subcommand expansion such
  as every `mdkg db queue ...` variant remains represented inside parent command
  usage until the docs projection task expands it.

# Links / Artifacts

- `scripts/generate-command-contract.js`
- `scripts/cli_help_targets.js`
- `tests/commands/command_contract.test.ts`
- `dist/command-contract.json`
