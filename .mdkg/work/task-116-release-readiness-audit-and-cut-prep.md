---
id: task-116
type: task
title: release readiness audit and cut prep
status: done
priority: 1
epic: epic-17
tags: [0_0_7, release, readiness]
owners: []
links: []
artifacts: [npm-run-build, npm-run-test, node-dist-cli-skill-sync, node-dist-cli-validate, npm-run-cli-check, npm-run-smoke-consumer, .mdkg/work/chk-6-release-cut-and-readiness-audit.md]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-03-12
updated: 2026-03-12
---
# Overview

Run the final `0.0.7` pre-release gates, capture a release-readiness checkpoint, and determine whether the branch is ready for version bump, tag, and npm publish.

# Acceptance Criteria

- build, test, validate, skill sync, CLI parity, and consumer smoke all pass
- a release checkpoint records the current truth and any remaining blockers
- the task is left `done` only when the tree is ready for a normal version-bump / tag / publish sequence

# Files Affected

List files/directories expected to change.

- `.mdkg/work/chk-6-release-cut-and-readiness-audit.md`
- `package.json` and `package-lock.json` only when the release cut actually starts

# Implementation Notes

- keep package version at `0.0.6` during audit work
- release mechanics are out of scope until the audit says the tree is ready

# Test Plan

- `npm run build`
- `npm run test`
- `node dist/cli.js skill sync`
- `node dist/cli.js validate`
- `npm run cli:check`
- `npm_config_cache=/tmp/mdkg-npm-cache npm run smoke:consumer`

# Links / Artifacts

- `chk-6-release-cut-and-readiness-audit.md`
- `dec-20`
