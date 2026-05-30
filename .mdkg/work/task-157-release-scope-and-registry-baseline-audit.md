---
id: task-157
type: task
title: release scope and registry baseline audit
status: done
priority: 1
epic: epic-28
tags: [release, audit, registry, version, 0_1_4]
owners: []
links: [npm:mdkg]
artifacts: [package.json, package-lock.json, CHANGELOG.md]
relates: [epic-28, epic-19, epic-22, epic-23, epic-24, epic-25, epic-26, epic-27]
blocked_by: []
blocks: [task-163, task-164]
refs: [rule-5]
aliases: [release-baseline-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Confirm the exact release baseline before the 0.1.2 publish decision. This
task anchors the audit in npm registry state, local package metadata, changelog
intent, and the commit range since the last published package.

# Acceptance Criteria

- Confirm current npm registry latest for `mdkg`.
- Confirm local `package.json` and `package-lock.json` versions.
- Confirm `CHANGELOG.md` contains the intended unpublished 0.1.2 section.
- Record the commit range and high-level changes since published `0.1.1`.
- Identify whether the publish target remains `mdkg@0.1.2`.

# Files Affected

Read-only audit targets:
- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- `git log`
- npm registry metadata

# Implementation Notes

Use `npm view mdkg version --registry=https://registry.npmjs.org/` for the live
registry check. If network access is unavailable, record the failure and rerun
with approval before closing this task.

# Test Plan

- Run `npm view mdkg version --registry=https://registry.npmjs.org/`.
- Run `node -e` or equivalent package metadata inspection.
- Run `git log --oneline <published-release>..HEAD`.
- Attach the baseline evidence to this task or the final checkpoint.

# Links / Artifacts

- `epic-28`
- `CHANGELOG.md`

# Audit Evidence

- Registry baseline: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm view mdkg version --registry=https://registry.npmjs.org/` returned `0.1.1` after rerun with network approval.
- Local package metadata: `package.json` reports `0.1.2`.
- Local lock metadata: `package-lock.json` reports `0.1.2` at the root and package entry.
- Changelog: `CHANGELOG.md` contains a dated `## 0.1.2 - 2026-05-19` section covering capability cache, init/upgrade parity, archive/work lifecycle helpers, bundles, bundle imports, visibility, archive strictness, and work/order/receipt hardening.
- Commit baseline: there is no local `v0.1.1` git tag, but `git log --oneline` shows `a1b0013 Release mdkg 0.1.1` followed by the unpublished work:
  - `d00d6fd Ship mdkg 0.1.2 archive and work lifecycle`
  - `590f5dd feat: add mdkg graph snapshot bundles`
  - `074604b feat: add read-only bundle imports`
  - `a53ee00 feat: enforce mdkg visibility boundaries`
  - `516f466 feat: complete archive readiness`
  - `a4057a0 feat: harden mdkg work lifecycle mirrors`

# Decision

Publish target has been intentionally rescaled to `mdkg@0.1.2`. The registry
baseline is still `mdkg@0.1.1`, so publishing `0.1.2` releases the accumulated
audited changes as a single next-version package rather than skipping ahead to
the originally planned `0.1.4` local label.
