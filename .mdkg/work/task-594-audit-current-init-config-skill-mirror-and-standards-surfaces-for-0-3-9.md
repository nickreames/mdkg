---
id: task-594
type: task
title: audit current init config skill mirror and standards surfaces for 0.3.9
status: todo
priority: 1
epic: epic-199
parent: goal-41
tags: [0.3.9, audit, config, skill-mirrors, init]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/skill_mirror.ts, src/core/config.ts, assets/init/config.json]
relates: []
blocked_by: []
blocks: [task-595, task-596, task-597, task-598, task-599]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Audit the current source surfaces that hard-code init assets, config schema,
skill mirror paths, default skills, and core docs before implementing `0.3.9`
extensibility.

# Acceptance Criteria

- Source-grounded notes identify current behavior in init, config loading,
  upgrade, and skill mirror commands.
- The audit confirms where `.agents/skills` and `.claude/skills` defaults are
  currently encoded.
- The audit maps which first-party skills and docs need updates after behavior
  changes.
- No functional source changes are made by this audit task.

# Files Affected

- mdkg graph evidence only during the audit.
- Later implementation will touch source files listed in `artifacts`.

# Implementation Notes

- Use source and CLI behavior over prior chat memory.
- Treat config overlays as selected policy from `dec-51`.
- Treat arbitrary mirror target paths as selected policy from `dec-52`.
- Treat `COLLABORATION.md` as selected policy from `dec-53`.

# Test Plan

- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js goal next goal-41 --json`
- `git diff --check`

# Links / Artifacts

- `dec-51`
- `dec-52`
- `edd-56`
