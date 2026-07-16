---
id: task-756
type: task
title: publish mdkg v0.5.2 and verify registry artifact integrity
status: progress
priority: 1
parent: goal-67
prev: task-755
next: task-789
tags: [goal-67, publish, registry, integrity, 0.5.2]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [task-755]
blocks: [task-789]
refs: [goal-67, goal-66]
context_refs: [goal-66]
evidence_refs: []
aliases: [materialize-release-publish]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Publish only the approved `mdkg@0.5.2` package from the exact sealed local
release commit, then verify immutable npm registry and tarball evidence before
any Git push or local installation replacement.

# Acceptance Criteria

- Recheck candidate commit/tree, clean worktree, npm auth, registry absence, and
  dry-run artifact identity immediately before the real command.
- Publish with isolated cache and the verified temporary npmrc; never expose the
  token or modify the operator npm configuration.
- Verify npm latest/dist-tags equal `0.5.2` and record version, publication time,
  shasum, integrity, unpacked size, file count, and tarball file inventory.
- Download/inspect the registry tarball and prove it matches the expected
  package contract and contains the materialization implementation/docs.
- Do not push, install globally, apply root upgrades, deploy directly, or tag.
- After success, all failures are fix-forward; never unpublish or rewrite the
  published commit.

# Test Plan

- Registry and sealed-artifact portion of `test-418`

# Completion Evidence

- Attach npm publication and immutable artifact receipt.

# Files Affected

- Approved npm registry state and bounded release evidence only.

# Implementation Notes

- Use the verified temporary npmrc and isolated cache. After success, preserve
  the published commit and fix forward.

# Links / Artifacts

- `task-789`, `test-418`, and registry tarball metadata.
