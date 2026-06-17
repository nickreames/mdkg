---
id: task-385
type: task
title: close 0.3.4 RC evidence and checkpoint
status: done
priority: 2
epic: epic-91
parent: goal-17
tags: [0.3.4, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-384, test-162, test-163, test-164]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Close 0.3.4 release-candidate evidence without publishing.

# Acceptance Criteria

- All 0.3.4 scoped nodes are complete.
- Dry-run publish reports 0.3.4 candidate.

# Files Affected

- .mdkg/work/goal-17*.md
- .mdkg/work/task-385*.md

# Implementation Notes

- Record repair receipts and gate output.

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

`mdkg task done task-385 --checkpoint "0.3.4 branch-safe ID repair readiness"`

# Links / Artifacts

- `chk-152`: 0.3.4 branch-safe ID repair readiness checkpoint.
- `npm run build`: passed.
- `npm run test`: passed with 478 tests.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed.
- `node dist/cli.js validate --json`: passed with zero warnings and zero errors.
- `npm run smoke:id-repair`: passed from a packed temp install.
- `npm run prepublishOnly`: passed.
- `node scripts/assert-publish-ready.js`: passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`: passed and reported `mdkg@0.3.4`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`: passed and reported `+ mdkg@0.3.4`.
- `git diff --check`: passed.
