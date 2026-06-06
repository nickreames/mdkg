---
id: chk-49
type: checkpoint
title: SPEC validation diagnostics command surface
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-271-define-spec-validation-diagnostics-and-command-surface.md]
relates: [task-271]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-271]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-271` defined the future SPEC validation diagnostics and command-surface
contract for goal-8. The contract preserves `mdkg validate` as the repo trust
gate and recommends a future focused `mdkg spec validate` authoring loop.

# Scope Covered

- Diagnostic classes for errors, warnings, repair suggestions, and info notes.
- Stable diagnostic fields and rule-family sources.
- Comparison of `mdkg validate`, `mdkg spec validate`, `mdkg validate
  --specs`, and `mdkg capability ...` options.
- Preferred future command surface and JSON receipt shape.
- Deferral boundary for parser, command dispatch, fixtures, capability index,
  and projection drift checks.

# Decisions Captured

- `mdkg validate` remains the repo-wide trust gate.
- A future `mdkg spec validate` command is the preferred focused SPEC authoring
  loop.
- `mdkg capability ...` remains read-only discovery and must not become the
  validator.
- Repo-wide `mdkg validate --json` should preserve its existing top-level shape
  until compatibility impact is explicitly designed and tested.

# Implementation Summary

Only mdkg graph/design state changed. `task-271` now carries the diagnostics
contract and future command-surface comparison.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js capability search "SPEC validation diagnostics" --json`
- Product-name grep over `task-271`
- `git diff --check`

# Known Issues / Follow-ups

- `task-272` must define SPEC capability index and discovery expectations.
- `task-276` must define parser/index/validation implementation sequencing.
- `test-102` remains the diagnostics contract validation node.

# Links / Artifacts

- `goal-8`
- `task-271`
- `epic-48`
