---
id: task-651
type: task
title: ground remote Git project-memory implementation against goal-51
status: todo
priority: 1
parent: goal-52
tags: [remote-git, project-memory, source-grounding]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-653, task-654, task-655]
refs: [goal-51, task-650, test-338, dec-61, dec-62, edd-62, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Ground future implementation against the accepted `goal-51` planning records
before editing source or docs.

# Acceptance Criteria

- Read `goal-51`, `task-650`, `test-338`, `dec-61`, `dec-62`, `edd-62`, and
  `edd-63`.
- Inspect current source/CLI/docs/template surfaces before choosing exact
  implementation files.
- Confirm `service-boundary-ownership-check` applies and record owner,
  consumer, and forbidden-surface classifications.
- Produce a scoped implementation plan that preserves the credential and
  product-naming boundaries.

# Files Affected

- `.mdkg/work/**` evidence only in this grounding task unless implementation is
  explicitly started in child tasks.

# Implementation Notes

- This is the first node of `goal-52`.
- Do not mutate TypeScript/source/docs/templates/package files in this grounding
  task unless the owner explicitly expands scope.

# Test Plan

- `node dist/cli.js validate --changed-only --json`
- targeted public naming and credential-safety audit over the grounded plan

# Links / Artifacts

- `goal-51`
- `task-650`
- `test-338`
- `dec-61`
- `dec-62`
- `edd-62`
- `edd-63`
