---
id: task-630
type: task
title: build mdkg dev demo index detail and output routes
status: todo
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, mdkg-dev, astro, viewer, routes]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-628, task-629]
blocks: [test-324, test-329, task-622]
refs: [task-628, task-629, edd-60, edd-61]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Implement the mdkg-dev routes and lightweight read-only viewer for the accepted
Demo 1 public proof.

# Acceptance Criteria

- `mdkg-dev/src/pages/demos.astro` renders the accepted demos gallery.
- `mdkg-dev/src/pages/demo/[id].astro` renders Demo 1 at `/demo/1`.
- `/demo/1/output` or an equivalent static route renders the final demo output
  proof.
- Demo detail page shows synchronized graph, selected filesystem, and output
  surfaces from sanitized committed data.
- Viewer code is route-local and lazy enough to satisfy `test-329`.
- Local mdkg-dev build and Browser/Chrome desktop/mobile validation pass.

# Files Affected

- `mdkg-dev/src/pages/demos.astro`
- `mdkg-dev/src/pages/demo/[id].astro`
- future mdkg-dev demo components/data/output assets

# Implementation Notes

- This task is source implementation and should run only after this graph-only
  enhancement pass.
- Use the existing mdkg-dev project and Astro routing.
- Do not create a new Vercel project, deploy, push, tag, publish, or change DNS.
- Keep embedded VS Code-style behavior for `goal-47`; this task builds the v1
  read-only explorer.

# Test Plan

- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- Browser/Chrome local validation for `/demos`, `/demo/1`, and
  `/demo/1/output`
- `test-324`
- `test-329`
- `git diff --check`

# Links / Artifacts

- `task-628`
- `task-629`
- `test-324`
- `test-329`
