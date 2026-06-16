---
id: task-368
type: task
title: prepare 0.3.2 spike prepublish release candidate
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, release, 0.3.2, prepublish]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-349, task-350, task-365, task-366, task-367, test-153, test-154, test-155]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Prepare the spike work for `0.3.2` release-candidate readiness after
implementation, docs, smoke, and hardening tests pass. This task stops at
prepublish dry-run proof and does not perform a real npm publish.

# Acceptance Criteria

- Source/package metadata is bumped to `0.3.2` only during this future task.
- `CHANGELOG.md` has a `0.3.2` release-candidate section covering spike support
  and hardening.
- Full goal required checks pass, including packed smoke, command docs, pack
  dry-run, publish dry-run, and `git diff --check`.
- Dry-run logs report `mdkg@0.3.2`.
- No real npm publish, git tag, push, or global install occurs from this task.

# Files Affected

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- release-readiness evidence nodes

# Implementation Notes

- Use `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for npm dry-run commands.
- If registry already contains `0.3.2`, stop and re-plan `0.3.3`.
- Real publish/global install/temp E2E remains a separate explicit request.

# Test Plan

- `npm run build`
- `npm run test`
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
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Links / Artifacts

- `test-156`

# Results / Evidence

Completed on 2026-06-16 as a release-candidate dry-run only. No real npm
publish, git tag, git push, or global install was performed.

Version and changelog:

- `npm version 0.3.2 --no-git-tag-version` updated `package.json` and
  `package-lock.json`.
- `CHANGELOG.md` now contains `## 0.3.2 - 2026-06-16` with spike support,
  init/upgrade compatibility, pack/export/visibility hardening,
  validation/fix-plan UX, mdkg.dev dogfood, and no-autonomous-execution
  boundaries.
- Registry guard for `mdkg@0.3.2` returned E404 before the bump/publish dry-run
  path, so the target version was not already published.

Required checks:

- `npm run build` passed; command contract hash
  `226793aa87d0fd57e187936a5ab17a86413149cbd2d52674324921b1e5051ff7`.
- `npm run test` passed with 467 tests.
- `npm run cli:check` passed.
- `npm run cli:contract` passed.
- `node dist/cli.js validate --json` passed with zero warnings and zero errors.
- `npm run smoke:init` passed and reported version `0.3.2`.
- `npm run smoke:upgrade` passed and reported version `0.3.2`.
- `npm run smoke:spike` passed against packed tarball
  `/private/tmp/mdkg-spike.dHc44P/pack/mdkg-0.3.2.tgz`, temp repo
  `/private/tmp/mdkg-spike.dHc44P/repo`, and malformed-spike repo
  `/private/tmp/mdkg-spike.dHc44P/malformed-repo`.
- `npm run smoke:command-docs` passed against packed tarball
  `/private/tmp/mdkg-command-docs.t5x84P/pack/mdkg-0.3.2.tgz` with 84 commands
  and the same contract hash.
- `npm run prepublishOnly` passed through the full package gate, including test,
  CLI checks, command contract, graph validation, all existing smokes,
  `smoke:spike`, `smoke:goal`, and publish readiness.
- `node scripts/assert-publish-ready.js` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  reported `id: mdkg@0.3.2`, `filename: mdkg-0.3.2.tgz`, package size
  `280018`, unpacked size `1491265`, entry count `159`, and included
  `dist/init/templates/default/spike.md`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed.
  It reran `prepublishOnly` and `prepack`, printed tarball details for
  `mdkg@0.3.2`, and ended with `+ mdkg@0.3.2` under npm dry-run mode.
- `node dist/cli.js index` refreshed generated graph/capability/subgraph and
  SQLite indexes after the dry-run.
- `node dist/cli.js validate --json` passed after the dry-run with zero warnings
  and zero errors.
- `git diff --check` passed.
