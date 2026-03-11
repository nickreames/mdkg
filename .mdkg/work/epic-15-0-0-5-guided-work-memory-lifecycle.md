---
id: epic-15
type: epic
title: 0.0.5 guided work memory lifecycle
status: done
priority: 1
tags: [0_0_5, memory, lifecycle, ux]
owners: []
links: []
artifacts: [.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md, .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md, AGENT_START.md, CLI_COMMAND_MATRIX.md, src/commands/task.ts, tests/commands/task_event.test.ts]
relates: [dec-15, dec-16, dec-17, epic-14]
blocked_by: []
blocks: [task-100, task-101, task-102, task-103, test-56, test-57]
refs: []
aliases: [guided-memory-lifecycle, closeout-memory]
skills: []
created: 2026-03-10
updated: 2026-03-11
---

# Goal

Make durable mdkg memory updates feel guided at the end of work, not just technically possible through individual mutation commands.

# Scope

- parent closeout and rollup policy for epics and feats
- run-boundary guidance when events are enabled or disabled
- checkpoint assistance for milestone compression
- better “what changed / what’s next” memory at closeout

# Milestones

- M1: define parent closeout flow
- M2: define checkpoint timing and assistance policy
- M3: define guided next-step memory and rollup behavior

# Out of Scope

- generic `mdkg node ...` mutation
- additional structured discovery formats
- residual coverage hardening

# Risks

- lifecycle commands can become noisy if they over-automate checkpoints
- parent rollup can drift from human expectations if not explicit and deterministic

# Links / Artifacts

- `dec-15`
- `task-100`
- `task-101`
- `task-102`
- `task-103`
