---
id: chk-23
type: checkpoint
title: v0.1.3 bundle implementation ready
status: done
priority: 1
tags: [bundle, release-readiness, v0.1.3]
owners: []
links: []
artifacts: [npm-pack-dry-run, npm-publish-dry-run, smoke-bundle]
relates: [epic-22]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-133, task-134, task-135, task-136, task-137, task-138, test-82]
created: 2026-05-17
updated: 2026-05-17
---
# Summary

`epic-22` is implemented for the v0.1.3 release candidate. mdkg now has an
explicit `mdkg bundle` namespace for deterministic private/public full graph
snapshot bundles.

# Scope Covered

- Bundle manifest and visibility contract.
- Deterministic multi-file ZIP support.
- Bundle create/list/show/verify CLI surface.
- Public/private profile filtering and fail-closed diagnostics.
- Docs, help snapshots, command matrix, init guidance, and release skill
  updates.
- Pre-commit archive compression plus private bundle refresh guidance in
  canonical, mirrored, and seeded default skills.
- Unit, CLI, packed-package smoke, pack dry-run, and publish dry-run coverage.

# Decisions Captured

- Bundle refresh is explicit only; `mdkg index` does not rewrite bundles.
- Private bundles are default and may be tracked in private repos when
  configured.
- Public bundles include only public workspace content and public archive
  sidecars/ZIP caches.
- Public bundle creation fails if public records point at private graph or
  archive records.
- Bundle import and lazy read-only subgraph loading remain future work in
  `epic-23`.

# Implementation Summary

- Added `src/commands/bundle.ts`.
- Extended `src/util/zip.ts` with deterministic multi-file ZIP creation and
  ZIP entry reading.
- Added bundle config defaults to root and init config.
- Added command dispatch/help, command matrix checks, doctor guidance, docs,
  and release skill guidance.
- Added `scripts/smoke-bundle.js` and bundle-focused tests.

# Verification / Testing

- `npm run test` passed with 339 tests.
- `npm run build && npm run build:test && node --test dist/tests/commands/init.test.js dist/tests/commands/upgrade.test.js` passed.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- `node dist/cli.js index` passed.
- `npm run smoke:consumer` passed.
- `npm run smoke:matrix` passed.
- `npm run smoke:upgrade` passed.
- `npm run smoke:init` passed.
- `npm run smoke:capabilities` passed.
- `npm run smoke:archive-work` passed.
- `npm run smoke:bundle` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed and included `dist/commands/bundle.js` and `dist/util/zip.js`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed.

# Known Issues / Follow-ups

- Bundle import/lazy subgraph loading remains in `epic-23`.
- Optional SQLite DAL remains future work and should consume the same manifest
  and generated index contracts.

# Links / Artifacts

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `tests/commands/bundle.test.ts`
- `scripts/smoke-bundle.js`
