---
id: task-391
type: task
title: close 0.3.5 RC evidence and checkpoint
status: done
priority: 2
epic: epic-94
parent: goal-18
tags: [0.3.5, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-390, test-165, test-166, test-167]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Close 0.3.5 graph clone/import release-candidate evidence.

# Acceptance Criteria

- All 0.3.5 scoped nodes are complete.
- Dry-run release gates pass.

# Files Affected

- .mdkg/work/goal-18*.md
- .mdkg/work/task-391*.md

# Implementation Notes

- Record clone/import receipts and smokes.

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

`mdkg task done task-391 --checkpoint "0.3.5 graph clone template import readiness"`

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.

# Evidence

0.3.5 release-candidate metadata:

- `package.json`, `package-lock.json`, README source-version text, `CLI_COMMAND_MATRIX.md`, and `CHANGELOG.md` now describe `mdkg@0.3.5`.
- `CHANGELOG.md` includes `## 0.3.5 - 2026-06-17` with graph clone/fork/import-template additions, docs/gate updates, and safety notes.
- `dist/command-contract.json` was regenerated with contract hash `2fd862666a24adc363a0912822b639f7e437bf5fd31dea13e6f4d87bf0a57d60`.

Release gates passed:

- `npm run build`
- `npm run test` (`482` tests passed)
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json` (zero warnings, zero errors)
- `npm run smoke:graph-clone`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

Package dry-run evidence:

- Dry-run pack id: `mdkg@0.3.5`
- Dry-run tarball: `mdkg-0.3.5.tgz`
- Dry-run package size: `296.9 kB`
- Dry-run unpacked size: `1.6 MB`
- Dry-run shasum: `a8c23d41988f030d377b81231281b658281cf20e`
- Dry-run total files: `160`
- Dry-run publish completed with `+ mdkg@0.3.5`.

Smoke hardening during RC:

- Initial `npm publish --dry-run` exposed that `scripts/smoke-graph-clone.js` inherited npm's dry-run environment and used an incompletely prepared temp global prefix.
- The smoke now uses an isolated npm cache, explicitly sets `NPM_CONFIG_DRY_RUN=false` / `npm_config_dry_run=false` for nested `npm pack` and `npm install`, uses `/private/tmp` when available, and precreates `bin` plus `lib/node_modules` under the temp prefix.
- `NPM_CONFIG_DRY_RUN=true npm run smoke:graph-clone` passed before the final dry-run publish rerun.

# Closeout

The 0.3.5 release candidate is dry-run publish ready. No real npm publish, tag, push, global install, website deploy, or downstream repo mutation was performed.
