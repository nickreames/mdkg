---
id: task-356
type: task
title: write outcome guides and examples from spike evidence
status: todo
priority: 2
epic: epic-79
parent: goal-15
tags: [mdkg-dev, guides, examples, spike-evidence]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-354, task-370]
blocks: []
refs: [spike-1, spike-2, spike-5, task-370, task-371]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Write outcome-oriented guides and examples from spike evidence and temp-repo
proof. These guides should teach real mdkg workflows, not just restate command
syntax.

# Acceptance Criteria

- Guides cover fresh init, index/doctor/status, goal/task work, pack/context,
  SPEC/WORK invocation, queue usage, subgraph planning, and release readiness.
- Every example command is either generated from command metadata or validated
  in a temp repo.
- Examples avoid local secrets, machine-specific paths, unpublished promises,
  and claims about autonomous execution that mdkg does not provide.
- Guide gaps are recorded as follow-up mdkg tasks, spikes, or skill updates.

# Files Affected

- future mdkg.dev guide content
- `README.md` and init docs when examples need source-of-truth updates
- smoke scripts for public examples

# Implementation Notes

- Use spike findings to decide which workflows deserve guides.
- Prefer short, executable examples over broad conceptual pages.
- Keep operator language aligned with local-first/no-secret boundaries.

# Test Plan

- Run public example smoke coverage.
- Run `npm run smoke:command-docs`.
- Run `node dist/cli.js validate --json`.

# Links / Artifacts

- Validated by `test-148`.
- Spike evidence: `spike-1`, `spike-2`, `spike-5`.
- Evidence matrix and architecture visuals: `task-370`, `task-371`.
