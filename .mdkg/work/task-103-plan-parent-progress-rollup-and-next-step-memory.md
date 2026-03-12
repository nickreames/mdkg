---
id: task-103
type: task
title: plan parent progress rollup and next step memory
status: done
priority: 1
epic: epic-15
tags: [0_0_5, memory, progress, ux]
owners: []
links: []
artifacts: [.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md, .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md, AGENT_START.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md]
relates: [epic-15, dec-15]
blocked_by: []
blocks: [test-56, test-57]
refs: [dec-15, task-100, task-102, edd-3, edd-6]
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-11
---

# Overview

Define how parent work should remember what changed and what is next after task-level closeout while keeping narrative memory auditable and cheap to resume from.

# Acceptance Criteria

- parent progress rollup rules are deterministic
- checkpoint bodies are the default narrative rollup location
- parent nodes are not auto-rewritten with narrative summaries in `0.0.5`
- next-step memory is explicit enough for later agents to resume work cheaply

# Files Affected

- `.mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md`
- `.mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md`

# Implementation Notes

- keep rollup guidance lightweight and auditable in git
- preserve parent nodes for structured state and links, not automatic narrative prose

# Test Plan

- `test-56`
- `test-57`

# Links / Artifacts

- `dec-15`
