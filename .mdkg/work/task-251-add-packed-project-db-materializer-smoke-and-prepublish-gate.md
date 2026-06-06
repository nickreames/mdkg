---
id: task-251
type: task
title: add packed project db materializer smoke and prepublish gate
status: done
priority: 1
epic: epic-33
parent: goal-5
tags: [project-db, materializer, smoke, prepublish]
owners: []
links: []
artifacts: []
relates: [goal-5, epic-33, task-250, task-193]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Add packed temp-repo smoke coverage and release-gate wiring for the internal
project DB materializer after the helper exists.

# Acceptance Criteria

- Smoke installs from a packed package into a temp prefix and initializes a
  fresh mdkg repo.
- Smoke exercises queue, event, reducer, writer lease/CAS, receipt, snapshot,
  index, and validate behavior through the materializer helper.
- `npm run smoke:db-materializer` is added to the prepublish readiness ladder in
  the later functional implementation slice.
- No real npm publish, tag, or push is performed by this task.

# Files Affected

- Future smoke script, package scripts, publish-readiness checks, and docs.

# Implementation Notes

- Keep this blocked until `task-250` defines the internal helper behavior.
- The smoke should prove packaged behavior, not just local source behavior.

# Test Plan

- `npm run smoke:db-materializer`
- Existing DB, queue, events, and snapshot smokes.
- Dry-run pack and publish checks only.

# Evidence

- Added `scripts/smoke-db-materializer.js`.
- Added `smoke:db-materializer` to `package.json`.
- Added `smoke:db-materializer` to `prepublishOnly`.
- Extended `scripts/assert-publish-ready.js` to require
  `dist/core/project_db_materializer.js` and seeded internal-only materializer
  docs.
- Updated root and seeded docs/changelog to state materializer support is
  internal/local only with no public `mdkg db materializer` CLI.
- `npm run test` passed.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- `npm run smoke:db`, `npm run smoke:db-queue`, `npm run smoke:db-events`,
  `npm run smoke:db-materializer`, and `npm run smoke:db-snapshot` passed
  serially.
- `node scripts/assert-publish-ready.js` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed and included `dist/core/project_db_materializer.js`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed
  through `prepublishOnly` and ended with dry-run `+ mdkg@0.1.9`.
- `git diff --check` passed.

# Links / Artifacts

- `goal-5`
- `task-250`
- `test-86`
- `task-193`
