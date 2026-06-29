---
id: task-619
type: task
title: add Creative Production website demo intake and freedom contract
status: todo
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, creative-production, intake, website, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-618]
blocks: [task-620, test-323]
refs: [dec-56, edd-58]
context_refs: [dec-56, edd-58]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Add the Creative Production intake and freedom contract for website demo runs.
The goal is differentiated candidate websites, not a fixed mdkg.dev clone.

# Acceptance Criteria

- The handoff names Creative Production as an optional ideation input.
- Creative Production may vary website structure, visual direction, animation,
  section order, and interactive ideas.
- Ocean Flow, Astro plus React Islands, accessibility, public-claims, and
  no-secret boundaries remain fixed constraints.
- The coding agent can proceed without hidden chat context after the creative
  direction is selected.

# Files Affected

- `examples/website-demo-template/**`
- future handoff/checkpoint evidence

# Implementation Notes

- Use Creative Production for options and visual direction; do not require it to
  produce final code.
- Generated assets or prompts must be stored only when they are public-safe and
  intentionally retained.

# Test Plan

- Review handoff text against `edd-58`.
- `test-323`

# Links / Artifacts

- `creative-production:explore`
- `edd-58`
