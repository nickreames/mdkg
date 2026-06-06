---
id: chk-54
type: checkpoint
title: SPEC implementation sequence
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-276-define-spec-parser-index-validation-implementation-sequence.md]
relates: [task-276]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-276]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-276` defined the future implementation sequence for SPEC parser, index,
validation, diagnostics, focused command surface, template promotion, upgrade
behavior, and projection checks. The sequence remains planning-only and
explicitly defers source implementation and exporter writes.

# Scope Covered

- Current source anchors in graph parsing, agent workflow validation, graph
  validation, index caches, capability caches, command dispatch, and tests.
- Ordered phases from audit/fixture baseline through parser model,
  diagnostics, capability-index integration, validation integration, optional
  `mdkg spec validate`, template promotion, upgrade path, and projection
  checks.
- Exit gates for each phase.
- Future source goal handoff with ordered implementation slices.
- Package dry-run checks for a future implementation goal.
- Explicit no-exporter/no-source-change boundary for goal-8.

# Decisions Captured

- Implementation starts with parser/index audit and tests before source
  behavior changes.
- A shared internal parser and diagnostics engine come before any public
  `mdkg spec validate` command.
- Capability discovery remains read-only and non-validating.
- `mdkg validate` remains the graph-wide trust gate.
- Template promotion waits for parser, diagnostics, and compatibility tests.
- Projection checks can validate drift and no-secret policy, but exporter
  writes stay deferred.

# Implementation Summary

Only mdkg graph/design state changed. `task-276` now carries the future source
implementation sequence, and `edd-14` gained `spec-implementation-sequence` as
a design-level discovery alias.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability search "spec implementation sequence" --json`
- `node dist/cli.js capability search "SPEC validation diagnostics" --json`
- `node dist/cli.js capability search "runtime agent manifest" --json`
- Product-name grep over `task-276`
- `git diff --check`

# Known Issues / Follow-ups

- `task-277` must define template migration and backcompat policy.
- `task-278` must define downstream/root SPEC adoption after the design
  foundation is accepted.
- Source implementation remains a future goal.

# Links / Artifacts

- `goal-8`
- `task-276`
- `epic-51`
- `edd-14`
