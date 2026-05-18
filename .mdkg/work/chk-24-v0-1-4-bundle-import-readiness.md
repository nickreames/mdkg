---
id: chk-24
type: checkpoint
title: v0.1.4 bundle import readiness
status: done
priority: 1
tags: [bundle-import, release-readiness, v0.1.4]
owners: []
links: []
artifacts: []
relates: [epic-23]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-139, task-140, task-141, task-142, task-143, test-83]
created: 2026-05-17
updated: 2026-05-17
---
# Summary

v0.1.4 read-only bundle import and lazy subgraph loading is implementation
complete and dry-run publish ready.

# Scope Covered

- `task-139`
- `task-140`
- `task-141`
- `task-142`
- `task-143`
- `test-83`

# Decisions Captured

- Bundle imports are dedicated `bundle_imports` config entries, not registered
  workspaces.
- Imported qids use `<import-alias>:<id>`.
- Stale imports remain usable for planning reads but fail explicit import
  verification.

# Implementation Summary

- Added `bundle_imports` config and `mdkg bundle import` registry commands.
- Projected imported bundle indexes into read-only alias qids such as
  `child_import:task-1`.
- Integrated enabled imports into list/search/show/pack/capability reads.
- Added read-only mutation guards, doctor/validate diagnostics, and public
  bundle private-import fail-closed checks.
- Added unit, CLI, and packed temp root/child smoke coverage.

# Verification / Testing

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:consumer`
- `npm run smoke:matrix`
- `npm run smoke:upgrade`
- `npm run smoke:init`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `npm run smoke:bundle-import`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Known Issues / Follow-ups

- Real `npm publish` still requires explicit approval.
- Imported bundles remain read-only; write-through mutation is intentionally
  deferred.

# Links / Artifacts

- `epic-23`
