---
id: chk-335
type: checkpoint
title: demo short path source route plan accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-628]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-628]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

The short-path demo source plan was accepted for `goal-44`. Public accepted
demos use `/demos` as the directory and `/demo/1`, `/demo/2`, etc. as detail
routes in the existing `mdkg-dev` Astro app.

# Scope Covered

- `task-628`
- `goal-44`
- `dec-58`
- `dec-59`
- `edd-60`
- `edd-61`

## Changed Surfaces

- mdkg graph/task state for the source-routing plan
- future implementation paths:
  - `mdkg-dev/src/pages/demos.astro`
  - `mdkg-dev/src/pages/demo/[id].astro`
  - `mdkg-dev/src/pages/demo/[id]/output.astro`

## Boundaries

- in scope: route shape, acceptance gates, local validation requirements
- out of scope: push, deploy, DNS, tag, npm publish, provider mutation
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `dec-58`: accepted demos use short path URLs.
- `dec-59`: v1 uses the existing `mdkg-dev` Astro project.
- `edd-60`: demo pages expose graph, filesystem, and output surfaces.
- `edd-61`: heavier viewer code must be lazy loaded.

# Implementation Summary

The plan replaces the earlier dedicated preview-project/DNS-first direction with
local source integration in `mdkg-dev`. The accepted public route contract is
`/demos`, `/demo/1`, and a noindex output surface under `/demo/1/output`.

# Implementation Details

- Code or graph surfaces changed: mdkg task/checkpoint state only for this
  checkpoint phase.
- Architecture or data-shape notes: demo content must be sanitized and committed
  as a bounded snapshot before public display.
- Compatibility notes: no new npm CLI surface is required for v1.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js goal claim goal-44 task-628 --json`
- result: `task-628` was selected for execution.
- command: `node dist/cli.js task done task-628 --checkpoint ... --json`
- result: checkpoint `chk-335` created.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none for this checkpoint

# Known Issues / Follow-ups

- `task-629` must create the sanitized Demo 1 snapshot.
- `task-630`, `test-324`, and `test-329` must prove the routes locally before
  `goal-44` can close.

## Follow-up Refs

- `task-629`
- `task-630`
- `test-324`
- `test-329`
- `test-325`

# Links / Artifacts

- `.mdkg/work/task-628-plan-mdkg-dev-demos-and-demo-1-astro-source-routes.md`

# Raw Content Safety

- Evidence is summarized with file and node refs only.
