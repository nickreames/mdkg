---
id: task-170
type: task
title: sqlite and parallel packed package smoke coverage
status: done
priority: 1
epic: epic-20
tags: [0_1_3, smoke, sqlite, parallel, package]
owners: []
links: [scripts/smoke-sqlite.js, scripts/smoke-parallel.js]
artifacts: []
relates: [epic-20, task-165, task-166, task-167, task-168, task-169]
blocked_by: [task-165, task-166, task-167, task-168, task-169]
blocks: []
refs: [rule-5]
aliases: [sqlite-parallel-smokes]
skills: []
created: 2026-05-20
updated: 2026-05-20
---

# Overview

Add packed-package and local stress coverage for the SQLite DAL and parallel
mutation paths.

# Acceptance Criteria

- `npm run smoke:sqlite` packs and installs mdkg into an isolated temp prefix.
- The SQLite smoke initializes a fresh repo, proves SQLite is configured,
  commit-eligible, rebuildable, and compatible with capability/search/show/pack.
- `npm run smoke:parallel` exercises concurrent creation, checkpoint creation,
  task updates, and concurrent index safety for SQLite and JSON modes.
- `prepublishOnly` includes both new smokes.

# Files Affected

- `scripts/smoke-sqlite.js`
- `scripts/smoke-parallel.js`
- `package.json`

# Implementation Notes

The smoke tests are intentionally temporary-repo based because this feature is
about process coordination and installed-package behavior, not just pure
functions.

# Test Plan

- `npm run smoke:sqlite`
- `npm run smoke:parallel`
- `npm publish --dry-run`

# Links / Artifacts

- `epic-20`

# Verification Evidence

- `npm run smoke:sqlite`
- `npm run smoke:parallel`
- existing package smokes also passed: consumer, matrix, upgrade, init,
  capabilities, archive-work, bundle, bundle-import, and visibility.
