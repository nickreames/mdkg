---
id: test-57
type: test
title: epic feat closeout and checkpoint policy contract
status: done
priority: 1
epic: epic-15
tags: [0_0_5, memory, checkpoint, epic]
owners: []
links: []
artifacts: [.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md, .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, CLI_COMMAND_MATRIX.md]
relates: [task-100, task-102, task-103, epic-15]
blocked_by: []
blocks: []
refs: [task-100, task-102, task-103]
aliases: []
skills: []
cases: [epic-closeout, feat-closeout, checkpoint-timing]
created: 2026-03-10
updated: 2026-03-11
---

# Overview

Validate epic/feat closeout policy and checkpoint timing once the lifecycle design is implemented.

# Acceptance Criteria

- feat closeout scope is explicit as direct child work
- epic closeout scope is explicit as descendant work
- checkpoints are recommended but not required for parent closeout
- no new parent mutation command is claimed in `0.0.5`
- milestone compression guidance is consistent across docs, help, and internal skills

# Links / Artifacts

- `task-100`
- `task-102`
- `task-103`
