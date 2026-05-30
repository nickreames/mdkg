---
id: task-177
type: task
title: freshness permission and visibility validation
status: todo
priority: 1
epic: epic-21
tags: [subgraph, validate, doctor, freshness, visibility]
owners: []
links: []
artifacts: []
relates: [epic-21, epic-27, task-174, task-175]
blocked_by: [task-174, task-175]
blocks: [task-178, task-179]
refs: []
aliases: [subgraph-health-validation]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Harden diagnostics for stale, missing, corrupt, permission-invalid, or
visibility-unsafe subgraphs.

# Acceptance Criteria

- `mdkg validate` fails for malformed subgraph config, missing enabled bundle
  sources, corrupt bundles, permission-invalid config, and visibility-unsafe
  public/internal references.
- Stale subgraphs are warnings for planning reads and validation, but failures
  for `mdkg subgraph verify`.
- `mdkg doctor` reports subgraph health, freshness, disabled entries, and repair
  commands.
- Public/internal exports continue to fail closed when local nodes reference
  less-visible subgraph records.

# Files Affected

- validate and doctor commands
- visibility policy helpers
- subgraph health tests

# Implementation Notes

Keep visibility and permissions distinct. Visibility controls export safety;
permissions control allowed root behavior over the child graph view.

# Test Plan

- Tests for stale, missing, corrupt, disabled, permission-invalid, and
  visibility-unsafe subgraphs.
- Public pack/bundle tests prove less-visible subgraph references fail closed.
- Doctor JSON tests prove health details are machine-readable.

# Links / Artifacts

- `epic-21`
- `epic-27`
