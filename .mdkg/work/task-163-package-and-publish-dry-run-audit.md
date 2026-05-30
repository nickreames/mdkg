---
id: task-163
type: task
title: package and publish dry run audit
status: done
priority: 1
epic: epic-28
tags: [release, audit, package, npm, dry-run]
owners: []
links: [npm:mdkg]
artifacts: [package.json, scripts/assert-publish-ready.js, scripts/postinstall.js]
relates: [epic-28, task-157, task-158, task-159, task-160, task-161, task-162]
blocked_by: [task-157, task-158, task-159, task-160, task-161, task-162]
blocks: [task-164]
refs: [rule-5]
aliases: [publish-dry-run-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Run the final package and publish dry-run audit once the feature-specific audit
tasks are complete.

# Acceptance Criteria

- Full prepublish gate passes.
- `npm pack --dry-run --json` succeeds.
- Package contents include `dist/cli.js`, compiled command/core/graph/pack/
  template/util files, `dist/init/`, `CHANGELOG.md`, `CONTRIBUTING.md`, and
  `scripts/postinstall.js`.
- Package contents exclude temp audit files and generated local workspaces.
- `npm publish --dry-run` succeeds and does not publish.
- `git diff --check` passes.

# Files Affected

Read-only audit targets:
- `package.json`
- `package-lock.json`
- `scripts/assert-publish-ready.js`
- `scripts/postinstall.js`
- npm pack dry-run output

# Implementation Notes

Use `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for npm commands to avoid
local cache permission noise. Do not run real `npm publish` in this task.

# Test Plan

- Run `npm run test`.
- Run `npm run cli:check`.
- Run `node dist/cli.js validate`.
- Run all package smoke scripts.
- Run `node scripts/assert-publish-ready.js`.
- Run `npm pack --dry-run --json`.
- Run `npm publish --dry-run`.
- Run `git diff --check`.

# Links / Artifacts

- `epic-28`
- `task-164`

# Audit Evidence

Passed gates:
- `npm run test` passed with 361 tests.
- `npm run cli:check` passed with `cli command matrix check: ok`.
- `node dist/cli.js validate` passed with `validation ok`.
- `npm run smoke:consumer` passed with packaged `mdkg@0.1.2`.
- `npm run smoke:matrix` passed with packaged `mdkg@0.1.2`.
- `npm run smoke:upgrade` passed with packaged `mdkg@0.1.2`.
- `npm run smoke:init` passed with packaged `mdkg@0.1.2`.
- `npm run smoke:capabilities` passed.
- `npm run smoke:archive-work` passed with packaged `mdkg@0.1.2`.
- `npm run smoke:bundle` passed with packaged `mdkg@0.1.2`.
- `npm run smoke:bundle-import` passed with packaged `mdkg@0.1.2`.
- `npm run smoke:visibility` passed with packaged `mdkg@0.1.2`.
- `node scripts/assert-publish-ready.js` passed with `publish readiness ok`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed
  and ended with `+ mdkg@0.1.2`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm whoami --registry=https://registry.npmjs.org/` returned `nickreames` after network approval.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm view mdkg version --registry=https://registry.npmjs.org/` returned `0.1.1` after network approval.

Package contents from dry-run:
- `dist/cli.js`
- compiled `dist/commands/`
- compiled `dist/core/`
- compiled `dist/graph/`
- compiled `dist/init/`
- compiled `dist/pack/`
- compiled `dist/templates/`
- compiled `dist/util/`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `README.md`
- `LICENSE`
- `scripts/postinstall.js`
- `package.json`

The dry-run tarball reported 127 files, package size about 159.5 kB, and
unpacked size about 752.2 kB. The package file list does not include `.mdkg`
audit graph files, temp workspace files, local pack outputs, or local indexes.

# Environment Note

Plain `npm pack --dry-run --json` failed once because the local `~/.npm` cache
contains root-owned files. This is an environment issue, not a package issue.
The standardized clean-cache command using `/private/tmp/mdkg-npm-cache`
passed and is the recommended publish path for this machine.

# Result

Package and publish dry-run audit is release-ready for `mdkg@0.1.2`. Real
publish remains intentionally blocked on separate explicit approval.
