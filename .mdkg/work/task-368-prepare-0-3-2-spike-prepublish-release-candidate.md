---
id: task-368
type: task
title: prepare 0.3.2 spike prepublish release candidate
status: todo
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, release, 0.3.2, prepublish]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-349, task-350, task-365, task-366, task-367, test-153, test-154, test-155]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Prepare the spike work for `0.3.2` release-candidate readiness after
implementation, docs, smoke, and hardening tests pass. This task stops at
prepublish dry-run proof and does not perform a real npm publish.

# Acceptance Criteria

- Source/package metadata is bumped to `0.3.2` only during this future task.
- `CHANGELOG.md` has a `0.3.2` release-candidate section covering spike support
  and hardening.
- Full goal required checks pass, including packed smoke, command docs, pack
  dry-run, publish dry-run, and `git diff --check`.
- Dry-run logs report `mdkg@0.3.2`.
- No real npm publish, git tag, push, or global install occurs from this task.

# Files Affected

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- release-readiness evidence nodes

# Implementation Notes

- Use `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for npm dry-run commands.
- If registry already contains `0.3.2`, stop and re-plan `0.3.3`.
- Real publish/global install/temp E2E remains a separate explicit request.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `npm run smoke:spike`
- `npm run smoke:command-docs`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Links / Artifacts

- `test-156`
