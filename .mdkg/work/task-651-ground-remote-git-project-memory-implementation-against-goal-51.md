---
id: task-651
type: task
title: ground remote Git project-memory implementation against goal-51
status: done
priority: 1
parent: goal-52
tags: [remote-git, project-memory, source-grounding]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-653]
refs: [goal-51, goal-53, task-650, test-338, dec-61, dec-62, dec-63, dec-64, edd-62, edd-63, edd-64]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-03
updated: 2026-07-05
---
# Overview

Ground future implementation against the accepted `goal-51` planning records
before editing source or docs.

# Acceptance Criteria

- Read `goal-51`, `task-650`, `test-338`, `dec-61`, `dec-62`, `edd-62`, and
  `edd-63`, plus `dec-63`, `dec-64`, `edd-64`, and the deferred query-design
  follow-up `goal-53`.
- Inspect current source/CLI/docs/template surfaces before choosing exact
  implementation files.
- Confirm `service-boundary-ownership-check` applies and record owner,
  consumer, and forbidden-surface classifications.
- Produce a scoped implementation plan that preserves the credential and
  product-naming boundaries.
- Confirm `goal-52` excludes project-memory semantic query UX and routes that
  work to `goal-53`.
- Decide exact implementation files for `mdkg git` clone/fetch/inspect,
  closeout, push-readiness, and push behavior before source edits begin.

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
- `dec-63`
- `dec-64`
- `edd-62`
- `edd-63`
- `edd-64`
- `goal-53`
