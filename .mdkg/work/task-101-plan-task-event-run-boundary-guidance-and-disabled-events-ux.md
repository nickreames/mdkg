---
id: task-101
type: task
title: plan task event run boundary guidance and disabled events ux
status: done
priority: 1
epic: epic-15
tags: [0_0_5, events, ux, memory]
owners: []
links: []
artifacts: [src/commands/task.ts, tests/commands/task_event.test.ts, AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md]
relates: [epic-15, dec-15]
blocked_by: []
blocks: [test-56]
refs: [dec-15, task-100, edd-3, edd-6]
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-11
---

# Overview

Define what the CLI should tell users when task mutation happens with events enabled or disabled, with the lightest guidance that still makes provenance discoverable.

# Acceptance Criteria

- disabled-event guidance is explicit and actionable
- the reminder fires on `mdkg task start` and `mdkg task done` only
- `mdkg task update` remains quiet
- run-boundary guidance is consistent with single-writer batching

# Files Affected

- `.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md`
- `.mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md`

# Implementation Notes

- this should build on the existing `task` and `event` surfaces
- no command should auto-enable events or create the event file on first mutation

# Test Plan

- `test-56`

# Links / Artifacts

- `dec-15`
