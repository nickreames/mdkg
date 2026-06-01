---
id: task-198
type: task
title: release gate and packaging audit
status: done
priority: 1
epic: epic-35
tags: [release, packaging, npm, verification]
owners: []
links: []
artifacts: [scripts/assert-publish-ready.js, package.json, package-lock.json, npm run build, npm run test, npm run cli:check, node dist/cli.js validate, all smoke scripts, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run]
relates: [epic-35, task-196, task-197]
blocked_by: [task-196, task-197]
blocks: [task-202]
refs: [rule-5, rule-6]
aliases: [release-gate-audit]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Run and record the full publish-readiness gate before any release approval.

# Acceptance Criteria

- Full test, CLI, validation, smoke, and publish dry-run gates are run.
- Pack contents are inspected for compiled `dist`, seeded init assets, docs,
  postinstall scripts, and absence of temp/audit-only artifacts.
- Failures are recorded with exact remediation tasks instead of being papered
  over.
- No real npm publish happens in this task.

# Files Affected

- `.mdkg/work/task-198-release-gate-and-packaging-audit.md`
- `.mdkg/work/task-202-audit-closeout-checkpoint.md`

# Implementation Notes

If a gate fails because of missing network access or npm auth, record the exact
environment failure separately from product correctness.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- all current smoke scripts, including SQLite and parallel smokes
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Audit Evidence

- `package.json`, `package-lock.json`, and the lock root version are `0.1.4`.
- `npm run build`: passed.
- `npm run build:test`: passed.
- `npm run test`: passed with 366 tests.
- `npm run cli:check`: passed.
- `node dist/cli.js validate`: passed.
- Help parity checks passed:
  - `node dist/cli.js help subgraph` documents `add/list/show/rm/enable/disable/verify/refresh`.
  - `node dist/cli.js help capability` documents `capability resolve`.
  - `node dist/cli.js help bundle import` exits with migration guidance to
    `mdkg subgraph`.
- All smoke scripts passed individually: consumer, matrix, upgrade, init,
  capabilities, archive-work, bundle, subgraph, visibility, SQLite, and
  parallel.
- `node scripts/assert-publish-ready.js`: passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed with the isolated cache.
- Pack dry-run produced `mdkg-0.1.4.tgz`, 131 files, package size 171.4 kB,
  unpacked size 804.7 kB, shasum
  `a9ae4294020b53f91694aff97d0ffee73a54b8db`, and included expected
  `dist/cli.js`, `dist/commands/subgraph.js`, `dist/graph/subgraphs.js`,
  `dist/init`, docs, package metadata, and `scripts/postinstall.js`.
- Pack dry-run output did not include stale removed bundle-import compiled
  artifacts such as `dist/commands/bundle_import.js` or
  `dist/graph/bundle_imports.js`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed.
  It reran the full `prepublishOnly` chain, ran `prepack`, printed the
  `0.1.4` tarball contents, and ended with `+ mdkg@0.1.4`.
- `git diff --check`: passed after evidence edits.
- Real publish evidence from 2026-05-31:
  `NPM_CONFIG_USERCONFIG=/private/tmp/mdkg-publish.npmrc
  NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish
  --registry=https://registry.npmjs.org/` passed after rerunning the full
  `prepublishOnly` gate and ended with `+ mdkg@0.1.4`.
- Registry readback confirmed `mdkg@0.1.4` exists and `npm dist-tag ls mdkg`
  reports `latest: 0.1.4`.

# Decision

The local `0.1.4` release gate is green, and `mdkg@0.1.4` is published as
`latest`.

# Links / Artifacts

- `task-196`
- `task-197`
- `task-202`
