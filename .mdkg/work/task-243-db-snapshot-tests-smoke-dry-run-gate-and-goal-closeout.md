---
id: task-243
type: task
title: db snapshot tests smoke dry run gate and goal closeout
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, tests, smoke, closeout]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-235, task-236, task-237, task-238, task-239, task-240, task-241, task-242]
blocked_by: [task-236, task-237, task-238, task-239, task-240, task-241, task-242]
blocks: [task-193, task-232, task-233, task-234]
refs: [edd-13]
aliases: [db-snapshot-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Close the snapshot goal with unit/CLI tests, packed temp-repo smoke coverage,
dry-run publish readiness, and graph evidence.

# Acceptance Criteria

- `npm run smoke:db-snapshot` is added and passes.
- Full relevant gate passes without real npm publish.
- `epic-31` and `goal-2` record completion evidence and close only after
  checks pass.
- Future profile/event tasks remain linked but unimplemented.

# Explicit Exclusions

- No real npm publish.
- No consumer repo edits.

# Files Affected

- Tests, smoke scripts, package scripts, graph closeout nodes.

# Implementation Notes

Use packed-package temp-repo coverage so the smoke proves npm-facing behavior,
not only local source files.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:db`
- `npm run smoke:db-snapshot`
- `node scripts/assert-publish-ready.js`
- isolated-cache `npm pack --dry-run --json`
- isolated-cache `npm publish --dry-run`
- `git diff --check`

# Closeout Evidence

- 2026-06-03: Added `npm run smoke:db-snapshot` and
  `scripts/smoke-db-snapshot.js` for packed-package temp-repo proof of
  `init --agent`, `db init`, `db migrate`, fixture runtime state, snapshot
  seal, verify, dump, diff, validate, and `db index verify`.
- 2026-06-03: Full unit test suite passed: `npm run test` reported 405 passing
  tests.
- 2026-06-03: Scoped checks passed: `npm run cli:check`,
  `node dist/cli.js validate`, `npm run smoke:db`,
  `npm run smoke:db-snapshot`, `node scripts/assert-publish-ready.js`, and
  `git diff --check`.
- 2026-06-03: Isolated-cache pack dry-run passed:
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  produced `mdkg-0.1.7.tgz` with `dist/core/project_db_snapshot.js` and seeded
  init assets included.
- 2026-06-03: Isolated-cache publish dry-run passed without real publish:
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
  completed with `+ mdkg@0.1.7`.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
