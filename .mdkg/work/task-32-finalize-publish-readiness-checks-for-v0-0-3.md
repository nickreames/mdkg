---
id: task-32
type: task
title: finalize publish readiness checks for v0.0.3
status: done
priority: 1
epic: epic-3
tags: [release, publish, validation]
owners: []
links: []
artifacts: []
relates: [task-29, task-30, task-31]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-07
updated: 2026-02-08
---
# Overview

Capture final release-readiness validation for `0.0.3` before publish: full automated tests, command smoke checks, and packaged-consumer smoke.

# Acceptance Criteria

- Full test suite passes with updated pack/profile/docs behavior.
- Consumer smoke workflow passes from packaged tarball.
- No publish command is run until explicit approval.
- Release notes/readme include concise pack discovery and diagnostics workflow updates.

# Files Affected

- `README.md`
- `tests/commands/cli.test.ts`
- `tests/util/argparse.test.ts`
- `tests/pack/profile.test.ts`
- `.mdkg/work/task-30-capture-pack-profile-discovery-and-concise-quickstart-updates.md`
- `.mdkg/work/task-31-add-packaged-consumer-smoke-validation-for-publish.md`
- `.mdkg/work/task-32-finalize-publish-readiness-checks-for-v0-0-3.md`

# Implementation Notes

- Verified `npm run test` after feature additions (all tests passing).
- Verified packaged install flow with `npm run smoke:consumer`.
- Verified discoverability command and help text:
  - `node dist/cli.js pack --list-profiles`
  - `node dist/cli.js help pack`

# Test Plan

- Run: `npm run test`
- Run: `npm run smoke:consumer`
- Run: `node dist/cli.js --help`
- Run: `node dist/cli.js pack --list-profiles`

# Links / Artifacts

- `npm run test` output
- `npm run smoke:consumer` output
- release target: `0.0.3`
