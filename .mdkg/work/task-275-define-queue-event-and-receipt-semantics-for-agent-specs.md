---
id: task-275
type: task
title: define queue event and receipt semantics for agent SPECs
status: todo
priority: 1
epic: epic-50
parent: goal-8
tags: [agents, queue, events, receipts, runtime-agent]
owners: []
links: []
artifacts: [.mdkg/templates/specs/runtime-agent.SPEC.md]
relates: [goal-8, epic-50, test-104]
blocked_by: [task-274]
blocks: [task-276]
refs: [edd-14]
aliases: [runtime-agent-manifest-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define generic queue/event and receipt semantics for agent and runtime-agent
SPECs.

# Acceptance Criteria

- Async lifecycle is `TriggerEvent -> AgentRun -> AttemptReceipt ->
  ValidationReceipt -> FinalReceipt`.
- Live queue rows remain runtime/project DB state.
- Committed mdkg stores aggregate evidence, checkpoints, and improvement
  proposals.
- Final receipts are required before durable closeout.

# Test Plan

- `mdkg capability search "runtime agent manifest" --json`
- `mdkg capability search "FinalReceipt" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Define semantics only; do not implement queue or runtime behavior.

# Links / Artifacts

- `goal-8`
- `epic-50`
