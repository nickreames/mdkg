---
id: task-735
type: task
title: Add Loops overview and goals-versus-loops documentation
status: todo
priority: 1
epic: epic-238
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-732]
blocks: [task-736]
refs: [test-404, edd-71, dec-68, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, epic-238, dec-65, dec-67, dec-74, prop-8, task-710, task-711, task-732]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Create the conceptual entry point for first-class loops and make the ownership
boundary between mdkg process state and agent-harness execution unambiguous.

# Acceptance Criteria

- Add `/loops/` as the first page in a conditional top-level Loops group after
  Concepts and before Guides.
- Define a goal as outcome-oriented and a loop as a durable reusable process
  that can span goals, evidence lanes, decisions, and attempts.
- Explain template, scoped/forked, and run-bearing behavior as modes/links of one
  `loop` node type; do not invent `loop_template` or `loop_run` types.
- Explain that mdkg preserves and validates process state while Codex, Claude
  Code, or another harness executes agents and tools.
- Explain read-only, planning, patch-proposal, write-with-approval, and
  autonomous-local metadata modes without presenting mdkg as a hosted runtime.
- Link to templates/forks, lifecycle, security walkthrough, and generated CLI
  reference without duplicating exact command reference content.
- Keep all content dormant or preview-noindex through the shared release gate.

# Files Affected

- `docs/src/content/docs/loops/index.*`
- Conditional Starlight sidebar configuration
- Focused docs content/link tests

# Implementation Notes

- Reuse native Starlight patterns and content widths.
- Retain the exact `Pre-v1 public alpha` qualifier where release posture is
  stated.
- Avoid self-healing, autonomous runtime, built-in scanner, ROI, adoption, or
  superiority language.

# Test Plan

Run docs build/reference checks and `test-404`; verify headings, links,
navigation placement, runtime boundary, dormant suppression, and preview noindex.

# Links / Artifacts

- `dec-74`
- `prop-8`
- `test-404`
