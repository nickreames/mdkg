---
id: task-302
type: task
title: run full prepublish ladder npm pack dry-run and npm publish dry-run
status: done
priority: 1
epic: epic-62
parent: goal-9
prev: task-301
next: task-303
tags: [prepublish, npm, dry-run, release]
owners: []
links: []
artifacts: [checks://git-diff-check]
relates: [goal-9, epic-62, test-118]
blocked_by: [task-301]
blocks: [task-303, test-118]
refs: [dec-28]
aliases: [0-3-0-prepublish-ladder]
skills: [verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Run the full local release proof without publishing.

# Acceptance Criteria

- `npm run prepublishOnly` passes.
- `npm pack --dry-run --json` passes and receipt is recorded.
- `npm publish --dry-run` passes and receipt is recorded.
- Actual npm publish is not run.

# Files Affected

- Release evidence only.

# Implementation Notes

- Use dry-run commands only; do not publish.

# Test Plan

- `npm run prepublishOnly`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Evidence

- `npm run prepublishOnly` exited 0. A clean logged rerun was captured at
  `/private/tmp/mdkg-prepublish-0.3.0.log` with 970 lines; the tail includes
  `smoke:goal ok` and `publish readiness ok`.
- `npm pack --dry-run --json` exited 0 with
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`. Receipt log:
  `/private/tmp/mdkg-pack-dry-run-0.3.0.log`.
  - package id: `mdkg@0.3.0`
  - filename: `mdkg-0.3.0.tgz`
  - entry count: `154`
  - prepack also ran `publish readiness ok`.
- `npm publish --dry-run` exited 0 with
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`. Receipt log:
  `/private/tmp/mdkg-publish-dry-run-0.3.0.log`.
  - tarball filename: `mdkg-0.3.0.tgz`
  - package size: `238.1 kB`
  - total files: `154`
  - npm reported publishing to the npm registry with tag `latest` as
    `(dry-run)` and ended with `+ mdkg@0.3.0`.
- Actual npm publish was not run.

# Links / Artifacts

- `test-118`
