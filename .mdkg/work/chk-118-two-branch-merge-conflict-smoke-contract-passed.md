---
id: chk-118
type: checkpoint
title: Two branch merge conflict smoke contract passed
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-140]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [test-140]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`test-140` passed. The release gate now proves a packed mdkg install can detect
and plan repair for a two-branch duplicate-id merge state without mutating the
repo during validation or planning.

# Scope Covered

- `test-140`
- Packed install into a temp npm prefix.
- Fresh temp Git repo with branch A and branch B independently adding the same
  numeric local id.
- Merge into a duplicate-id tree, `validate --json`, and `fix plan --family ids
  --json`.

# Decisions Captured

- The smoke uses different filenames with the same id to avoid Git content
  conflict while still exercising the post-merge duplicate-id graph state.
- The smoke snapshots file hashes before validation/planning and asserts no
  mutation after both commands.

# Implementation Summary

- Added `scripts/smoke-branch-conflicts.js`.
- Added `npm run smoke:branch-conflicts`.
- Added the smoke to `prepublishOnly` immediately after `smoke:fix-plan`.
- Added publish-readiness assertions for the new smoke gate.

# Verification / Testing

- `npm run smoke:branch-conflicts`
- `npm run prepublishOnly`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Known Issues / Follow-ups

- No real publish/tag/push was performed.

# Links / Artifacts

- `scripts/smoke-branch-conflicts.js`
- `package.json`
- `scripts/assert-publish-ready.js`
