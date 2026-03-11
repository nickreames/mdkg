---
id: task-89
type: task
title: wire automatic event append for enabled mutation commands
status: done
priority: 1
epic: epic-12
tags: [0_0_4, events, automation, provenance]
owners: []
links: []
artifacts: [src/commands/new.ts, src/commands/skill.ts, src/commands/checkpoint.ts, src/commands/task.ts, src/commands/event_support.ts]
relates: [dec-15, epic-12]
blocked_by: []
blocks: [test-48]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Append baseline event records automatically for supported mutation commands once a workspace has event logging enabled.

# Acceptance Criteria

- supported mutation commands append baseline events only when event logging is enabled
- commands still succeed without event logging enabled

# Files Affected

- `src/commands/new.ts`
- `src/commands/skill.ts`
- `src/commands/checkpoint.ts`
- `src/commands/task.ts`

# Implementation Notes

- automatic events use `agent: mdkg-cli`

# Test Plan

- `test-48`
- `tests/commands/task_event.test.ts`

# Links / Artifacts

- `dec-15`
