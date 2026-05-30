---
id: task-196
type: task
title: release metadata and changelog reconciliation
status: done
priority: 1
epic: epic-35
tags: [release, changelog, docs, metadata]
owners: []
links: []
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, package.json, npm view mdkg@0.1.3 time]
relates: [epic-35, task-194]
blocked_by: [task-194]
blocks: [task-198, task-200, task-202]
refs: [rule-5]
aliases: [release-metadata-reconciliation]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Reconcile release metadata after the `0.1.3` publish so docs, changelog, package
metadata, and graph records agree.

# Acceptance Criteria

- Resolve stale `0.1.3 - Unreleased` wording if it remains after baseline audit.
- Verify `README.md`, `CLI_COMMAND_MATRIX.md`, and package metadata describe the
  currently published command surface.
- Decide whether a docs-only patch release is required or whether cleanup can be
  committed without npm publication.
- Record exact metadata gaps and recommended fixes before source edits happen.

# Files Affected

- `CHANGELOG.md`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `package.json`
- `.mdkg/work/task-196-release-metadata-and-changelog-reconciliation.md`

# Implementation Notes

Do not change source behavior in this task unless metadata evidence reveals a
release-blocking inconsistency that cannot be corrected as docs/graph hygiene.

# Test Plan

- `npm view mdkg version dist-tags --registry=https://registry.npmjs.org/`
- `npm run cli:check`
- `node dist/cli.js validate`
- `git diff --check`

# Audit Evidence

- `CHANGELOG.md` previously stated `## 0.1.3 - Unreleased`.
- Registry metadata confirms `0.1.3` was published on
  `2026-05-20T22:31:32.159Z`.
- Updated changelog heading to `## 0.1.3 - 2026-05-20`.
- `README.md`, `CLI_COMMAND_MATRIX.md`, and seeded docs already describe the
  pre-v1 alpha posture, SQLite cache, smoke scripts, and current command
  surfaces.

# Decision

The only release metadata fix required by this audit was the changelog date.
No source behavior change was needed.

# Links / Artifacts

- `task-194`
- `task-198`
- `task-200`
