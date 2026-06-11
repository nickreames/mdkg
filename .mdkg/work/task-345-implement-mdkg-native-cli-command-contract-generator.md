---
id: task-345
type: task
title: implement mdkg native cli command contract generator
status: done
priority: 1
epic: epic-73
parent: goal-13
tags: [cli-spec, command-contract, docs, 0-3-8]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-141, task-346]
refs: [edd-22]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Implement the mdkg-native generated CLI command contract described in `edd-22`.
This is the canonical command metadata layer for future docs generation.

# Acceptance Criteria

- Contract schema version `1` is defined and validated.
- Generator covers every public help target currently captured by CLI help
  snapshot coverage.
- Each command record includes path, usage, args, flags, output formats, JSON
  schema or schema reference, side effects, read/write paths, dry-run support,
  visibility, receipt actions, lock/atomic policy, and danger level.
- Generated contract has deterministic ordering and a stable contract hash.
- Check mode fails on drift and write mode refreshes generated artifacts.
- OpenCLI remains optional projection, not source of truth.

# Files Affected

- command metadata/registry source files
- `scripts/generate-command-contract.js`
- generated contract artifact path, likely `dist/command-contract.json`
- package files list if a source/generated artifact must ship

# Implementation Notes

- Reuse help targets from `scripts/cli_help_snapshot.js` or move both tools to
  a shared command registry.
- Keep generated timestamps out of stable contract hashes.
- Treat mutating commands without side-effect/lock/danger metadata as check
  failures.

# Test Plan

- `test-141`
- focused command contract unit tests
- `npm run cli:check`
- `node scripts/generate-command-contract.js --check`

# Links / Artifacts

- `edd-22`
- `test-141`
