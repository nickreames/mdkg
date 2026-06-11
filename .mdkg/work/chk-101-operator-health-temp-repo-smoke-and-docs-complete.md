---
id: chk-101
type: checkpoint
title: operator health temp repo smoke and docs complete
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-333]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-333]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Added the packed temp-repo operator-health smoke and docs gate for the 0.3.2
status/doctor strict surface. The package now proves `mdkg status --json` and
`mdkg doctor --strict --json` from an installed tarball in `/private/tmp` across
clean, dirty, selected-goal, achieved selected-goal, and DB-enabled states.

# Scope Covered

- `task-333`
- `test-134`
- `edd-17`

# Decisions Captured

- `CLI_COMMAND_MATRIX.md` is now included in the npm package because it is the
  canonical command reference.
- The smoke intentionally refreshes generated caches with `mdkg index` after
  DB setup before expecting strict doctor to pass.
- Strict doctor failure for an achieved selected goal is tested as an expected
  nonzero command result, then the selected goal is cleared before final
  validation.

# Implementation Summary

- Added `scripts/smoke-operator-health.js`.
- Added `npm run smoke:operator-health` and inserted it into `prepublishOnly`.
- Extended `scripts/assert-publish-ready.js` to require the operator-health
  smoke, compiled status command, strict doctor checks, and docs guidance.
- Updated root and seeded README operator-health guidance.
- Added `CLI_COMMAND_MATRIX.md` to the package `files` list.

# Verification / Testing

- `npm run smoke:operator-health`
  - temp root: `/private/tmp/mdkg-operator-health.mehEB0`
  - tarball: `/private/tmp/mdkg-operator-health.mehEB0/pack/mdkg-0.3.0.tgz`
- `node scripts/assert-publish-ready.js`
- Prior task-332 gates still apply: `npm run test`, `npm run cli:check`, and
  `node dist/cli.js doctor --strict --json`.

# Known Issues / Follow-ups

- Full `prepublishOnly` was not rerun in this slice; the new smoke and
  publish-readiness assertion were run directly.
- Next roadmap work moves to dry-run fix planning under `task-327`.

# Links / Artifacts

- `scripts/smoke-operator-health.js`
- `scripts/assert-publish-ready.js`
- `README.md`
- `assets/init/README.md`
- `package.json`
