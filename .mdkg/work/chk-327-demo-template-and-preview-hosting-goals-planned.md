---
id: chk-327
type: checkpoint
title: demo template and preview hosting goals planned
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-06-29
updated: 2026-06-29
---
# Summary

Graph-only planning created the next mdkg demo lane. `goal-44` is active and
routes to `task-618`; `goal-46` is a paused/blocked follow-up for durable
`demo-N.mdkg.dev` hosting after an accepted preview exists.

# Scope Covered

Scope is `goal-44` and `goal-46`.

## Changed Surfaces

- Added root goals `goal-44` and `goal-46`.
- Added decisions `dec-56` and `dec-57`.
- Added EDDs `edd-58` and `edd-59`.
- Added primary execution nodes `epic-205`, `task-618` through `task-622`, and
  `test-321` through `test-325`.
- Added follow-up hosting nodes `epic-206`, `spike-23`, `task-623` through
  `task-626`, and `test-326` through `test-327`.
- Refreshed mdkg index state.

## Boundaries

- in scope: mdkg graph/design/checkpoint/index state.
- out of scope: source/docs/package/site implementation, Vercel project
  creation, preview deploy, DNS, custom domains, aliases, production promotion,
  git push, tag, npm publish, and analytics activation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-56`: one canonical website demo template replaces ad hoc demo planning.
- `dec-57`: v1 uses Vercel previews before durable `demo-N` hosting.

# Implementation Summary

`goal-44` is the immediate active lane. It defines
`examples/website-demo-template/` as the future canonical template path,
`examples/demo-runs/demo-001/` as the first branch-path run, and
`mdkg-demo-previews` as the future dedicated Vercel preview project name.
`goal-46` is blocked by `test-325`, so DNS and non-preview hosting cannot become
actionable until an accepted preview checkpoint exists.

# Implementation Details

- Code or graph surfaces changed: mdkg work/design/index files only.
- Architecture or data-shape notes: preview evidence must record run path,
  fork receipt, Vercel project/deployment ids, preview URL, commit SHA, build
  logs, screenshots, noindex state, and accept/reject/polish recommendation.
- Compatibility notes: no new mdkg npm release is required unless future
  implementation proves a CLI gap.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js index`
  result: passed.
- command: `node dist/cli.js validate --changed-only --json`
  result: passed with `ok: true`.
- command: `node dist/cli.js goal next goal-44 --json`
  result: selected `task-618` with no warnings.
- command: `git diff --check`
  result: passed.

## Pass / Fail Status

- status: pass for graph-only enhancement planning.

## Known Warnings

- warning: full graph validation has the existing accepted legacy `SPEC.md`
  compatibility warning outside this change set.

# Known Issues / Follow-ups

- Implement `task-618` next.
- Do not start `goal-46` until `test-325` passes with an accepted preview.

## Follow-up Refs

- `task-618`
- `goal-46`
- `test-325`

# Links / Artifacts

- `goal-44`
- `goal-46`
- `dec-56`
- `dec-57`
- `edd-58`
- `edd-59`

# Raw Content Safety

- Evidence is summarized through graph refs and command receipts. No raw
  secrets, prompts, provider payloads, tokens, DNS credentials, Vercel bypass
  data, or bulky logs are stored here.
