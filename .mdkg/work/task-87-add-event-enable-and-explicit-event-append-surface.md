---
id: task-87
type: task
title: add event enable and explicit event append surface
status: done
priority: 1
epic: epic-12
tags: [0_0_4, events, cli]
owners: []
links: []
artifacts: [src/commands/event.ts, src/commands/event_support.ts, src/cli.ts]
relates: [dec-15, epic-12]
blocked_by: []
blocks: [test-46]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add explicit event lifecycle commands so builders and orchestrators can enable and append episodic JSONL records intentionally.

# Acceptance Criteria

- `mdkg event enable` creates the event file and updates `.gitignore` by default
- `mdkg event append` writes valid JSONL records

# Files Affected

- `src/commands/event.ts`
- `src/commands/event_support.ts`
- `src/cli.ts`

# Implementation Notes

- event logging stays opt-in by workspace

# Test Plan

- `test-46`
- `tests/commands/task_event.test.ts`

# Links / Artifacts

- `dec-15`
