---
id: task-197
type: task
title: completed feature audit for 0.1.2 and 0.1.3
status: done
priority: 1
epic: epic-35
tags: [release, audit, features, coverage]
owners: []
links: []
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, npm run test, npm run smoke:init, npm run smoke:upgrade, npm run smoke:capabilities, npm run smoke:archive-work, npm run smoke:bundle, npm run smoke:bundle-import, npm run smoke:visibility, npm run smoke:sqlite, npm run smoke:parallel]
relates: [epic-35, epic-19, epic-20, epic-22, epic-23, epic-24, epic-25, epic-26, epic-27]
blocked_by: []
blocks: [task-198, task-200]
refs: [rule-3, rule-4, rule-5]
aliases: [completed-feature-audit]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Verify that the completed feature suite from `0.1.2` and `0.1.3` is represented
consistently in graph records, docs, tests, and smoke coverage.

# Acceptance Criteria

- Audit init/upgrade parity, archive sidecars, work lifecycle helpers, bundles,
  imports, visibility, capability cache, SQLite DAL, and parallel safety.
- Confirm each completed feature has graph evidence, docs, tests, and smoke
  coverage or an explicit documented gap.
- Confirm smoke scripts listed in package metadata match the current release
  posture.
- Identify any feature that should be excluded from the next roadmap because it
  is already complete.

# Files Affected

- `.mdkg/work/task-197-completed-feature-audit-for-0-1-2-and-0-1-3.md`
- Completed epic/task nodes if evidence needs to be appended.

# Implementation Notes

This is an audit task, not a refactor. Treat missing evidence as a release
readiness gap and route fixes through `task-198` or `task-202`.

# Test Plan

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `npm run smoke:bundle-import`
- `npm run smoke:visibility`
- `npm run smoke:sqlite`
- `npm run smoke:parallel`

# Audit Evidence

- `npm run test` passed with 364 tests.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- Smokes passed: consumer, matrix, upgrade, init, capabilities, archive-work,
  bundle, bundle-import, visibility, SQLite, and parallel.
- `CHANGELOG.md` covers `0.1.2` capability cache, init/upgrade parity,
  archive/work lifecycle, bundles/imports/visibility, and `0.1.3` SQLite DAL
  plus parallel mutation hardening.
- Graph coverage exists for completed feature epics `19`, `20`, and `22`
  through `27`; project DB and subgraph expansion remain future work.

# Decision

Completed `0.1.2` and `0.1.3` feature surfaces are represented in graph,
docs, tests, and packed/temp smoke coverage.

# Links / Artifacts

- `epic-19`
- `epic-20`
- `epic-22`
- `epic-23`
- `epic-24`
- `epic-25`
- `epic-26`
- `epic-27`
