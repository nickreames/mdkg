---
id: task-612
type: task
title: prepare 0.4.0 package metadata changelog and generated docs
status: done
priority: 1
epic: epic-202
parent: goal-42
tags: [0.4.0, release-prep, version, changelog, generated-docs, mdkg-dev, docs]
owners: []
links: []
artifacts: [package.json, package-lock.json, CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, docs/_generated/release-notes.json, docs/_generated/cli-reference.md, docs/_generated/command-contract-summary.json, docs/src/content/docs/project/changelog.md, docs/project/changelog.md, mdkg-dev/src/pages/index.astro, mdkg-dev/CLAIMS.md, scripts/smoke-mdkg-dev.js, scripts/smoke-mdkg-dev-seo.js]
relates: []
blocked_by: []
blocks: [test-316, task-613, task-606, test-312]
refs: [goal-42, task-601, task-606, test-312, test-316]
context_refs: []
evidence_refs: [chk-311]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Prepare the source-facing `0.4.0` release metadata before any publish or public
launch proof can start.

# Acceptance Criteria

- `package.json` and `package-lock.json` agree on version `0.4.0`.
- `CHANGELOG.md` contains a `## 0.4.0 - <date>` section that covers every
  publish-bound change since `v0.3.9`; no 0.4.0 release note remains only under
  `## Unreleased`.
- Generated docs and release-note assets are regenerated from the current
  source so package version, latest release, CLI reference, and changelog cards
  no longer report `0.3.9` as the release target.
- `mdkg-dev` structured metadata and public copy are aligned with local
  `0.4.0` release prep while avoiding any live claim that npm already published
  `mdkg@0.4.0` until postpublish validation exists.
- The task records exact remaining gaps instead of allowing `task-605`,
  `task-606`, or `test-312` to proceed on stale `0.3.9` metadata.

# Files Affected

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- generated docs/release-note assets
- `mdkg-dev` and `docs` public launch copy

# Implementation Notes

- This is the first actionable blocker for `goal-42`.
- Keep source copy honest: local pages may describe the `0.4.0` release track,
  but production claims that require npm availability must wait until
  `task-615` and `test-318`.
- Do not push, tag, publish, deploy, or mutate Vercel in this task.

# Test Plan

- `git diff --name-status`
- changelog mapping for `v0.3.9..HEAD`
- version drift audit across package metadata, generated docs, docs changelog,
  mdkg.dev structured metadata, and release cards
- `test-316`

# Links / Artifacts

- `goal-42`
- `task-601`
- `task-606`
- `test-312`
