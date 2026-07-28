---
id: task-52
type: task
title: Fork and specialize Demo 4 without executing implementation
status: backlog
priority: 1
epic: epic-9
parent: goal-9
prev: test-26
next: task-53
tags: [ai-native-sdlc, presentation-demo, phase-9, step-4]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/fork-receipt.json, artifacts/demo-004/source-goal-1.md, artifacts/demo-004/specialized-goal-1.md, artifacts/demo-004/child-interface-manifest.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-9, epic-9, prd-1, edd-1, dec-3, dec-5, test-26]
context_refs: [goal-9, epic-9, prd-1, edd-1, dec-3, dec-5, test-26]
evidence_refs: [test-26]
aliases: [phase-9-step-4]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Fork the accepted source into `runs/demo-004/`, specialize the fresh live goal,
and stop before its first positioning node executes.

# Acceptance Criteria

- Use the deterministic bootstrap and exact source/operator/sendoff hashes from
  test-26; preserve child local ID `goal-1`.
- Materialize the positioning-to-production chain, designated harness, warm
  dependencies, timing ledger fields, portable output role, exact receipt
  paths, and owner handoffs.
- Leave the first child node `todo`, all successors `backlog`, no checkpoint,
  and all implementation/publication evidence empty.
- Validate the child root, routing, public-safe pack, source-versus-specialized
  snapshots, and interface manifest.

# Files Affected

- `presentations/ai-native-sdlc-demo/runs/demo-004/**`
- `presentations/ai-native-sdlc-demo/artifacts/demo-004/**`

# Implementation Notes

- Existing-target or source/hash drift is a hard blocker.
- Do not run the child goal.

# Test Plan

Require zero-warning child validation, exact first-node routing, complete pack,
and empty implementation evidence.

# Links / Artifacts

- test-26
- goal-9
