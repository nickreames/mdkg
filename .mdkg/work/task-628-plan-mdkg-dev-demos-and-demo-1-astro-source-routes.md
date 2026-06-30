---
id: task-628
type: task
title: plan mdkg dev demos and demo 1 Astro source routes
status: done
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, mdkg-dev, astro, routing, source-plan]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-629, task-630, test-324]
refs: [dec-58, dec-59, edd-60, edd-61]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Plan the mdkg-dev source integration for accepted demo URLs before coding the
routes. This replaces the old dedicated-preview-project blocker with a local
Astro route plan for `/demos`, `/demo/1`, and `/demo/1/output`.

# Acceptance Criteria

- Route plan names the source files and data modules to add under `mdkg-dev`.
- `/demos` is the gallery/index page for accepted demos.
- `/demo/1` is the canonical detail route for the first accepted demo.
- `/demo/1/output` or an equivalent child route is specified for the rendered
  output proof.
- The plan states how Demo 1 derives from a sanitized snapshot of
  `examples/demo-runs/demo-001`.
- No push, deploy, DNS, tag, publish, provider mutation, or production promotion
  is authorized by this task.

# Files Affected

- Future implementation likely touches `mdkg-dev/src/pages/demos.astro`.
- Future implementation likely touches `mdkg-dev/src/pages/demo/[id].astro`.
- Future implementation likely adds mdkg-dev demo data/components.
- This planning task itself may write only mdkg graph/checkpoint evidence.

# Implementation Notes

- Prefer Astro-native routes to Vercel rewrites.
- Keep candidate demo runs local until accepted.
- Include Browser/Chrome local validation requirements in the handoff.
- Preserve the ability to add a heavier embedded workspace later through
  `goal-47`.

# Test Plan

- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js goal next goal-44 --json`
- Later coding task must run `npm --prefix mdkg-dev run build` and Browser/Chrome
  local route validation.

# Links / Artifacts

- `dec-58`
- `dec-59`
- `edd-60`
- `edd-61`
