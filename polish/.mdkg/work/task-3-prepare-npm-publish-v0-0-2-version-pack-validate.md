---
id: task-3
type: task
title: prepare npm publish v0.0.2 (version, pack, validate)
status: done
priority: 1
epic: epic-1
tags: [npm, release]
owners: []
links: []
artifacts: [npm-pack-dry-run, v0-0-2]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-22
---
# Overview

Prepare the repo for npm publish v0.0.2 (version bump + package audit).

# Acceptance Criteria

- `package.json` version bumped to 0.0.2 (and lockfile updated).
- `mdkg index`, `mdkg validate`, and `mdkg pack` succeed.
- `npm pack --dry-run` shows only whitelisted files.
- `npm run test` passes.
- Publish step is ready but not executed.

# Files Affected

- package.json
- package-lock.json
- .mdkg/index/global.json
- .mdkg/pack/*

# Implementation Notes

- Follow rule-5 release checklist through dry-run pack.

# Test Plan

- `npm run test`
- `mdkg validate`
- `mdkg pack polish:task-3 --verbose --out .mdkg/pack/polish-task-3.md`
- `npm pack --dry-run`

# Notes

- 2026-01-22: ran `mdkg index`, `mdkg validate`, `mdkg pack`, `npm pack --dry-run`, and `npm run test` successfully.

# Links / Artifacts

- npm-pack-dry-run
- v0-0-2
