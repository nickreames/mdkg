---
id: test-56
type: test
title: guided work memory lifecycle contract
status: done
priority: 1
epic: epic-15
tags: [0_0_5, memory, lifecycle]
owners: []
links: []
artifacts: [tests/commands/task_event.test.ts, .mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md, .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md, AGENT_START.md, CLI_COMMAND_MATRIX.md]
relates: [task-100, task-101, task-102, task-103, epic-15]
blocked_by: []
blocks: []
refs: [task-100, task-101, task-102, task-103]
aliases: []
skills: []
cases: [guided-closeout, next-step-memory, event-boundary-guidance]
created: 2026-03-10
updated: 2026-03-11
---

# Overview

Validate the next wave of guided work-memory lifecycle behavior once the design is locked.

# Acceptance Criteria

- guided closeout policy is documented consistently across active design docs, startup guidance, and internal skills
- disabled-event guidance is explicit on `task start` and `task done`, but not `task update`
- next-step memory is checkpoint-first
- raw events are treated as provenance/debugging, not primary durable recall

# Links / Artifacts

- `task-100`
- `task-101`
- `task-102`
- `task-103`
