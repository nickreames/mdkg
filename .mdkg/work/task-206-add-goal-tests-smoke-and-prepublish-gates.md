---
id: task-206
type: task
title: add goal tests smoke and prepublish gates
status: done
priority: 1
epic: epic-36
prev: task-205
next: task-207
tags: [goal, tests, smoke, prepublish]
owners: []
links: []
artifacts: []
relates: [epic-36, task-203, task-204, task-205]
blocked_by: []
blocks: [task-207]
refs: [rule-5, rule-6]
aliases: [goal-smoke]
skills: []
created: 2026-05-31
updated: 2026-05-31
---

# Overview

Add focused unit, CLI, and packed-package smoke coverage for goal nodes through
pre-publish dry-run readiness.

# Acceptance Criteria

- Tests cover parsing, validation, `mdkg new goal`, list/search/show/pack,
  SQLite indexing, normal `mdkg next`, and any `mdkg goal ...` commands added.
- A packed temp repo smoke proves fresh init, goal creation, validation,
  indexing, search/show/pack, and report-only evaluation or next selection.
- `scripts/assert-publish-ready.js` includes goal template and command
  artifacts when relevant.
- Pre-publish gates pass without running a real npm publish.

# Files Affected

- tests
- smoke scripts
- `package.json` scripts
- `scripts/assert-publish-ready.js`

# Implementation Notes

- Reuse the isolated npm cache pattern:
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`.
- Do not create network-dependent tests.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- new goal smoke script
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Verification Evidence

- Added `tests/commands/goal.test.ts` and extended parser/new/next tests.
- Added `scripts/smoke-goal.js` and `npm run smoke:goal`; packed-package
  smoke passed with version `0.1.5`.
- `scripts/assert-publish-ready.js` now requires `dist/commands/goal.js`,
  seeded goal onboarding, and `dist/init/templates/default/goal.md`.
- Full `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
  passed all prepublish scripts and reported `+ mdkg@0.1.5`.

# Links / Artifacts

- `task-203`
- `task-204`
- `task-205`
- `task-207`
