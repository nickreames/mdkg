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

- `npm run build`: passed.
- `npm run test`: passed with 364 tests.
- `npm run cli:check`: passed.
- `node dist/cli.js validate`: passed.
- All smoke scripts passed individually: consumer, matrix, upgrade, init,
  capabilities, archive-work, bundle, bundle-import, visibility, SQLite, and
  parallel.
- `node scripts/assert-publish-ready.js`: passed.
- Initial `npm pack --dry-run --json` failed because the local `~/.npm` cache
  has root-owned files. Retried with
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`; pack dry-run passed.
- Pack dry-run produced `mdkg-0.1.3.tgz`, 131 files, package size 167.4 kB,
  unpacked size 784.6 kB, and included expected `dist`, `dist/init`, docs,
  package metadata, and `scripts/postinstall.js`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed.
  It reran the full `prepublishOnly` chain, ran `prepack`, printed the same
  tarball contents, and ended with `+ mdkg@0.1.3`.

# Decision

The local release gate is green. A real publish is intentionally blocked only
because `0.1.3` is already published; the next publish must use a later
`0.1.x` version.

# Links / Artifacts

- `task-196`
- `task-197`
- `task-202`
