---
id: test-444
type: test
title: v0.5.1 release candidate version package and CI gates pass
status: progress
priority: 0
epic: epic-250
tags: [release, v0.5.1, ci]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-783]
blocks: [task-784]
refs: [goal-71, task-783]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Prove the exact approved release commit is internally consistent and green in CI.

# Target / Scope

Version/lock/changelog, package contents, local gates, approval, origin SHA, CI,
and no-tag state.

# Preconditions / Environment

Goal 70 achieved with clean checkpoint and local commit.

# Test Cases

- All version facts equal 0.5.1.
- Full release gates and package inspection pass.
- Approval predates push; exact pushed SHA has green CI; no tag exists.

# Results / Evidence

- Local package, lockfile, changelog, README, generated CLI/docs facts, and the
  shared public-release target consistently report `0.5.1`.
- `npm ci`, the complete `npm run prepublishOnly` ladder, both explicit Astro
  builds, changed-only and summary graph validation, and `git diff --check`
  pass on 2026-07-14.
- `npm pack --dry-run --json` and the exact registry-targeted
  `npm publish --dry-run` pass for a 190-file, 412.5 kB tarball with SHA-1
  `5601a5337c8e795a1c58397f0b807ed204f8be9a`.
- The public registry reports `latest` as `0.5.0` and returns `E404` for
  `mdkg@0.5.1`, proving the target version is not already published.
- Pending: explicit release approval, origin push, exact-SHA CI proof, and
  confirmation that no tag was created.

# Notes / Follow-ups

- Failure returns to local repair before npm publication.
