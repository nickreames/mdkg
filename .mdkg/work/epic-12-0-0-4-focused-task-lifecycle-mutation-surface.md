---
id: epic-12
type: epic
title: 0.0.4 focused task lifecycle mutation surface
status: done
priority: 1
tags: [0_0_4, cli, ux, task-lifecycle, events]
owners: []
links: []
artifacts: [src/commands/task.ts, src/commands/event.ts, src/commands/event_support.ts, scripts/cli_help_snapshot.js, README.md, CLI_COMMAND_MATRIX.md]
relates: [dec-13, dec-14, dec-15, epic-10, epic-13]
blocked_by: []
blocks: [task-83, task-84, task-85, task-86, task-87, task-88, task-89, task-90, task-91, test-43, test-44, test-45, test-46, test-47, test-48, test-49]
refs: []
aliases: [task-lifecycle-surface, mdkg-task, mdkg-event]
created: 2026-03-08
updated: 2026-03-08
---

# Goal

Add focused task lifecycle mutation commands and opt-in baseline event logging so durable mdkg updates become easier than manual markdown editing.

# Scope

- focused `mdkg task start`, `update`, and `done` commands for task-like nodes
- explicit `mdkg event enable` and `append` commands
- automatic event append for enabled mutation workflows
- docs/help/internal-skill alignment for the new flow
- CLI help snapshot and matrix audit support

# Milestones

- M1: task lifecycle mutation contract implemented
- M2: explicit and automatic event logging implemented
- M3: docs/help parity and snapshot auditing completed

# Out of Scope

- generic node mutation commands
- automatic checkpoint creation without an explicit flag
- non-JSON structured output expansion

# Risks

- task mutation semantics can drift from validation and pack behavior if not kept under test
- event logging can become noisy if enabled without a clear workflow contract

# Links / Artifacts

- `dec-15`
- `task-87`
- `task-88`
- `task-89`
- `task-90`
- `task-91`
