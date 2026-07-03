---
id: chk-344
type: checkpoint
title: seeded mdkg 0.4.1 contract-profile implementation and release goals
status: done
priority: 1
tags: [0.4.1, contract-profile, goal-seeding, release-planning]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-49, goal-50, goal-48, task-637, task-639, task-640, task-641, task-642, task-643, task-644, test-333, test-334, test-335, task-645, task-646, task-647, task-648, test-336]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-07-02
updated: 2026-07-02
---
# Summary

Created the follow-on execution structure for the completed `goal-48` planning
lane. `goal-49` is the active implementation/readiness goal for `mdkg@0.4.1`
generic contract-profile support. `goal-50` is the blocked publish and
post-publish validation goal.

# Scope Covered

- `goal-49`: source/tests/docs/default-assets implementation readiness lane.
- `goal-50`: approval-gated npm release and consumer validation lane.
- Implementation nodes: `task-637`, `task-639`, `task-640`, `task-641`,
  `task-642`, `task-643`, `task-644`, `test-333`, `test-334`, `test-335`.
- Release nodes: `task-645`, `task-646`, `task-647`, `task-648`, `test-336`.

# Decisions Captured

- Release target is `mdkg@0.4.1` because current `package.json` is `0.4.0`
  and the planned contract-profile fields are additive.
- Implementation and publish are split into separate root goals.
- Full default/init asset updates are in scope for implementation only after
  validators, profile CLI, scaffolds/helpers, and upgrade-preservation checks
  pass.
- Real npm publish, tag, push, deploy, DNS, provider mutation, and downstream
  repo mutation remain explicit-approval-only.

# Implementation Summary

No functional source implementation occurred. This was a graph-only seeding
pass that made the `goal-48` plan executable:

- `goal-49` starts at `task-637` for source grounding.
- `goal-49` then proceeds through validator diagnostics, profile CLI, scaffold
  and work-helper flags, default/init assets, docs/release surfaces, and
  readiness closeout.
- `goal-50` remains blocked by `test-335` and starts at `task-645` only after
  implementation readiness is proven.

# Verification / Testing

Pending final graph validation in this pass:

- `node dist/cli.js index`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --summary --limit 20 --json`
- `node dist/cli.js goal next goal-49 --json`
- `node dist/cli.js goal show goal-50 --json`
- `git diff --check`

# Known Issues / Follow-ups

- Execute `goal-49` next; do not start `goal-50` until `test-335` passes.
- `goal-50` publish/push/tag operations require explicit approval at execution
  time.

# Links / Artifacts

- `goal-48`
- `goal-49`
- `goal-50`
