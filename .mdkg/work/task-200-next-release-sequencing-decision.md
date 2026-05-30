---
id: task-200
type: task
title: next release sequencing decision
status: done
priority: 1
epic: epic-35
tags: [roadmap, release, sequencing, pre-v1]
owners: []
links: []
artifacts: [0.1.x roadmap, epic-21, epic-30, epic-31, epic-32, epic-33, epic-34]
relates: [epic-35, epic-20, epic-21, epic-29, epic-30, epic-31, epic-32, epic-33, epic-34]
blocked_by: [task-194, task-195, task-196, task-197, task-199]
blocks: [task-201, task-202]
refs: [rule-5]
aliases: [release-sequencing]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Produce the ordered `0.1.x` roadmap and release themes after the audit evidence
is collected.

# Acceptance Criteria

- Preserve the decision to stay in the `0.1.x` line for now.
- Define the immediate cleanup/reconciliation step for the current `0.1.3`
  state.
- Confirm `epic-21` as the next implementation release unless audit evidence
  contradicts it.
- Sequence `epic-29` through `epic-34` after subgraph orchestration is stable.
- Define blockers and publish criteria for each planned release.

# Files Affected

- `.mdkg/work/task-200-next-release-sequencing-decision.md`
- `CHANGELOG.md` if release labels need correction in a later implementation
  pass.

# Implementation Notes

Default release order:

1. `0.1.3` reconciliation for current package/git/changelog state.
2. `0.1.4` for `epic-21` subgraph orchestration.
3. `0.1.5` for `epic-30` mdkg db foundation.
4. `0.1.6+` for sealed snapshots, local events/receipts, typed reducers,
   materializers, privacy exports, profiles, and future Rust sidecar work.

# Test Plan

- `node dist/cli.js list --type epic --json`
- `node dist/cli.js list --type task --json`
- `node dist/cli.js pack task-200 --profile concise --dry-run --stats`

# Audit Evidence

- Registry and local package state are both `0.1.3`.
- The `0.1.3` local gate passed, so release sequencing can move to the next
  feature release after commit hygiene.
- `epic-21` tasks are present and ordered for subgraph orchestration.
- `epic-29` through `epic-34` are future project application DB planning epics,
  not the next implementation pass.

# Decision

Approved `0.1.x` sequence:

1. Reconcile and commit current `0.1.3` audit/release state.
2. `0.1.4`: implement `epic-21` subgraph orchestration.
3. `0.1.5`: implement `epic-30` mdkg db foundation.
4. `0.1.6+`: sealed snapshots, local event store, receipts, reducers, workers,
   privacy/profile export, and future Rust sidecar work.

# Links / Artifacts

- `epic-20`
- `epic-21`
- `epic-29`
- `epic-30`
- `epic-31`
- `epic-32`
- `epic-33`
- `epic-34`
