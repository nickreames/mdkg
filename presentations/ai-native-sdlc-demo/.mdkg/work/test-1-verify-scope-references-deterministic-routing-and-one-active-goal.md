---
id: test-1
type: test
title: Verify scope references deterministic routing and one active goal
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: task-4
next: test-2
tags: [ai-native-sdlc, presentation-demo, phase-1, step-6]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-4]
context_refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-4]
evidence_refs: []
aliases: [phase-1-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [scope_ref_resolution, chain_symmetry, one_active_goal, paused_successors, no_goal_blockers]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify scope references deterministic routing and one active goal as step 6 of Goal 1. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-1
- epic-1
- task-4

# Preconditions / Environment

- Goal 1 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Every scope ref resolves to the owned epic and recursively to only actionable phase nodes.
- The first route is correct, prev/next links are symmetric, and only Goal 1 is active.
- No loop exists and the diff stays inside approved mdkg/operator paths.
- Nested validation, concise pack, private bundle, root projection, and Remotion handoff pass.
- This test specifically proves: Verify scope references deterministic routing and one active goal.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Passed on 2026-07-26.

- node ../../dist/cli.js validate --json: ok true, zero warnings, zero errors.
- goal next goal-1 through goal-8: each returned spike-1, spike-2, spike-3, spike-4, task-21, task-27, task-34, and spike-5 respectively with no warnings.
- Graph invariant probe: 109 indexed nodes, eight goals, seventy-five actionable nodes, zero authored loops, and zero asymmetric prev/next links.
- Goal 1 is the only active goal; Goals 2–8 are paused.

# Notes / Follow-ups

- Do not advance to test-2 until the required result is evidenced.
