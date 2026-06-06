---
id: task-248
type: task
title: add db events smoke and prepublish closeout
status: done
priority: 1
epic: epic-29
parent: goal-4
tags: [project-db, events, smoke, prepublish]
owners: []
links: []
artifacts: [scripts/smoke-db-events.js, package.json, scripts/assert-publish-ready.js]
relates: [epic-29, epic-32, task-187, task-188, task-189, task-190, task-193, goal-4]
blocked_by: []
blocks: []
refs: [goal-4]
aliases: [db-events-smoke-prepublish]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Add the packed temp-repo `smoke:db-events` proof and wire the event/receipt/
reducer/lease foundation into the non-publish prepublish gate.

# Acceptance Criteria

- `scripts/smoke-db-events.js` packs and installs mdkg into a temp prefix.
- The smoke initializes a fresh repo, runs `db init/migrate/verify/stats`,
  exercises packaged internal event, receipt, reducer, and writer lease helpers,
  seals/verifies/dumps/diffs snapshots, runs `index` and `validate`, and checks
  ignore policy.
- `package.json` exposes `smoke:db-events` and includes it in
  `prepublishOnly`.
- `scripts/assert-publish-ready.js` requires compiled event/reducer/lease
  helpers and docs that state this support is internal/local only.
- Dry-run pack and publish checks pass; no real publish happens.

# Files Affected

- `scripts/smoke-db-events.js`
- `package.json`
- `scripts/assert-publish-ready.js`
- README, command matrix, seeded init docs, and changelog release notes.

# Implementation Notes

- The smoke proves npm-facing behavior using a packed install, not local source
  imports.
- Public CLI remains unchanged; no public db event/reducer/lease commands are
  added.

# Test Plan

- `npm run smoke:db-events`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Links / Artifacts

- `goal-4`
- `epic-32`
- `task-187`
- `task-188`
- `task-189`
- `task-190`

# Completion Evidence

- Added `scripts/smoke-db-events.js` and `npm run smoke:db-events`.
- Added `smoke:db-events` to `prepublishOnly`.
- Extended `scripts/assert-publish-ready.js` and docs/seeded docs to state that
  event, receipt, reducer, lease, and queue support is internal/local only.
- Verified `npm pack --dry-run --json` and `npm publish --dry-run` with
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`; no real publish happened.
