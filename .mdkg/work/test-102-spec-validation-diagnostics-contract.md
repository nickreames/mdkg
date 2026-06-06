---
id: test-102
type: test
title: SPEC validation diagnostics contract
status: done
priority: 1
epic: epic-48
parent: goal-8
tags: [spec, diagnostics, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, task-271, task-276]
blocked_by: [task-271, task-276]
blocks: [task-279]
refs: []
aliases: [spec-validation-diagnostics-contract]
skills: []
cases: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that future SPEC diagnostics are explicit enough to implement.

# Test Cases

- Error, warning, repair, and info classes are defined.
- Candidate CLI surface is recorded.
- Source implementation remains deferred.

# Validation Evidence

- `task-271` is done and defines diagnostic classes, stable diagnostic fields,
  rule families, candidate command surfaces, and future JSON shape.
- `task-276` is done and defines the ordered implementation sequence for
  parser, diagnostics, capability index, validation integration, optional
  focused command, template promotion, and projection checks.
- `chk-49` and `chk-54` record diagnostics and implementation-sequence
  closeout evidence.
- `node dist/cli.js capability search "SPEC validation diagnostics" --json`
  resolves `edd-14`.
- `task-276` explicitly defers source implementation and exporter writes.
