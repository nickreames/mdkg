---
id: chk-130
type: checkpoint
title: packed spike smoke and prepublish gate verified
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-350]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-350]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

Completed the packed temp-repo spike smoke and prepublish gate wiring for
`task-350`. The new `smoke:spike` script now proves first-class spike behavior
from an installed package tarball, and `prepublishOnly` runs it immediately
after command-doc generation.

# Scope Covered

- `scripts/smoke-spike.js`
- `package.json`
- packed install behavior from generated tarballs
- prepublish wiring for `smoke:spike`
- package dry-run file inclusion for the bundled spike template

# Decisions Captured

- Spike release proof must use a packed installed CLI, not only local
  `node dist/cli.js`.
- The smoke confirms existing `mdkg task ...` lifecycle commands remain the
  public lifecycle surface for spikes.
- Follow-up tasks/tests and skill candidates are explicit spike outputs, not
  automatic file generation.

# Implementation Summary

The smoke packs mdkg, installs the tarball into a temp npm prefix, initializes a
fresh repo, creates and mutates a spike, routes a goal to that spike, verifies
search/show/pack behavior, creates explicit follow-up task/test records, checks
that skill candidate text does not automatically create a new skill, and runs
validation/status checks. `package.json` now exposes `npm run smoke:spike` and
the full prepublish gate includes it.

# Verification / Testing

- `npm run smoke:spike`; passed from packed installed tarball at
  `/private/tmp/mdkg-spike.Qt2fkM/repo`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`;
  passed and included `dist/init/templates/default/spike.md`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`; passed
  the full `prepublishOnly` chain and ended with `+ mdkg@0.3.1` without a real
  publish. The embedded `smoke:spike` run used
  `/private/tmp/mdkg-spike.AmQZDd/repo`.
- `node dist/cli.js validate --json`; passed with zero warnings/errors.
- `git diff --check`; passed.

# Known Issues / Follow-ups

- `task-351` should dogfood real mdkg.dev research spikes and feed paused
  mdkg.dev launch planning without starting website implementation.
- `task-368` still owns the final `0.3.2` release-candidate version/changelog
  and dry-run publish closeout.

# Links / Artifacts

- `task-350`
- `test-144`
- `scripts/smoke-spike.js`
