---
id: task-753
type: task
title: finalize mdkg v0.5.2 materialization release metadata and local commit
status: done
priority: 1
parent: goal-67
next: task-754
tags: [goal-67, version, release-metadata, 0.5.2, docs]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [goal-66]
blocks: [task-754]
refs: [goal-67, goal-66]
context_refs: [edd-73, dec-75, dec-76, dec-77, dec-78]
evidence_refs: []
aliases: [materialize-release-version]
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Consume the achieved Goal-66 readiness checkpoint, finalize all source-visible
`0.5.2` metadata and docs release surfaces, and create the exact local `main`
commit that will later be published before it is pushed.

# Acceptance Criteria

- Confirm Goal-66 achieved, its readiness recommendation is affirmative, and
  its implementation commit/range is clean and complete.
- Confirm npm latest is still `0.5.1` and `mdkg@0.5.2` remains absent.
- Change `package.json`, lockfile root/version metadata, README, command matrix,
  generated command/reference data, and shared release manifest to `0.5.2`.
- Move only the accepted materialization bullets from `Unreleased` into
  `## 0.5.2 - <execution-date>` and regenerate release notes.
- Add/update the `0.5.2` docs.mdkg.dev changelog card/detail and preserve the
  materialization guide created by Goal-66.
- Set the shared release manifest to published `0.5.2` locally so all package,
  docs, SEO, and release assertions agree before publication.
- Make no authored `mdkg-dev` source or copy changes.
- Create one local release commit on `main`; do not push or publish in this task.

# Test Plan

- `test-416`
- `test-417`
- generated release-notes and docs checks

# Completion Evidence

- Record the exact release commit and metadata diff inventory.

# Files Affected

- Package and lock metadata, changelog, generated release/command references,
  docs changelog sources, README/command version markers, and release manifest.

# Implementation Notes

- Work on local `main`; do not push until npm publication and installed-package
  validation succeed.

# Links / Artifacts

- Goal-66 readiness checkpoint and the local `0.5.2` release commit.
