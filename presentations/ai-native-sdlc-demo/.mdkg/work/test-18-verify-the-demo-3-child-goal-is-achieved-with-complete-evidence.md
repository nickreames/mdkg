---
id: test-18
type: test
title: Verify the Demo 3 reveal gate by the global deadline
status: done
priority: 1
epic: epic-7
parent: goal-7
prev: task-35
next: task-36
tags: [ai-native-sdlc, presentation-demo, phase-7, step-3]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/reveal-gate-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-35]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-35]
evidence_refs: []
aliases: [phase-7-step-3, demo-3-reveal-gate]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [success_branch, fallback_branch, receipt_schema, timing_deadline, truthful_child_state, selection]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Validate the consolidated Demo 3 reveal receipt without running new heavy
commands. This is the audience-equivalent gate at step 3 of Goal 7.

# Target / Scope

- goal-7
- epic-7
- task-35

# Preconditions / Environment

- Goal 7 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- For Demo 3 selection, require child `goal-1` achieved with an accepted
  checkpoint, normal push range proven against policy, both deployments READY
  for the exact final SHA, both routes passing, child checkpoint by T+28:30,
  task-35 receipt by T+29:15, and this selection by T+29:30.
- Validate receipt schema, all referenced hashes, timing/retry limits,
  essential public-safety assertions, and source-to-execution story.
- Perform no build, screenshot suite, provider polling loop, bundle refresh, or
  source/Git/provider mutation.
- Any missing success condition selects Demo 2. By T+30, all live actions stop.
- A truthful fallback passes rehearsal-honesty evaluation but does not mark the
  Demo 3 child successful.
- This test, not task-35 alone, must finish and persist the Demo 3/Demo 2
  selection by T+29:30.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Write `artifacts/demo-003/reveal-gate-verification.json` with selection,
deadline comparison, schema/hash results, blocker if any, and pass/fail.

# Notes / Follow-ups

- Do not advance to post-reveal task-36 until the gate result is evidenced.
