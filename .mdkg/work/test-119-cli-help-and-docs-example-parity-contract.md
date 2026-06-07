---
id: test-119
type: test
title: CLI help and docs example parity contract
status: done
priority: 1
epic: epic-64
parent: goal-10
tags: [cli, docs, help, parity]
owners: []
links: []
artifacts: [tests://cli-check, tests://commands-help, scripts://smoke-cli-ux-polish]
relates: [task-306]
blocked_by: [task-306]
blocks: []
refs: []
aliases: []
skills: []
cases: [help-snapshot, docs-example-parity, command-matrix-parity]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that CLI help, command matrix entries, and README/init examples describe
the same polished 0.3.0 SPEC/work invocation UX.

# Target / Scope

- `task-306`
- `src/cli.ts`
- `README.md`
- `assets/init/README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`

# Preconditions / Environment

- Local repo after `task-306`.

# Test Cases

- `npm run cli:check` passes.
- `mdkg work --help` lists `work order status` and `work receipt verify`.
- `mdkg work trigger --help` includes accepted target rules and one executable
  example.
- `mdkg work order status --help` and `mdkg work receipt verify --help` state
  read-only JSON behavior.
- `mdkg spec validate --help` distinguishes no-arg and named-SPEC behavior.
- README and init README examples use matching order ids.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- None yet.
