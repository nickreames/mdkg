---
id: task-304
type: task
title: close goal-9 evidence and confirm npm package publish readiness
status: done
priority: 1
epic: epic-62
parent: goal-9
prev: task-303
tags: [closeout, release, npm, evidence]
owners: []
links: []
artifacts: [checks://goal-9-final-validate, checks://goal-9-final-capability-spec-linkage, checks://goal-9-final-work-receipt-verify, artifact://tmp/mdkg-prepublish-0.3.0.log, artifact://tmp/mdkg-pack-dry-run-0.3.0.log, artifact://tmp/mdkg-publish-dry-run-0.3.0.log]
relates: [goal-9, epic-62]
blocked_by: [task-303, test-118]
blocks: []
refs: [dec-28]
aliases: [goal-9-closeout, 0-3-0-publish-ready-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Record final closeout evidence and mark the goal achieved only when every
required gate is proven.

# Acceptance Criteria

- Scoped tasks, tests, and epics are done.
- Required checks are recorded with evidence.
- `goal next goal-9` returns no actionable node.
- Goal says publish-ready, not published.

# Files Affected

- `goal-9`
- scoped epics and validation nodes

# Implementation Notes

- Close only after all child tasks/tests are complete and required checks have evidence.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js goal next goal-9 --json`
- `git diff --check`

# Links / Artifacts

- `test-118`

# Closeout Evidence

Final closeout evidence recorded on 2026-06-06.

## Scoped Node State

- All scoped tasks and tests are done except this active closeout task at the
  time evidence was recorded.
- `test-106` is done with `chk-85`, using historical evidence from `task-280`
  and `chk-58` for the initial `goal next goal-9 --json -> task-280` route.
- `epic-53` through `epic-61` are done with closeout summaries tied to their
  child tasks and tests.
- `epic-62` remains open only until this final closeout task is marked done.

## Current Verification

- `node dist/cli.js index`: passed and refreshed JSON, capability, subgraph,
  and SQLite indexes.
- `node dist/cli.js --version`: `0.3.0`.
- `node scripts/assert-publish-ready.js`: `publish readiness ok`.
- `node dist/cli.js validate --json`: `ok: true`, no warnings, no errors.
- `node dist/cli.js goal show goal-9 --json`: shows `goal-9` with
  `active_node: task-304`.
- `node dist/cli.js goal next goal-9 --json`: returns `task-304` while this
  closeout task is active, with only non-actionable design-scope warnings.
- `node dist/cli.js capability list --kind spec --json`: returns one concrete
  SPEC capability, `root:spec.mdkg-cli`.
- `node dist/cli.js capability search "mdkg cli tool spec" --json`: returns
  the dogfood SPEC plus linked WORK contract capability context.
- `node dist/cli.js spec list --json`: returns one SPEC record.
- `node dist/cli.js spec show root:spec.mdkg-cli --json`: shows
  `spec_kind: cli_tool`, `runtime_mode: tool_service`, and
  `requested_capabilities` including `mdkg.graph.read`, `mdkg.graph.write`, and
  `mdkg.project_db.local`.
- `node dist/cli.js spec validate root:spec.mdkg-cli --json`: `ok: true`, no
  warnings, no errors.
- `node dist/cli.js work order status root:order.goal-9-dogfood-trigger-task-291 --json`:
  returns the submitted dogfood order and linked verified receipt.
- `node dist/cli.js work receipt verify root:receipt.goal-9-dogfood-trigger-task-293 --json`:
  `ok: true` with successful linkage, outcome, receipt status, evidence,
  archive ref, and redaction policy checks.
- `git diff --check`: passed.

## Package Dry-Run Evidence

`task-302` and `test-118` record the package release proof without publishing:

- `/private/tmp/mdkg-prepublish-0.3.0.log`: `npm run prepublishOnly` exited 0
  and includes all prepublish smokes, `smoke:goal ok`, and
  `publish readiness ok`.
- `/private/tmp/mdkg-pack-dry-run-0.3.0.log`: `npm pack --dry-run --json`
  exited 0 for `mdkg@0.3.0`, filename `mdkg-0.3.0.tgz`, with 154 entries.
- `/private/tmp/mdkg-publish-dry-run-0.3.0.log`: `npm publish --dry-run`
  exited 0, reported `mdkg-0.3.0.tgz`, 154 total files, registry publication
  as `(dry-run)`, and ended with `+ mdkg@0.3.0`.
- No real `npm publish`, tag, or push was run in this goal.

## Publish Boundary

The source package is publish-ready for `0.3.0` based on local gates, pack
dry-run, and publish dry-run evidence. The package has not been published by
this goal.
