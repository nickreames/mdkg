---
id: task-379
type: task
title: close 0.3.3 RC evidence and checkpoint
status: done
priority: 1
epic: epic-88
parent: goal-16
tags: [0.3.3, closeout, rc]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-378]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Collect release-candidate evidence for 0.3.3 and close `goal-16` without publishing.

# Acceptance Criteria

- All scoped tasks and tests are done.
- Required checks pass through dry-run pack and dry-run publish.
- No real publish, tag, push, deploy, or child repo mutation occurred.

# Files Affected

- .mdkg/work/goal-16*.md
- .mdkg/work/task-379*.md

# Implementation Notes

- Record exact gate outputs in the closeout node.
- Use checkpoint title required by goal-16.

# Test Plan

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Checkpoint Requirement

`mdkg task done task-379 --checkpoint "0.3.3 goal lifecycle and archived roadmap readiness"`

# Links / Artifacts

- 2026-06-16 RC metadata:
  - Bumped `package.json` and `package-lock.json` from `0.3.2` to `0.3.3`.
  - Added `CHANGELOG.md` section `0.3.3 - 2026-06-16` covering `goal activate`, archived goals, single-active root validation, and the packed goal-lifecycle smoke.
- Required check evidence:
  - `npm run build` passed for `mdkg@0.3.3`; command contract hash `be42c29b89c1c3e3d059a8f9cbc564908d4dd694d848cf3d1b1800e8b30705e5`.
  - `npm run test` passed: 475 tests, 0 failures.
  - `npm run cli:check` passed.
  - `npm run cli:contract` passed with hash `be42c29b89c1c3e3d059a8f9cbc564908d4dd694d848cf3d1b1800e8b30705e5`.
  - `node dist/cli.js validate --json` passed with 0 warnings/errors.
  - `npm run prepublishOnly` passed end to end, including `smoke:goal-lifecycle`.
  - `node scripts/assert-publish-ready.js` passed.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json` passed and reported `mdkg@0.3.3`, filename `mdkg-0.3.3.tgz`, shasum `756397498e9247660b32fe9b2028df162995bb54`, unpacked size `1507598`, and 159 package files.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed and reported `+ mdkg@0.3.3`.
  - `git diff --check` passed.
- Release boundary:
  - No real `npm publish` was run.
  - No git tag, push, deploy, or child repo mutation was performed.
