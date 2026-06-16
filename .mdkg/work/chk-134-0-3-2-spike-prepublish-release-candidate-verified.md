---
id: chk-134
type: checkpoint
title: 0.3.2 spike prepublish release candidate verified
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-368]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-368]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

The `0.3.2` spike release candidate is prepared and verified through dry-run
package gates. Source metadata and lockfile now report `0.3.2`, the changelog
has a dated `0.3.2` section, and npm dry-run proof reports `mdkg@0.3.2`
without publishing.

# Scope Covered

- `task-368`
- `test-156`
- `goal-14` release-candidate gate evidence

# Decisions Captured

- This checkpoint is publish-ready evidence only. Real npm publish, global
  install, git tag, and git push remain out of scope until separately requested.

# Implementation Summary

- Bumped `package.json` and `package-lock.json` from `0.3.1` to `0.3.2`.
- Added the `0.3.2 - 2026-06-16` changelog release section for first-class
  spike support and hardening.
- Verified that the npm package tarball includes compiled spike support and
  `dist/init/templates/default/spike.md`.

# Verification / Testing

- `npm run build`
- `npm run test` passed with 467 tests.
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `npm run smoke:spike`
- `npm run smoke:command-docs`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  reported `mdkg@0.3.2`, `mdkg-0.3.2.tgz`, 159 files, and included the compiled
  spike template.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` reran
  `prepublishOnly` plus `prepack` and ended with `+ mdkg@0.3.2` under dry-run
  mode.
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `git diff --check`

# Known Issues / Follow-ups

- Real publish, global install, and fresh global temp-repo E2E still need an
  explicit release request.
- `goal-14` still needs final closeout evidence and handoff into paused
  mdkg.dev planning `goal-15`.

# Links / Artifacts

- Dry-run spike smoke tarball:
  `/private/tmp/mdkg-spike.jgoa3T/pack/mdkg-0.3.2.tgz`
- Dry-run command-docs smoke tarball:
  `/private/tmp/mdkg-command-docs.a0oFmR/pack/mdkg-0.3.2.tgz`
- Dry-run branch-conflict plan hash:
  `sha256:12261dfe2abf8865f9dbfeca5dfb78a2990b8637d050025731259403354928fe`
