---
id: task-636
type: task
title: plan warning output strict doctor and release validation gates
status: todo
priority: 1
tags: [goal-48, warnings, doctor, release-gates]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Plan warning output, strict-doctor behavior, and package/release validation
gates for any accepted generic contract-profile release.

This task also owns closeout-evidence requirements for the later execution
goal.

# Acceptance Criteria

- Warning output is planned for profile-specific fields, raw-content markers,
  deprecated aliases, missing refs, invalid hashes, and unknown profile values.
- Strict doctor guidance says which warnings remain non-fatal and which become
  strict errors.
- Package/release validation plan includes build, unit tests, CLI checks,
  workflow validation, scaffold/upgrade smoke, docs/reference checks, npm pack
  dry-run, package payload review, registry-currentness check, and post-release
  verification if publish is later authorized.
- Closeout evidence plan includes exact changed files, command receipts, local
  commit SHA, remaining dirty state, and explicit no-push status.
- No npm publish, version bump, tag, push, or package metadata mutation occurs
  under this planning goal.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future release execution may touch source/tests/docs/package surfaces only
  under a separate explicit execution goal.

# Implementation Notes

- Keep `mdkg validate --changed-only --json` and
  `mdkg validate --summary --limit 20 --json` in the local closeout lane.
- Include `git diff --check` and `git diff --cached --name-status` before a
  local commit.
- Resolve the package version from live package/registry state during the later
  release execution pass.

# Test Plan

- `test-330`
- `test-331`
- `test-332`

# Links / Artifacts

- `goal-48`
