---
id: task-716
type: task
title: Finalize package version lockfile changelog and release notes for v0.5.0
status: todo
priority: 1
epic: epic-232
next: task-717
tags: [release, version, changelog, package]
owners: []
links: []
artifacts: []
relates: [goal-64, test-388]
blocked_by: []
blocks: [task-717]
refs: [test-388]
context_refs: [goal-61, goal-63, goal-64, epic-232, edd-72, dec-69]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Own the exact `0.5.0` version bump and convert verified hardening and release
experience work into complete, source-backed release metadata.

# Acceptance Criteria

- Package and lockfile agree on `0.5.0`.
- `CHANGELOG.md` has a finalized 0.5.0 section; Unreleased contains only later work.
- Every publish-bound change maps to changelog/release notes or an explicit
  non-user-facing classification.
- Generated docs, website structured metadata, install/upgrade references, and
  dormant release data agree without activating promotion.

# Files Affected

List files/directories expected to change.

- `package.json`, `package-lock.json`, `CHANGELOG.md`
- Generated release/reference outputs and version-bearing site/docs data

# Implementation Notes

- Preserve the source-controlled release activation flag as dormant.
- Do not create a Git tag.

# Test Plan

Run the version/changelog drift scan in `test-388`, generated checks, and inspect
the full publish-bound diff.

# Links / Artifacts

- `edd-72`
- `dec-69`
