---
id: task-344
type: task
title: add two branch conflict smoke and prepublish gate
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [branches, smoke, prepublish, 0-3-7]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-140]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Add the release-gating temp-repo proof that mdkg can detect and plan repair for
branch-created id conflicts without mutating the repo during planning.

# Acceptance Criteria

- Smoke creates a temp Git repo with two branches that independently create the
  same numeric id.
- After merge/conflict resolution into a duplicate-id tree, `validate --json`
  reports duplicates.
- `fix plan --family ids --json` emits a stable read-only repair plan.
- Before/after file hashes prove no mutation during planning.
- Smoke is added to `package.json`, `prepublishOnly`, and publish-readiness
  assertions only after stable.

# Files Affected

- `scripts/smoke-branch-conflicts.js`
- `package.json`
- `scripts/assert-publish-ready.js`
- release docs/changelog as needed

# Implementation Notes

- Keep the smoke packed/temp-repo oriented.
- The smoke should not require a remote repository or network access.
- Commit/tag/push remain out of scope.

# Test Plan

- `test-140`
- `npm run smoke:branch-conflicts`
- `npm run prepublishOnly`

# Links / Artifacts

- `edd-21`
- `test-140`
