---
id: task-100
type: task
title: plan epic and feat closeout memory flow
status: done
priority: 1
epic: epic-15
tags: [0_0_5, memory, epic, feat]
owners: []
links: []
artifacts: [.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md, .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md, AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md]
relates: [epic-15, dec-15]
blocked_by: []
blocks: [test-56, test-57]
refs: [dec-15, edd-3, edd-6]
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-11
---

# Overview

Define how parent work items should close cleanly once task-level execution is complete, without inventing a new parent-closeout command in `0.0.5`.

# Acceptance Criteria

- feat closeout scope is explicit as direct children with `parent: <feat-id>`
- epic closeout scope is explicit as descendant work with `epic: <epic-id>`
- parent closeout is guidance plus checkpoint-first memory, not a new command surface
- parent closeout ties back to durable task/checkpoint memory

# Files Affected

- `.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md`
- `.mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md`

# Implementation Notes

- keep the next wave focused on workflow, not generic setters
- keep parent status mutation manual in `0.0.5`

# Test Plan

- `test-56`
- `test-57`

# Links / Artifacts

- `dec-15`
