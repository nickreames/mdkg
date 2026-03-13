---
id: epic-16
type: epic
title: agent bootstrap default skills events and release
status: done
priority: 1
tags: [0_0_6, agent, skills, events, release]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/event.ts, src/commands/event_support.ts, src/commands/skill_mirror.ts, AGENT_START.md, CLI_COMMAND_MATRIX.md]
relates: [dec-19, epic-14, epic-15, epic-11, epic-13]
blocked_by: []
blocks: [task-104, task-105, task-106, task-107, task-108, task-109, test-58, test-59, test-60, test-61, test-62]
refs: []
aliases: [default-skills-events-release]
skills: []
created: 2026-03-11
updated: 2026-03-11
---

# Goal

Make `init --agent` immediately useful, make event logs durable by default, and finish `0.0.6` as a release-quality polish wave.

# Scope

- seed default mdkg usage skills through init assets
- make event logs committed by default
- reframe task commands as structured helpers alongside manual markdown editing
- align startup docs, command matrix, registry, and internal skills
- finish with a release-readiness checkpoint and cut-prep task

# Milestones

- M1: seeded bootstrap skills and non-empty mirrors
- M2: committed-by-default event behavior
- M3: hybrid task/manual-edit framing aligned across docs and skills
- M4: full tests and `0.0.6` release audit complete

# Out of Scope

- task command ergonomics redesign
- XML / TOON / Markdown structured output expansion
- phase 2 coverage hardening

# Risks

- seeded skills can drift from the main mdkg repo skills if init assets are not treated as their own source of truth
- switching events from ignored to committed changes repo hygiene expectations and must stay explicit in docs and validation guidance

# Links / Artifacts

- `dec-19`
- `task-104` to `task-109`
- `test-58` to `test-62`
