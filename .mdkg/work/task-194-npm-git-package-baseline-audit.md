---
id: task-194
type: task
title: npm git package baseline audit
status: done
priority: 1
epic: epic-35
tags: [release, audit, npm, git, package]
owners: []
links: [npm:mdkg]
artifacts: [package.json, package-lock.json, CHANGELOG.md, npm view mdkg version dist-tags, npm view mdkg@0.1.3 time, git status --short, git log --oneline --decorate -20]
relates: [epic-35, epic-20, epic-21]
blocked_by: []
blocks: [task-196, task-200, task-202]
refs: [rule-5]
aliases: [release-baseline-audit]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Establish the factual release baseline before any roadmap or publish decision.

# Acceptance Criteria

- Confirm npm latest version and dist-tags for `mdkg`.
- Confirm local `package.json` and lockfile versions.
- Confirm git log, branch, tag, and dirty-tree state.
- Compare local source/package intent against the already-published package.
- Record whether local dirty work is publish-equivalent, unreleased, or mixed.

# Files Affected

- `.mdkg/work/task-194-npm-git-package-baseline-audit.md`
- `package.json`
- `package-lock.json`
- `CHANGELOG.md`

# Implementation Notes

Use read-only npm and git inspection first. If network access is unavailable,
record the failure and retry with approved network access before closing the
task.

# Test Plan

- `npm view mdkg version dist-tags --registry=https://registry.npmjs.org/`
- `node -p "require('./package.json').version"`
- `git status --short`
- `git log --oneline --decorate -20`
- `npm pack --dry-run --json`

# Audit Evidence

- `npm view mdkg version dist-tags --registry=https://registry.npmjs.org/`:
  `version = '0.1.3'`, `latest: '0.1.3'`.
- `npm view mdkg@0.1.3 time ... --json`: `0.1.3` was published
  `2026-05-20T22:31:32.159Z`; tarball integrity is available in the registry
  metadata.
- Local package and lockfile root versions are both `0.1.3`.
- Runtime baseline is Node `v26.0.0` and npm `11.12.1`, satisfying
  `engines.node >=24.15.0`.
- Current branch is `main`; `git tag --points-at HEAD` returned no tag.
- Recent local git log has post-`0.1.1` feature commits through
  `feat: harden mdkg work lifecycle mirrors`; local tags only list `v0.0.7`,
  `v0.0.5`, and `v0.0.4`.
- Dirty tree includes unreleased local source/doc/graph work plus newly created
  audit/roadmap graph nodes. This is commit-readiness work, not a request to
  republish `0.1.3`.

# Decision

The npm package baseline is consistent with `mdkg@0.1.3` already being the
current published version. The release audit should not attempt another real
publish of `0.1.3`.

# Links / Artifacts

- `epic-35`
- `task-196`
- `task-200`
