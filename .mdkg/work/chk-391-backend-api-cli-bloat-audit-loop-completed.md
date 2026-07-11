---
id: chk-391
type: checkpoint
title: Backend API CLI bloat audit loop completed
checkpoint_kind: audit
status: done
priority: 1
tags: [loop, audit, cli, backend, bloat]
owners: []
links: []
artifacts: []
relates: [loop-4]
blocked_by: []
blocks: []
refs: [loop-4, spike-29, task-690, test-365, prop-4, task-691, task-692, test-366]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [loop-4]
created: 2026-07-06
updated: 2026-07-06
---
# Summary

Completed the read-only backend/API/CLI bloat audit loop for mdkg root.

The audit found maintainability pressure in CLI dispatch, command-contract flag
metadata, and broad command-family internals, but did not prove a current
compatibility-blocking behavior failure.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- mdkg graph evidence only.
- `loop-4`, `spike-29`, `task-690`, and `test-365` were closed.
- `prop-4`, `task-691`, `task-692`, and `test-366` were created as residual
  simplification output.

## Boundaries

- in scope: local CLI/backend source, command contract, live help, tests, docs
  references, and mdkg graph state.
- out of scope: functional code changes, generated docs changes, public CLI
  behavior changes, external compatibility checks, provider calls, push,
  publish, deploy, and downstream repo checks.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- No formal DEC was required.
- Audit recommendation is recorded in `prop-4`.

# Implementation Summary

No source implementation changed. The audit recommends a future incremental
typed-command-descriptor refactor that preserves the public CLI while reducing
dispatch/help/contract drift.

# Audit Findings

- Reviewed surfaces: `src/cli.ts`, `src/util/argparse.ts`, `src/commands/*`,
  `scripts/cli_help_targets.js`, `scripts/generate-command-contract.js`,
  `CLI_COMMAND_MATRIX.md`, command-contract output, and focused command tests.
- Findings: 115 public help targets, 34 command categories, a 3,684-line
  dispatcher/help source, broad flag parsing, large handler modules, and
  help-text-derived command-contract flag descriptions.
- Residual risk: maintainability and metadata-quality risk, not a proven
  current behavior failure.

# Verification / Testing

## Command Evidence

- `node scripts/generate-command-contract.js --check`: passed with contract hash
  `547c7f55bc28db0e92a38f97ed013414c7d2c45ddb08f1adee00d78692059c1e`.
- `node dist/cli.js help new`: passed and displayed current broad `new` surface.
- `node dist/cli.js help pack`: passed and displayed current pack options.
- `node dist/cli.js help work`: passed and displayed grouped work command surface.
- `node dist/cli.js help db queue`: passed and displayed queue lifecycle surface.
- `node dist/cli.js help loop`: passed and displayed first-class loop surface.

## Pass / Fail Status

- status: pass for read-only audit completion.

## Known Warnings

- No behavior-blocking warning was found.
- External/downstream compatibility checks were not approved and were not needed
  for the local read-only audit lanes.

# Known Issues / Follow-ups

- `task-691`: refactor CLI dispatch toward typed command descriptors.
- `task-692`: improve command contract flag extraction and descriptions.
- `test-366`: preserve help and command contract parity during refactor.

## Follow-up Refs

- `prop-4`
- `task-691`
- `task-692`
- `test-366`

# Links / Artifacts

- `loop-4`
- `spike-29`
- `task-690`
- `test-365`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
