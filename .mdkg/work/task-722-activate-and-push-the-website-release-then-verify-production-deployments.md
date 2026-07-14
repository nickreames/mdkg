---
id: task-722
type: task
title: Activate and push the website release then verify production deployments
status: done
priority: 1
epic: epic-235
prev: task-721
next: task-723
tags: [release, activation, deploy, vercel]
owners: []
links: []
artifacts: []
relates: [goal-64, test-393]
blocked_by: []
blocks: [task-723]
refs: [test-393]
context_refs: [goal-62, goal-63, goal-64, epic-235, edd-72, dec-69, dec-81, task-721, chk-496, chk-513, chk-514, chk-515]
evidence_refs: [chk-496, chk-513, chk-514, chk-515, chk-516]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-13
---
# Overview

Finish the website activation lane from the current published source state,
repair its stale release-state CI assertion, and verify both production
deployments against the final exact commit.

# Acceptance Criteria

- Preserve the accepted dormant npm publication proof in `chk-513` and the
  activation commit `b337ff8d69664908ddf0690a7878cba0ec145a6d` on `origin/main`.
- Review the existing `tests/public-release.test.mjs` published-state fix and
  pass the complete release CI gate locally.
- Commit and push the CI repair as a fix-forward change, then require green CI
  for that exact origin SHA.
- Verify both Vercel projects deploy the final expected commit.
- Confirm the custom domains serve the activated release and correct displayed
  version.

# Files Affected

List files/directories expected to change.

- Existing published release activation data
- `tests/public-release.test.mjs`
- Origin and mdkg.dev/docs.mdkg.dev production deployments

# Implementation Notes

- No npm republish or Git tag accompanies site activation.
- Failed deployment is fixed forward from the published package state.
- `chk-496` and `dec-69` already authorize the bounded fix-forward release
  sequence; do not request a new approval for this CI repair.
- Do not run another Codex Security scan. Consume `dec-81` and `chk-512` as the
  accepted v0.5.0 security gate.
- Preserve unrelated worktree changes and inspect the existing release-test diff
  before modifying it.

# Test Plan

Run `test-393` with before/after activation, commit, deployment-currentness, and
domain receipts.

# Current State

Done. Repair commit `b265da717ee5365bd83362db6b83150cb603da5c` is on
`origin/main`; GitHub Actions run `29258600632` passed both supported Node lanes;
and Vercel deployments `5426067587` and `5426071286` succeeded for the exact
repair SHA. `chk-516` records the complete activation receipt. Continue with
the unblocked live production audit in `task-723`.

# Links / Artifacts

- `dec-69`
- `dec-81`
- `chk-496`
- `chk-513`
- `chk-514`
- `chk-515`
- `chk-516`
- `goal-42`
