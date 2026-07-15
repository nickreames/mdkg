---
id: task-755
type: task
title: verify pre-approved v0.5.2 auth registry and origin readiness boundary
status: todo
priority: 1
parent: goal-67
next: task-756
tags: [goal-67, approval, auth, origin, registry, 0.5.2]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [test-416, test-417]
blocks: [task-756]
refs: [goal-67]
context_refs: [dec-69, goal-66]
evidence_refs: []
aliases: [materialize-release-approval]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Verify the already-recorded bounded release approval and recheck npm auth,
registry absence, Git remote freshness, candidate identity, and no-tag/no-force
boundaries immediately before publication.

# Acceptance Criteria

- Read back the goal approval covering npm publication, isolated/global
  installation, safe real-root upgrade apply, direct non-force post-publish
  `origin/main` pushes, and resulting Vercel deployment verification.
- No second approval prompt is required for those actions after all gates pass.
- Create a temporary npmrc containing the literal `${NPM_TOKEN}` reference;
  `npm whoami` succeeds without printing or persisting the token.
- Fetch `origin/main`; require zero remote-only commits and record local release
  commit, tree, and ahead count. Any drift stops publication and invalidates the
  prior dry-run receipt.
- Recheck npm latest `0.5.1`, `0.5.2` absence, candidate package identity, and
  publish user permissions immediately before use.
- Confirm no Git tag, PR, force push, Browser/Chrome action, unpublish, rollback,
  or unrelated provider mutation is authorized.

# Test Plan

- `test-416`
- `test-417`

# Completion Evidence

- Attach redacted approval/auth/registry/origin preflight receipt.

# Files Affected

- Approval and preflight evidence nodes plus a temporary uncommitted npmrc.

# Implementation Notes

- Never print token values or persist the temporary npmrc in the repository.

# Links / Artifacts

- `test-416`, `test-417`, and the exact local release commit.
