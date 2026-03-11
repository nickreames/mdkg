---
id: task-85
type: task
title: normalize release line to 0.0.4 and correct current version truth
status: done
priority: 1
epic: epic-12
tags: [0_0_4, release, docs]
owners: []
links: []
artifacts: [package.json, package-lock.json, README.md, CLI_COMMAND_MATRIX.md, .mdkg/design/dec-14-0-0-4-release-line-and-repo-boundary-normalization.md, .mdkg/work/chk-3-0-0-4-release-cut-prep-and-readiness-audit.md]
relates: [dec-14, epic-12]
blocked_by: []
blocks: [test-44]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Normalize the repo to the real `0.0.3` -> `0.0.4` release line and remove near-term version drift.

# Acceptance Criteria

- package metadata reflects current truth
- near-term local docs no longer claim mixed prepublish versions

# Files Affected

- `package.json`
- `README.md`
- `CLI_COMMAND_MATRIX.md`

# Implementation Notes

- final version bump to `0.0.4` is completed as part of cut prep; publish remains deferred

# Test Plan

- `test-44`
- `mdkg validate`

# Links / Artifacts

- `dec-14`
