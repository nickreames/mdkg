---
id: task-621
type: task
title: supersede dedicated Vercel preview project proof
status: done
priority: 3
epic: epic-205
parent: goal-44
tags: [demo, vercel, preview, approval, deploy, superseded]
owners: []
links: []
artifacts: [/private/tmp/mdkg-task-621-vercel-preview-pack.md, /private/tmp/mdkg-task-621-vercel-preview-pack.md.stats.json, examples/demo-runs/demo-001/dist/index.html]
relates: []
blocked_by: []
blocks: []
refs: [dec-57, dec-58, dec-59, edd-59, edd-60, edd-61]
context_refs: [dec-57, dec-58, dec-59, edd-59, edd-60, edd-61]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

This task is closed as superseded. The dedicated `mdkg-demo-previews` Vercel
project path is no longer the next proof for `goal-44`; the accepted direction
is local source integration in the existing mdkg-dev Astro app at `/demos`,
`/demo/1`, and `/demo/1/output`.

# Acceptance Criteria

- `dec-58` selects `/demo/1`, `/demo/2`, and `/demos` as the public accepted
  demo URL model.
- `dec-59` selects existing mdkg-dev Astro routes and the existing mdkg-dev
  Vercel project as the default implementation path.
- No Vercel project, deployment, DNS, alias, custom domain, git tag, npm
  publish, analytics activation, push, or production promotion occurred in this
  task.
- Historical local preflight artifacts remain attached for reference.

# Files Affected

- mdkg graph state only

# Implementation Notes

- Local preflight from the older model remains available:
  `/private/tmp/mdkg-task-621-vercel-preview-pack.md`,
  `/private/tmp/mdkg-task-621-vercel-preview-pack.md.stats.json`, and
  `examples/demo-runs/demo-001/dist/index.html` are attached artifacts.
- Future implementation should continue with `task-628`, `task-629`, and
  `task-630`.

# Test Plan

- `node dist/cli.js goal next goal-44 --json` should no longer select this
  task.
- `test-324` now validates local short-path route evidence rather than Vercel
  preview evidence.

# Links / Artifacts

- `dec-58`
- `dec-59`
- `edd-60`
- `edd-61`
