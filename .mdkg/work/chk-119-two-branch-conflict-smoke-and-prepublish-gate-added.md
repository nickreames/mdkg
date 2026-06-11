---
id: chk-119
type: checkpoint
title: Two branch conflict smoke and prepublish gate added
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-344]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-344]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`task-344` added the packed/temp two-branch branch-conflict smoke and wired it
into the publish gate.

# Scope Covered

- `task-344`
- Packed temp install proof.
- Duplicate-id merge validation proof.
- Stable read-only fix plan proof.
- Prepublish gate integration.

# Decisions Captured

- Keep the smoke local-only with no remote repository or network requirement
  beyond local npm pack/install behavior.
- Use the installed packed binary only inside the temp repo.
- Treat `validate` and `fix plan` as read-only in the smoke by comparing file
  hash snapshots.

# Implementation Summary

- `scripts/smoke-branch-conflicts.js` creates a temp Git repo, commits a base
  mdkg init, creates two branches, merges duplicate local ids, validates the
  duplicate diagnostic, runs `fix plan --family ids --json` twice, compares plan
  hash/id stability, and asserts no file mutation.
- `package.json` now exposes `smoke:branch-conflicts` and includes it in
  `prepublishOnly`.
- `scripts/assert-publish-ready.js` now requires the smoke script and ordering.

# Verification / Testing

- `npm run smoke:branch-conflicts`
- `npm run prepublishOnly`
- Full prepublish completed with 450 unit tests, CLI parity, graph validation,
  all existing smokes, the new branch-conflict smoke, and publish-readiness
  assertions.

# Known Issues / Follow-ups

- No real publish/tag/push was performed.
- Remaining `goal-13` work moves to generated CLI command contracts and
  mdkg.dev readiness planning.

# Links / Artifacts

- `scripts/smoke-branch-conflicts.js`
- `package.json`
- `scripts/assert-publish-ready.js`
