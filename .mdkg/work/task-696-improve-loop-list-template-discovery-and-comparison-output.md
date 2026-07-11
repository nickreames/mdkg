---
id: task-696
type: task
title: Improve loop list template discovery and comparison output
status: done
priority: 1
epic: epic-221
parent: goal-59
tags: [loop, list, templates, discovery]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-694, task-695]
context_refs: []
evidence_refs: [chk-397]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Improve `mdkg loop list` so users and agents can compare existing loops and
seeded templates before choosing raw creation or forked instantiation.

# Acceptance Criteria

- `mdkg loop list` continues listing indexed loop nodes and seed templates.
- Output includes enough comparable metadata to choose a template: template ref,
  title, mode, role, tags, default materialization, and brief purpose where
  available.
- `--json` remains deterministic and backward-compatible with additive fields.
- Text output stays concise and script-friendly.

# Files Affected

- `src/commands/loop.ts`
- `tests/commands/loop.test.ts`
- generated docs/command matrix if help text changes

# Implementation Notes

- Avoid fuzzy recommendation logic in this task.
- The list should support the `mdkg new loop` guidance path by making fork
  targets obvious.

# Test Plan

- focused `loop list` tests
- `test-369`
- `npm run cli:check`

# Links / Artifacts

- `task-695`
- `dec-66`
