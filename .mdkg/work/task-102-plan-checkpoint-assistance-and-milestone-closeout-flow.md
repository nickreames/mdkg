---
id: task-102
type: task
title: plan checkpoint assistance and milestone closeout flow
status: done
priority: 1
epic: epic-15
tags: [0_0_5, checkpoint, memory, ux]
owners: []
links: []
artifacts: [.mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md, AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md]
relates: [epic-15, dec-15]
blocked_by: []
blocks: [test-56, test-57]
refs: [dec-15, task-100, edd-6]
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-11
---

# Overview

Define when the CLI should recommend or assist checkpoint creation during milestone closeout without turning checkpoints into routine task noise.

# Acceptance Criteria

- `mdkg task done --checkpoint "<title>"` is the preferred assisted checkpoint path
- checkpoint timing is explicit and non-spammy
- checkpoints are recommended for milestone and parent closeout summaries, not required for every task
- milestone closeout guidance connects checkpoints to durable episodic memory

# Files Affected

- `.mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md`
- `.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md`

# Implementation Notes

- checkpoint creation should stay explicit unless a later decision changes that
- this wave adds guidance, not a recommendation engine

# Test Plan

- `test-56`
- `test-57`

# Links / Artifacts

- `dec-15`
