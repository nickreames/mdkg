---
id: task-31
type: task
title: add packaged consumer smoke validation for publish
status: done
priority: 2
epic: epic-3
tags: [release, smoke, consumer]
owners: []
links: []
artifacts: []
relates: [task-29, task-30, task-32]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-07
updated: 2026-02-08
---
# Overview

Add a publish-gate smoke workflow that validates the packaged tarball as a real consumer would use it, including install, init, index, and diagnostics.

# Acceptance Criteria

- `npm run smoke:consumer` exists and passes locally.
- Smoke flow validates tarball install using `npx --package <tarball>`.
- Smoke flow verifies `mdkg --version`, `mdkg pack --list-profiles`, `mdkg init`, `mdkg index`, and `mdkg doctor --json`.
- Temporary tarball/temp repo are cleaned up after execution.

# Files Affected

- `scripts/smoke-consumer.js`
- `package.json`
- `README.md`

# Implementation Notes

- Script creates tarball via `npm pack --silent`, launches isolated temp git repo, then executes CLI through `npx`.
- Script validates onboarding artifacts (`.mdkg/config.json`, `.mdkg/README.md`, `AGENTS.md`, `CLAUDE.md`).
- Added npm script `smoke:consumer` to run build + packaged smoke sequence.

# Test Plan

- Run: `npm run smoke:consumer`
- Confirm expected output includes `consumer smoke passed` and a tarball name.

# Links / Artifacts

- `scripts/smoke-consumer.js`
- `package.json`
- `README.md`
