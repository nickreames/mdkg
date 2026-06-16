---
id: task-370
type: task
title: create mdkg.dev source backed page evidence matrix
status: todo
priority: 2
epic: epic-78
parent: goal-15
tags: [mdkg-dev, evidence-matrix, generated-docs, spike-backed]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-354]
blocks: [task-355, task-356, task-357, task-358, task-359, test-157]
refs: [spike-1, spike-2, spike-3, spike-4, spike-5]
aliases: []
skills: []
created: 2026-06-15
updated: 2026-06-15
---
# Overview

Create the mdkg.dev page evidence matrix that maps every planned public page,
claim, and example to its source of truth. This prevents the launch site from
drifting into unverified marketing copy or hand-authored command references.

# Acceptance Criteria

- Define a matrix with page id, page type, owner, generated source, source hash,
  related commands, smoke/example proof, security/trust review status, and
  launch readiness.
- Include generated command reference pages, outcome guides, trust/security
  pages, architecture pages, examples, SEO/positioning pages, and downstream
  upgrade narratives.
- Every public claim has at least one of: generated command metadata, temp-repo
  smoke evidence, source code reference, changelog/release note, or spike
  evidence.
- Mark pages as blocked when their examples or trust review are missing.
- Feed `task-355`, `task-356`, `task-357`, `task-358`, and `task-359`.

# Files Affected

List files/directories expected to change.

- future mdkg.dev docs planning files
- generated command docs manifests
- `.mdkg/work/` evidence and launch-readiness nodes

# Implementation Notes

- Start from `spike-1` through `spike-5`.
- Keep the matrix source-backed and reviewable; do not create website pages in
  this task unless a later selected goal explicitly owns site implementation.
- Treat missing proof as a launch blocker, not as copy to smooth over.

# Test Plan

- `node dist/cli.js validate --json`
- `npm run cli:contract`
- `npm run smoke:command-docs`
- Future docs-readiness test confirms every launch page has evidence metadata.

# Links / Artifacts

- `spike-1`
- `spike-2`
- `spike-3`
- `spike-4`
- `spike-5`
- `test-157`
