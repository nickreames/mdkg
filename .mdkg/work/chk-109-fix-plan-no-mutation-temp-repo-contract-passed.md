---
id: chk-109
type: checkpoint
title: fix plan no mutation temp repo contract passed
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-136]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [test-136]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`test-136` passed. The packed temp-repo smoke proves `mdkg fix plan --json`
can inspect damaged generated cache, missing graph refs, and duplicate ids
without mutating repo files.

# Scope Covered

- `test-136`
- `task-339`
- `scripts/smoke-fix-plan.js`

# Decisions Captured

- Keep `fix plan` read-only and receipt-shaped.
- Keep `fix apply` unavailable until a separate apply design is approved.
- Use temp-repo hash snapshots as the no-mutation proof.

# Implementation Summary

- Added a packed temp-repo smoke that installs mdkg into a temp prefix and uses
  the installed CLI against `/private/tmp/mdkg-fix-plan.XXXXXX/repo`.
- The smoke asserts docs/help coverage, removes generated cache, creates stale
  generated-cache state, creates a missing-reference fixture, creates a
  duplicate-id fixture, and verifies all `fix plan` runs leave repo file hashes
  unchanged.
- The smoke covers `generated_cache_missing`, `generated_cache_stale`,
  `graph_ref_missing`, and `duplicate_id` repair-family reasons.

# Verification / Testing

- `npm run smoke:fix-plan`
  - passed with temp root `/private/tmp/mdkg-fix-plan.j7VQjS`
  - packed tarball `/private/tmp/mdkg-fix-plan.j7VQjS/pack/mdkg-0.3.0.tgz`
- `npm run prepublishOnly`
  - passed; included `smoke:fix-plan` with temp root
    `/private/tmp/mdkg-fix-plan.4U9DIF`
  - completed through `smoke:goal` and `scripts/assert-publish-ready.js`
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `git diff --check`

# Known Issues / Follow-ups

- Future apply behavior remains intentionally deferred.
- The current version remains `0.3.0`; this pass prepared the hardening train
  without publishing a new package.

# Links / Artifacts

- `scripts/smoke-fix-plan.js`
- `README.md`
- `assets/init/README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
