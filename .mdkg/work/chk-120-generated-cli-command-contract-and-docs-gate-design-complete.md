---
id: chk-120
type: checkpoint
title: Generated CLI command contract and docs gate design complete
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-328]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-328]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`task-328` completed the generated command contract and docs gate design. The
mdkg-native command contract is now specified as the canonical source for future
command docs, with OpenCLI and mdkg.dev output treated as projections.

# Scope Covered

- `task-328`
- `edd-22`
- Follow-on implementation/test nodes: `task-345`, `task-346`, `test-141`.
- Existing mdkg.dev gate node `test-131` rewired to the generated docs smoke
  instead of the design task.

# Decisions Captured

- The mdkg-native command contract is canonical.
- The contract must capture command path, args, flags, examples, exit codes,
  JSON schema, side effects, read/write paths, dry-run support, visibility,
  receipts, lock/atomic policy, and danger level.
- Optional OpenCLI output remains a projection.
- Public mdkg.dev command docs remain blocked until generated contract output
  and docs-readiness smoke exist.

# Implementation Summary

- Created `edd-22-generated-cli-command-contract-and-docs-gate-architecture.md`.
- Created `task-345` for the command contract generator implementation.
- Created `task-346` for generated docs readiness smoke and publish gate.
- Created `test-141` for schema/drift coverage.
- Updated `epic-73`, `goal-13`, `test-131`, and `task-330` blockers so
  routing now goes through implementation before mdkg.dev planning.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-345` is the next implementation node.
- `task-346` and `test-131` remain blocked until generated contract output
  exists.

# Links / Artifacts

- `.mdkg/pack/pack_standard_task-328_20260609-220033027.md`
- `edd-22`
- `task-345`
- `task-346`
- `test-141`
