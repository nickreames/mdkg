---
id: task-301
type: task
title: bump package metadata to 0.3.0 and update changelog release notes
status: done
priority: 1
epic: epic-62
parent: goal-9
prev: task-300
next: task-302
tags: [release, version, changelog]
owners: []
links: []
artifacts: [package.json, package-lock.json, CHANGELOG.md, checks://git-diff-check]
relates: [goal-9, epic-62]
blocked_by: [task-300]
blocks: [task-302]
refs: [dec-28]
aliases: [bump-mdkg-0-3-0]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Update package and release metadata after implementation and audit gates are
green.

# Acceptance Criteria

- Package metadata reports `0.3.0`.
- Changelog summarizes SPEC indexing, work trigger, receipt verification, queue bridge, docs, and compatibility boundaries.
- No publish command is run.

# Files Affected

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`

# Implementation Notes

- Run this after implementation and audit gates, not before.

# Test Plan

- `node -e "console.log(require('./package.json').version)"`
- `npm run test`
- `git diff --check`

# Evidence

- `package.json`, `package-lock.json`, and package-lock root package metadata
  now report `0.3.0`.
- `CHANGELOG.md` now has `0.3.0 - Unreleased` release notes covering optional
  SPEC validation/indexing, `mdkg spec`, dogfood CLI SPEC/WORK, work trigger,
  order status, receipt verification, queue bridge delivery, capability
  linkage, docs/templates/init/upgrade compatibility, and the no-secret audit.
- Prior queue CLI release section is recorded as `0.2.0 - 2026-06-06`.
- No `npm publish`, git tag, or push command was run for this task.
- Verification passed: package version check, `node dist/cli.js --version`,
  `npm run test` (425 tests), `npm run cli:check`,
  `node dist/cli.js validate --json`, and `git diff --check`.

# Links / Artifacts

- `test-118`
