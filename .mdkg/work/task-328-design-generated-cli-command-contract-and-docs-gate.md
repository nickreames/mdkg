---
id: task-328
type: task
title: design generated CLI command contract and docs gate
status: done
priority: 1
epic: epic-73
parent: goal-13
tags: [cli-spec, command-contract, docs, 0-3-8, 0-3-9]
owners: []
links: []
artifacts: []
relates: [edd-22, task-345, task-346, test-141]
blocked_by: []
blocks: [task-345]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Design the generated command contract that must exist before public `mdkg.dev`
command reference pages are built.

This task is the architecture and roadmap step only. Implementation is split
into follow-on `task-345`, `test-141`, and `task-346`.

# Acceptance Criteria

- mdkg-native command contract fields are specified for command path, args,
  flags, examples, exit codes, JSON schema, side effects, read/write paths,
  dry-run support, visibility, receipts, and danger level.
- Optional OpenCLI export is treated as a projection, not the source of truth.
- Docs-readiness smoke requirements are defined.
- Public mdkg.dev command docs remain blocked until generated output exists.

# Files Affected

- `.mdkg/design/edd-22-generated-cli-command-contract-and-docs-gate-architecture.md`
- `.mdkg/work/task-345-implement-mdkg-native-cli-command-contract-generator.md`
- `.mdkg/work/task-346-add-generated-command-docs-readiness-smoke-and-publish-gate.md`
- `.mdkg/work/test-141-generated-cli-command-contract-schema-and-drift-contract.md`
- `goal-13` and `epic-73` graph scope/blocker alignment.

# Implementation Notes

- The mdkg-native command contract is canonical.
- Optional OpenCLI output is a projection.
- `CLI_COMMAND_MATRIX.md` and mdkg.dev command reference must eventually derive
  from generated contract output.
- Public docs remain blocked until the generated contract and docs-readiness
  smoke exist.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Links / Artifacts

- `edd-22`
- `task-345`
- `task-346`
- `test-141`
