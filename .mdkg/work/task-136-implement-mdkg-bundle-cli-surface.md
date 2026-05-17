---
id: task-136
type: task
title: implement mdkg bundle cli surface
status: done
priority: 1
epic: epic-22
tags: [bundle, cli, ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Add the public `mdkg bundle` namespace for explicit full graph snapshot bundle
creation, verification, inspection, and listing.

# Acceptance Criteria

- `mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]`
- `mdkg bundle verify [bundle-path] [--json]`
- `mdkg bundle show <bundle-path> [--json]`
- `mdkg bundle list [--json]`
- Help output and command matrix cover all bundle subcommands.
- JSON receipts expose deterministic summary fields for automation.

# Files Affected

- `src/commands/bundle.ts`
- `src/cli.ts`
- `src/util/argparse.ts`
- `scripts/cli_help_snapshot.js`
- `scripts/smoke-command-matrix.js`
- `tests/commands/cli_help_matrix.test.ts`

# Implementation Notes

- `--output` is accepted as a CLI alias for the existing `--out` parser value.
- `--profile` continues through the parser's normalized profile flag and is
  resolved specifically by bundle command dispatch.
- `verify` emits JSON receipts before raising a validation error on failed
  bundles so automation can inspect diagnostics and still receive a nonzero
  process status.

# Test Plan

- `npm run cli:check`
- `npm run smoke:matrix`
- `npm run smoke:bundle`

# Links / Artifacts

- `CLI_COMMAND_MATRIX.md`
- `tests/commands/bundle.test.ts`
