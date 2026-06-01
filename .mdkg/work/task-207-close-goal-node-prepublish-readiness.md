---
id: task-207
type: task
title: close goal node prepublish readiness
status: done
priority: 1
epic: epic-36
prev: task-206
tags: [goal, release, audit, closeout]
owners: []
links: []
artifacts: []
relates: [epic-36, prd-3, edd-10, task-203, task-204, task-205, task-206]
blocked_by: []
blocks: []
refs: [rule-5, rule-6]
aliases: [goal-closeout]
skills: []
created: 2026-05-31
updated: 2026-05-31
---

# Overview

Close the goal-node implementation slice only after every explicit requirement
from the active goal is verified against current-state evidence.

# Acceptance Criteria

- All implementation tasks under `epic-36` are done with verification evidence.
- `epic-36` summarizes final behavior, commands, tests, smoke coverage, and
  known follow-ups.
- Full pre-publish dry-run gate passes.
- No real npm publish is run.
- The active goal can be judged complete using current repo evidence, not
  intent or partial progress.

# Files Affected

- `.mdkg/work/epic-36-first-class-goal-node-support.md`
- `.mdkg/work/task-207-close-goal-node-prepublish-readiness.md`

# Implementation Notes

- Treat completion as unproven until every named command, artifact, and
  acceptance criterion has direct evidence.
- If a blocker repeats three times, record it explicitly instead of narrowing
  the goal.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- relevant smokes, including goal smoke
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Verification Evidence

- `npm run test` passed 373 tests.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- Sequential smokes passed for `smoke:init`, `smoke:upgrade`,
  `smoke:matrix`, and `smoke:goal`.
- Full `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
  passed and reported `+ mdkg@0.1.5`.
- No real `npm publish` was run.

# Links / Artifacts

- `epic-36`
- `task-203`
- `task-204`
- `task-205`
- `task-206`
