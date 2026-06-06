---
id: task-264
type: task
title: queue CLI docs changelog init assets and publish readiness
status: done
priority: 1
epic: epic-29
parent: goal-7
tags: [project-db, queue, docs, release]
owners: []
links: []
artifacts: []
relates: [goal-7, epic-29, epic-33, task-262, task-263, test-95, test-96, test-97]
blocked_by: [task-262, task-263]
blocks: [task-265, test-97]
refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Update release docs, seeded assets, command matrix, and publish readiness checks
so public queue CLI support is required for `0.2.0`.

# Acceptance Criteria

- README, `CLI_COMMAND_MATRIX.md`, `AGENT_START.md`, and init assets document
  `mdkg db queue`.
- Changelog describes public queue CLI, pause/resume, and snapshot policy.
- Old “no public queue CLI” assertions are removed or narrowed to internal
  event/reducer/lease/materializer surfaces.
- `scripts/assert-publish-ready.js` requires compiled queue CLI docs/assets and
  `smoke:db-queue-cli`.
- `prepublishOnly` includes `npm run smoke:db-queue-cli`.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- `assets/init/**`
- `scripts/assert-publish-ready.js`
- `package.json`

# Implementation Notes

- Keep release target as `0.2.0` unless npm registry already contains it.

# Test Plan

- `npm run cli:check`
- `node scripts/assert-publish-ready.js`
- `npm publish --dry-run`

# Links / Artifacts

- related docs
- related issues
- references
