---
id: task-274
type: task
title: define generic agent role SPEC requirements
status: todo
priority: 1
epic: epic-50
parent: goal-8
tags: [agents, orchestrator, worker, reviewer, summarizer]
owners: []
links: []
artifacts: [.mdkg/templates/specs/agent.SPEC.md]
relates: [goal-8, epic-50, test-104]
blocked_by: [task-267, task-269]
blocks: [task-275]
refs: [edd-14]
aliases: [orchestrator-agent-spec-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define required SPEC fields for orchestrator, worker, reviewer, summarizer, and
graph/project agents.

# Acceptance Criteria

- Orchestrator agents coordinate graph state, work packs, queue events, and
  final receipts.
- Worker agents have scoped write authority.
- Reviewer and summarizer agents are read-only unless explicitly scoped.
- Graph/project agents own writes to their graph.

# Test Plan

- `mdkg capability search "orchestrator agent" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Role definitions must remain generic and runtime-neutral.

# Links / Artifacts

- `goal-8`
- `epic-50`
