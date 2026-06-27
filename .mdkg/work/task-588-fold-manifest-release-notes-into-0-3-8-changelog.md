---
id: task-588
type: task
title: fold MANIFEST release notes into 0.3.8 changelog
status: todo
priority: 1
tags: [release, polish, changelog, manifest, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-39, goal-38, task-585]
context_refs: [goal-38, task-585, goal-37]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Move the MANIFEST/SPEC compatibility release note into the `0.3.8` changelog
section because the implementation commits are part of the current `0.3.8`
publish candidate.

# Acceptance Criteria

- The MANIFEST/SPEC bullet appears under `## 0.3.8 - 2026-06-25`, preferably
  in `### Changed`.
- `## Unreleased` no longer contains the MANIFEST/SPEC compatibility bullet.
- Historical `0.3.7` and older changelog entries remain unchanged.
- The changelog still follows the existing pragmatic Keep-a-Changelog style.

# Files Affected

- `CHANGELOG.md`

# Implementation Notes

- Do not create a new `0.3.9` section.
- Do not duplicate the bullet in both `Unreleased` and `0.3.8`.
- Preserve the current `0.3.8` date unless the user separately decides to
  revise release dating.

# Test Plan

- Manual top-of-file changelog inspection.
- `rg -n "## Unreleased|## 0\\.3\\.8|MANIFEST\\.md|SPEC\\.md" CHANGELOG.md`
- `git diff --check`

# Links / Artifacts

- `goal-38`
- `goal-37`
- `task-585`
