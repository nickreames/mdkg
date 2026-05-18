---
id: test-84
type: test
title: visibility enforcement unit cli and smoke coverage
status: done
priority: 1
epic: epic-27
tags: [visibility, tests, smoke, package]
owners: []
links: []
artifacts: [tests/graph/visibility.test.ts, scripts/smoke-visibility.js, npm publish --dry-run]
relates: [task-144, task-145, task-146, task-147]
blocked_by: []
blocks: [chk-25]
refs: []
aliases: [visibility-smoke-coverage]
skills: []
created: 2026-05-18
updated: 2026-05-18
---
# Overview

Add focused unit, CLI, and packed-package temp-repo smoke coverage for public,
internal, and private visibility enforcement.

# Acceptance Criteria

- Effective visibility, pack filtering, archive flags, bundle fail-closed
  checks, import config rejection, validate, and doctor diagnostics have test
  coverage.
- `npm run smoke:visibility` installs the packed package into an isolated npm
  prefix and proves public-safe behavior in fresh root and child repos.
- Full release gate includes the visibility smoke.

# Files Affected

- `tests/**`
- `scripts/smoke-visibility.js`
- `package.json`

# Implementation Notes

The smoke should prove both failure and success paths: private archive/import
refs fail public packs; public archive/import refs allow public packs.

# Results

Added unit and CLI coverage for effective visibility, pack filtering, archive
flags, bundle fail-closed checks, import config rejection, validate diagnostics,
and doctor diagnostics. Added `npm run smoke:visibility` and included it in the
prepublish gate.

# Test Plan

- `npm run test`
- `npm run smoke:visibility`
- Full prepublish dry-run gate before release approval.

# Verification

- `npm run test`
- `npm run smoke:visibility`
- `npm publish --dry-run`

# Links / Artifacts

- `npm run smoke:visibility`
